/**
 * test-quote-api.mjs — hits a running /api/quote and checks every security path.
 * Run against `astro dev` started with Cloudflare's Turnstile test keys
 * (https://developers.cloudflare.com/turnstile/troubleshooting/testing/) and a scratch DB:
 *
 *   TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA (always passes)
 *   node scripts/test-quote-api.mjs http://localhost:4321 pass
 *   ...with secret 2x0000000000000000000000000000000AA → `fail`, 3x0000000000000000000000000000000AA → `spent`
 *
 * Needs TURSO_URL (+ TURSO_AUTH_TOKEN) for the same DB so it can reset the rate limiter between cases.
 * Never point this at production: it clears rate-limit rows.
 */
import { createClient } from "@libsql/client";

const [base = "http://localhost:4321", mode = "pass"] = process.argv.slice(2);
const db = createClient({ url: process.env.TURSO_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const url = `${base}/api/quote`;
const TOKEN = "XXXX.DUMMY.TOKEN.XXXX";
const legit = () => ({
  name: "Test Customer",
  email: `customer+${Date.now()}${Math.random()}@example.com`,
  phone: "(517) 555-0100",
  address: "1 Lake Shore Dr",
  city: "Howell",
  state: "MI",
  project_type: "Boat Lift",
  message: "Need a 4,000 lb lift before May.",
  referral_code: "",
  "cf-turnstile-response": TOKEN,
});

const resetLimits = () => db.execute("DELETE FROM quote_rate_limits WHERE key LIKE 'ip:%'");
const post = (body, headers = { "Content-Type": "application/json" }) =>
  fetch(url, { method: "POST", headers, body: typeof body === "string" ? body : JSON.stringify(body) }).then(
    async (r) => ({ status: r.status, retryAfter: r.headers.get("retry-after"), ...(await r.json().catch(() => ({})) ) })
  );

let failed = 0;
async function check(name, run, expect) {
  await resetLimits();
  const res = await run();
  const ok = Object.entries(expect).every(([k, v]) => (typeof v === "function" ? v(res[k]) : res[k] === v));
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`, ok ? "" : JSON.stringify(res));
}

if (mode === "pass") {
  await check("legitimate submission", () => post(legit()), { status: 200, ok: true });
  const same = legit();
  await check("first of a repeated submission", () => post(same), { status: 200, ok: true });
  await check("exact repeat is accepted but not re-sent", () => post(same), { status: 200, duplicate: true });
  await check("direct API call without token", () => post({ ...legit(), "cf-turnstile-response": undefined }), { status: 403, code: "verification_required" });
  await check("honeypot filled → silent drop", () => post({ ...legit(), referral_code: "SEO4U" }), { status: 200, ok: true });
  await check("form-encoded body", () => post("name=x", { "Content-Type": "application/x-www-form-urlencoded" }), {
    // Astro's origin check (403) or our content-type check (415), depending on the Origin header.
    status: (s) => s === 403 || s === 415,
  });
  await check("malformed JSON", () => post("{nope"), { status: 400, code: "invalid_request" });
  await check("JSON array body", () => post("[]"), { status: 400, code: "invalid_request" });
  await check("oversized body", () => post({ ...legit(), message: "a".repeat(20_000) }), { status: 413 });
  await check("message over 3000 chars", () => post({ ...legit(), message: "a".repeat(3001) }), { status: 400, code: "invalid_field" });
  await check("bad email", () => post({ ...legit(), email: "nope@" }), { status: 400, code: "invalid_field" });
  await check("header injection in email", () => post({ ...legit(), email: "a@b.com\r\nBcc: x@evil.com" }), { status: 400, code: "invalid_field" });
  await check("header injection in name", () => post({ ...legit(), name: "Bob\r\nBcc: x@evil.com" }), { status: 400, code: "invalid_field" });
  await check("bad phone", () => post({ ...legit(), phone: "call me" }), { status: 400, code: "invalid_field" });
  await check("state outside allowlist", () => post({ ...legit(), state: "CA" }), { status: 400, code: "invalid_field" });
  await check("non-string field", () => post({ ...legit(), name: { $gt: "" } }), { status: 400, code: "invalid_field" });
  await check("HTML in fields is accepted (escaped in email)", () => post({ ...legit(), name: '<b>Eve</b> "x"', message: "<script>alert(1)</script>" }), { status: 200, ok: true });

  await resetLimits();
  const statuses = [];
  for (let i = 0; i < 7; i++) statuses.push((await post({ ...legit(), "cf-turnstile-response": undefined })).status);
  const limited = await post(legit());
  const ok = statuses.slice(0, 5).every((s) => s === 403) && statuses.slice(5).every((s) => s === 429) && limited.status === 429 && Number(limited.retryAfter) > 0;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  rate limit: 6th+ request in 15 min → 429 with Retry-After`, ok ? "" : JSON.stringify({ statuses, limited }));
} else if (mode === "fail") {
  await check("invalid token rejected", () => post(legit()), { status: 403, code: "verification_failed" });
} else if (mode === "spent") {
  await check("expired/reused token reported as expired", () => post(legit()), { status: 403, code: "verification_expired" });
}

await resetLimits();
db.close();
console.log(failed ? `\n${failed} check(s) failed` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
