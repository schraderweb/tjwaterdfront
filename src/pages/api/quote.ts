/**
 * /api/quote — POST endpoint for the quote request form.
 * Validates the payload (rejecting honeypot bots), inserts a row into the
 * Turso (libsql) database, and returns JSON the client uses to show success.
 */
import { createClient } from "@libsql/client";

export const prerender = false;

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

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
