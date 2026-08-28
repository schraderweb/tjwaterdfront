/**
 * /api/quote — POST endpoint for the quote request form.
 * Validates the payload (rejecting honeypot bots), inserts a row into the
 * Turso (libsql) database, and notifies the team via Resend email.
 */
import { createClient } from "@libsql/client";

export const prerender = false;

const RESEND_API = "https://api.resend.com/emails";

function getDb() {
  return createClient({
    url: import.meta.env.TURSO_URL,
    authToken: import.meta.env.TURSO_AUTH_TOKEN,
  });
}

export async function POST({ request }) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim().toLowerCase();
  const phone = String(payload.phone ?? "").trim();
  const location = String(payload.location ?? "").trim();
  const projectType = String(payload.project_type ?? "").trim();
  const message = String(payload.message ?? "").trim();
  const company = String(payload.company ?? "").trim();

  if (!name || !email || !phone || !location || !projectType) {
    return new Response(JSON.stringify({ ok: false, error: "Missing required fields." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (company) {
    return new Response(JSON.stringify({ ok: true, honeypot: true }), { status: 200 });
  }

  const db = getDb();
  try {
    await db.execute({
      sql: `INSERT INTO quote_requests (id, name, email, phone, location, project_type, message, company, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        crypto.randomUUID(),
        name,
        email,
        phone,
        location,
        projectType,
        message || null,
        null,
        "new",
        new Date().toISOString(),
      ],
    });
  } catch (err) {
    console.error("quote insert failed:", err);
    return new Response(JSON.stringify({ ok: false, error: "Could not save your request." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    db.close();
  }

  await sendNotificationEmail({ name, email, phone, location, projectType, message });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

async function sendNotificationEmail(quote: {
  name: string;
  email: string;
  phone: string;
  location: string;
  projectType: string;
  message: string;
}) {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) return;

  const fromEmail = import.meta.env.FROM_EMAIL || "tj-form@fastgrowth.top";
  const toEmails = (import.meta.env.TO_EMAILS || "tjwaterfrontservices@gmail.com")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);

  const html = buildEmail(quote);

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmails,
        subject: `New Quote Request from ${quote.name}`,
        html,
      }),
    });

    if (!res.ok) {
      console.error("Resend error:", await res.json().catch(() => null));
    }
  } catch (err) {
    console.error("Resend send failed:", err);
  }
}

function buildEmail({ name, email, phone, location, projectType, message }: {
  name: string;
  email: string;
  phone: string;
  location: string;
  projectType: string;
  message: string;
}) {
  const rows = [
    { label: "Name", value: name },
    { label: "Email", value: email },
    { label: "Phone", value: phone },
    { label: "Project Location", value: location },
    { label: "Project Type", value: projectType },
  ]
    .map(
      (row, i) =>
        `<tr>
          <td style="padding:12px 0;${i > 0 ? "border-top:1px solid #F5F5F4;" : ""}">
            <strong style="color:#0C2135;font-size:15px;">${escapeHtml(row.label)}</strong>
          </td>
          <td style="padding:12px 0;${i > 0 ? "border-top:1px solid #F5F5F4;" : ""}text-align:right;color:#333F48;font-size:15px;">${escapeHtml(row.value)}</td>
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
