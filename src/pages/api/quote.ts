/**
 * /api/quote - POST endpoint for the quote request form.
 * Every check runs before anything is stored or emailed, in this order:
 * body size/JSON → IP rate limit → honeypot → schema → Turnstile → duplicate → DB insert → email.
 * Rejections are logged as one JSON line that holds no personal data.
 */
import type { APIContext } from "astro";
import { createHmac } from "node:crypto";
import { getSecret } from "astro:env/server";
import { createClient, type Client } from "@libsql/client";
import { stateOptions } from "@/data/formLocations";
import { site } from "@/data/site";

export const prerender = false;

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAX_BODY_CHARS = 16_000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60_000;
const DUPLICATE_WINDOW_MS = 24 * 60 * 60_000;

const SINGLE_LINE_CONTROL = /[\u0000-\u001F\u007F\u2028\u2029]/;
const MULTI_LINE_CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
const PHONE_RE = /^\+?[\d\s().-]+((x|ext\.?)\s*\d{1,6})?$/i;
const STATES = new Set(stateOptions.map((option) => option.value));

type Field = "name" | "email" | "phone" | "address" | "city" | "state" | "project_type" | "message";
type Rule = { max: number; min?: number; required?: boolean; multiline?: boolean; test?: (v: string) => boolean; error: string };

const FIELDS: Record<Field, Rule> = {
  name: { min: 2, max: 100, required: true, error: "Please enter your full name (up to 100 characters)." },
  email: { max: 254, required: true, test: (v) => EMAIL_RE.test(v), error: "Please enter a valid email address." },
  phone: {
    max: 30,
    required: true,
    test: (v) => PHONE_RE.test(v) && /^\D*(\d\D*){7,15}$/.test(v.replace(/(x|ext\.?)\s*\d+$/i, "")),
    error: "Please enter a valid phone number.",
  },
  address: { max: 200, error: "Please keep the project address under 200 characters." },
  city: { max: 100, required: true, error: "Please enter your city." },
  state: { max: 2, required: true, test: (v) => STATES.has(v), error: "Please choose a state from the list." },
  project_type: { max: 60, required: true, error: "Please choose a project type." },
  message: { max: 3000, multiline: true, error: "Please keep your message under 3,000 characters." },
};

const MSG = {
  invalid: "We couldn't read your request. Please refresh the page and try again.",
  rateLimited: `Too many requests. Please wait a few minutes and try again, or call us at ${site.phoneDisplay}.`,
  verifyRequired: "Please complete the verification check and send your request again.",
  verifyExpired: "The verification check expired. Please send your request again.",
  verifyFailed: `We couldn't verify your request. Please try again, or call us at ${site.phoneDisplay}.`,
  unavailable: `We couldn't send your request right now. Please try again shortly, or call us at ${site.phoneDisplay}.`,
};

type Quote = Record<Field, string> & { location: string };

export async function POST(context: APIContext) {
  const { request } = context;
  // Secrets are read at request time from the host environment, never inlined into the build.
  const secret = getSecret("TURNSTILE_SECRET_KEY");
  if (!secret) {
    log("error", { event: "quote_config_error", reason: "missing_turnstile_secret" });
    return json(503, { ok: false, code: "unavailable", error: MSG.unavailable });
  }

  // Cheap checks first: they need no DB round-trip.
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return reject("unsupported_content_type", 415, "invalid_request", MSG.invalid);
  }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_CHARS) {
    return reject("body_too_large", 413, "invalid_request", MSG.invalid);
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) return reject("body_too_large", 413, "invalid_request", MSG.invalid);

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return reject("invalid_json", 400, "invalid_request", MSG.invalid);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return reject("invalid_json", 400, "invalid_request", MSG.invalid);
  }

  const ip = clientIp(context);
  // Keyed hash: the rate-limit table and logs never hold a raw IP.
  const client = hmac(secret, `ip:${ip}`);
  const db = getDb();
  let quote: Quote;

  try {
    await ensureSchema(db);

    const limit = await hit(db, `ip:${client}`, RATE_LIMIT_WINDOW_MS);
    if (limit.count > RATE_LIMIT_MAX) {
      return reject("rate_limited", 429, "rate_limited", MSG.rateLimited, { client }, { "Retry-After": String(limit.retryAfter) });
    }

    // Honeypot: real visitors never see or fill this field. Pretend success so bots don't adapt.
    if (body.referral_code !== undefined && body.referral_code !== "") {
      log("warn", { event: "quote_rejected", reason: "honeypot", status: 200, client });
      return json(200, { ok: true });
    }

    const result = validate(body);
    if ("field" in result) {
      return reject("invalid_field", 400, "invalid_field", FIELDS[result.field].error, { client, field: result.field });
    }
    quote = result.data;

    const token = body["cf-turnstile-response"];
    if (typeof token !== "string" || !token || token.length > 2048) {
      return reject("turnstile_missing", 403, "verification_required", MSG.verifyRequired, { client });
    }
    const verdict = await verifyTurnstile(secret, token, ip);
    if (verdict.outcome === "unavailable") {
      return reject("turnstile_unavailable", 503, "unavailable", MSG.unavailable, { client, errors: verdict.errors });
    }
    if (verdict.outcome === "misconfigured") {
      log("error", { event: "quote_config_error", reason: "turnstile_secret_rejected", errors: verdict.errors });
      return json(503, { ok: false, code: "unavailable", error: MSG.unavailable });
    }
    if (verdict.outcome === "expired") {
      return reject("turnstile_expired", 403, "verification_expired", MSG.verifyExpired, { client, errors: verdict.errors });
    }
    if (verdict.outcome !== "ok") {
      return reject("turnstile_failed", 403, "verification_failed", MSG.verifyFailed, { client, errors: verdict.errors });
    }

    // Same person sending the same request twice (double click, refresh, re-send): store and email once.
    const dupKey = `dup:${hmac(secret, [quote.email, quote.phone.replace(/\D/g, ""), quote.city.toLowerCase(), quote.state, quote.project_type, quote.message.toLowerCase()].join("\n"))}`;
    if ((await hit(db, dupKey, DUPLICATE_WINDOW_MS)).count > 1) {
      log("warn", { event: "quote_rejected", reason: "duplicate", status: 200, client });
      return json(200, { ok: true, duplicate: true });
    }

    try {
      await db.execute({
        sql: `INSERT INTO quote_requests (id, name, email, phone, address, location, project_type, message, company, status, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          crypto.randomUUID(),
          quote.name,
          quote.email,
          quote.phone,
          quote.address,
          quote.location,
          quote.project_type,
          quote.message || null,
          null,
          "new",
          new Date().toISOString(),
        ],
      });
    } catch (err) {
      // Let the customer retry without being treated as a duplicate.
      await db.execute({ sql: "DELETE FROM quote_rate_limits WHERE key = ?", args: [dupKey] }).catch(() => {});
      throw err;
    }
  } catch (err) {
    log("error", { event: "quote_error", reason: "storage_failed", message: err instanceof Error ? err.message : String(err) });
    return json(500, { ok: false, code: "unavailable", error: "Could not save your request. Please try again." });
  } finally {
    db.close();
  }

  await sendNotificationEmail({
    name: quote.name,
    email: quote.email,
    phone: quote.phone,
    address: quote.address,
    city: quote.city,
    state: quote.state,
    location: quote.location,
    projectType: quote.project_type,
    message: quote.message,
  });

  return json(200, { ok: true });
}

function validate(body: Record<string, unknown>): { data: Quote } | { field: Field } {
  const data = {} as Quote;
  for (const [field, rule] of Object.entries(FIELDS) as [Field, Rule][]) {
    const raw = body[field] ?? "";
    if (typeof raw !== "string") return { field };
    const value = raw.normalize("NFC").trim();
    const invalid =
      (rule.required && !value) ||
      value.length > rule.max ||
      (value !== "" && value.length < (rule.min ?? 0)) ||
      (rule.multiline ? MULTI_LINE_CONTROL : SINGLE_LINE_CONTROL).test(value) ||
      (value !== "" && rule.test !== undefined && !rule.test(value));
    if (invalid) return { field };
    data[field] = value;
  }
  data.email = data.email.toLowerCase();
  data.location = `${data.city}, ${data.state}`;
  return { data };
}

async function verifyTurnstile(secret: string, token: string, ip: string) {
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, ...(ip !== "unknown" ? { remoteip: ip } : {}) }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    const errors = data["error-codes"] ?? [];
    if (data.success === true) return { outcome: "ok", errors } as const;
    if (errors.some((e) => e.includes("secret"))) return { outcome: "misconfigured", errors } as const;
    if (errors.includes("timeout-or-duplicate")) return { outcome: "expired", errors } as const;
    if (errors.includes("internal-error")) return { outcome: "unavailable", errors } as const;
    return { outcome: "failed", errors } as const;
  } catch (err) {
    return { outcome: "unavailable", errors: [err instanceof Error ? err.name : "fetch_failed"] } as const;
  }
}

function getDb() {
  return createClient({
    url: getSecret("TURSO_URL") ?? "",
    authToken: getSecret("TURSO_AUTH_TOKEN"),
  });
}

let schemaReady: Promise<unknown> | undefined;
function ensureSchema(db: Client) {
  // Once per server instance, so a fresh database needs no manual migration.
  schemaReady ??= db
    .execute(
      `CREATE TABLE IF NOT EXISTS quote_rate_limits (
         key TEXT PRIMARY KEY,
         window_start INTEGER NOT NULL,
         count INTEGER NOT NULL
       )`
    )
    .catch((err) => {
      schemaReady = undefined;
      throw err;
    });
  return schemaReady;
}

/** Fixed-window counter: one atomic upsert per call, so concurrent requests can't race past the limit. */
async function hit(db: Client, key: string, windowMs: number) {
  const now = Date.now();
  const rs = await db.execute({
    sql: `INSERT INTO quote_rate_limits (key, window_start, count) VALUES (?1, ?2, 1)
          ON CONFLICT(key) DO UPDATE SET
            count = CASE WHEN window_start <= ?3 THEN 1 ELSE count + 1 END,
            window_start = CASE WHEN window_start <= ?3 THEN ?2 ELSE window_start END
          RETURNING count, window_start`,
    args: [key, now, now - windowMs],
  });
  if (Math.random() < 0.02) {
    await db
      .execute({ sql: "DELETE FROM quote_rate_limits WHERE window_start < ?", args: [now - DUPLICATE_WINDOW_MS] })
      .catch(() => {});
  }
  const row = rs.rows[0];
  return {
    count: Number(row.count),
    retryAfter: Math.max(1, Math.ceil((Number(row.window_start) + windowMs - now) / 1000)),
  };
}

function clientIp(context: APIContext) {
  try {
    if (context.clientAddress) return context.clientAddress;
  } catch {
    // Adapter could not determine the address; fall through.
  }
  return context.request.headers.get("x-real-ip") ?? "unknown";
}

function hmac(secret: string, value: string) {
  return createHmac("sha256", secret).update(value).digest("hex").slice(0, 32);
}

function json(status: number, body: unknown, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });
}

function reject(
  reason: string,
  status: number,
  code: string,
  error: string,
  details: Record<string, unknown> = {},
  headers: Record<string, string> = {}
) {
  log("warn", { event: "quote_rejected", reason, status, ...details });
  return json(status, { ok: false, code, error }, headers);
}

function log(level: "warn" | "error", entry: Record<string, unknown>) {
  console[level](JSON.stringify({ ...entry, client: typeof entry.client === "string" ? entry.client.slice(0, 12) : undefined, at: new Date().toISOString() }));
}

async function sendNotificationEmail(quote: {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  location: string;
  projectType: string;
  message: string;
}) {
  const apiKey = getSecret("RESEND_API_KEY");
  if (!apiKey) {
    log("error", { event: "quote_config_error", reason: "missing_resend_key" });
    return;
  }

  const fromEmail = getSecret("FROM_EMAIL") || "tj-form@fastgrowth.top";
  const toEmails = (getSecret("TO_EMAILS") || "tjwaterfrontservices@gmail.com")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);

  const html = buildEmail(quote);
  // Strip address-list syntax from the display name so it can't add recipients.
  const displayName = quote.name.replace(/["\\<>,;:@\r\n]/g, "").trim();
  const replyTo = isValidEmail(quote.email) ? `"${displayName}" <${quote.email}>` : undefined;

  try {
    const res = await fetch(getSecret("RESEND_API_URL") || "https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmails,
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject: `New Quote Request from ${quote.name}`,
        html,
      }),
    });

    if (!res.ok) {
      log("error", { event: "quote_email_failed", status: res.status, body: await res.json().catch(() => null) });
    }
  } catch (err) {
    log("error", { event: "quote_email_failed", message: err instanceof Error ? err.message : String(err) });
  }
}

function buildEmail({ name, email, phone, address, city, state, location, projectType, message }: {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  location: string;
  projectType: string;
  message: string;
}) {
  const rows = [
    { label: "Name", value: name },
    { label: "Email", value: email, href: `mailto:${email}` },
    { label: "Phone", value: phone },
    ...(address ? [{ label: "Project Address", value: address }] : []),
    ...(city ? [{ label: "City", value: city }] : []),
    ...(state ? [{ label: "State", value: state }] : []),
    ...(city || state ? [] : [{ label: "Project Location", value: location }]),
    { label: "Project Type", value: projectType },
  ]
    .map(
      (row, i) =>
        `<tr>
          <td style="padding:12px 0;${i > 0 ? "border-top:1px solid #F5F5F4;" : ""}">
            <strong style="color:#0C2135;font-size:15px;">${escapeHtml(row.label)}</strong>
          </td>
          <td style="padding:12px 0;${i > 0 ? "border-top:1px solid #F5F5F4;" : ""}text-align:right;color:#333F48;font-size:15px;">${
            row.href
              ? `<a href="${escapeHtml(row.href)}" style="color:#C9953D;text-decoration:none;">${escapeHtml(row.value)}</a>`
              : escapeHtml(row.value)
          }</td>
        </tr>`
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>T&J Waterfront Services \u2013 New Quote Request</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F0E7;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F0E7;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="680" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#0C2135;padding:48px 48px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.3px;">T&amp;J Waterfront Services</h1>
              <p style="margin:4px 0 0;color:#C9953D;font-size:15px;">New Quote Request</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 48px;">
              <p style="margin:0 0 6px;color:#78716C;font-size:16px;">A new quote request was submitted through the website. Details below:</p>
              <hr style="border:none;border-top:1px solid #E7E5E4;margin:20px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${rows}
              </table>
              <hr style="border:none;border-top:1px solid #E7E5E4;margin:20px 0;">
              <p style="margin:0 0 8px;color:#0C2135;font-size:16px;font-weight:700;">Message</p>
              <p style="margin:0;color:#333F48;font-size:16px;line-height:1.6;background:#F8F6F1;padding:20px;border-radius:8px;border-left:3px solid #C9953D;">${escapeHtml(message || "\u2014")}</p>
              <a href="mailto:${escapeHtml(email)}?subject=${escapeHtml(encodeURIComponent(`Re: Your quote request \u2013 ${name}`))}" style="display:inline-block;margin-top:24px;background:#0C2135;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:8px;font-size:15px;font-weight:600;">Reply to ${escapeHtml(name)}</a>
            </td>
          </tr>
          <tr>
            <td style="background:#F8F6F1;padding:32px 48px;text-align:center;border-top:1px solid #E7E5E4;">
              <p style="margin:0 0 12px;color:#78716C;font-size:15px;font-style:italic;line-height:1.5;">"Your trusted waterfront experts \u2014 docks, lifts, seawalls &amp; more."</p>
              <p style="margin:0;color:#8A939E;font-size:14px;">T&amp;J Waterfront Services &bull; Howell, MI &bull; (517) 294-5577</p>
              <p style="margin:4px 0 0;color:#8A939E;font-size:13px;">tjwaterfrontservices@gmail.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function isValidEmail(value: string) {
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
