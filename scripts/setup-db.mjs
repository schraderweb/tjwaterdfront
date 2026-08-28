/**
 * setup-db.mjs — creates the quote_requests table (if missing) and seeds it
 * with mock data so the site has realistic records to display/test with.
 *
 * Usage: node --env-file=.env scripts/setup-db.mjs
 * Requires TURSO_URL and TURSO_AUTH_TOKEN in .env.
 */
import { createClient } from "@libsql/client";

const url = process.env.TURSO_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Missing TURSO_URL or TURSO_AUTH_TOKEN in .env");
  process.exit(1);
}

const db = createClient({ url, authToken });

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS quote_requests (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT NOT NULL,
  location      TEXT NOT NULL,
  project_type  TEXT NOT NULL,
  message       TEXT,
  company       TEXT,
  status        TEXT NOT NULL DEFAULT 'new',
  created_at    TEXT NOT NULL
);
`;

const MOCK_QUOTES = [
  {
    name: "Michael Thornton",
    email: "michael.t@shorelinehomes.com",
    phone: "(906) 555-0142",
    location: "Charlevoix, MI",
    project_type: "Dock Installation",
    message:
      "Looking to replace a 4-slip aluminum dock on our lakefront property. Need a quote for materials and install before spring.",
  },
  {
    name: "Sarah Lindqvist",
    email: "sarah.l@northharbor.net",
    phone: "(231) 555-0177",
    location: "Petoskey, MI",
    project_type: "Boat Lift",
    message:
      "Interested in a 10,000 lb lift for our new pontoon. Also curious about canopy options and how far out from the dock it extends.",
  },
  {
    name: "David & Karen Mills",
    email: "mills.dk@gmail.com",
    phone: "(989) 555-0110",
    location: "Traverse City, MI",
    project_type: "Seawall",
    message:
      "Existing seawall is failing along a 120 ft section. Please provide an estimate for steel sheet pile replacement.",
  },
  {
    name: "Amanda Reyes",
    email: "amanda.reyes@me.com",
    phone: "(616) 555-0189",
    location: "Frankfort, MI",
    project_type: "Patio",
    message:
      "We want a paver patio (~400 sq ft) with a fire pit area added off our lakeside deck. Can you send some design options?",
  },
  {
    name: "Robert Chen",
    email: "rob.chen@outlook.com",
    phone: "(517) 555-0135",
    location: "Holland, MI",
    project_type: "Service / Repair",
    message:
      "Our boat lift cable snapped last weekend and the cradle is sagging. Need someone out ASAP before the next storm.",
  },
  {
    name: "Emily Novak",
    email: "emily.novak@yahoo.com",
    phone: "(269) 555-0163",
    location: "South Haven, MI",
    project_type: "Landscaping",
    message:
      "New build on the water — looking for full landscaping including shoreline plants, a small retaining wall, and sod.",
  },
];

function insert(quote) {
  return db.execute({
    sql: `INSERT INTO quote_requests (id, name, email, phone, location, project_type, message, company, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      crypto.randomUUID(),
      quote.name,
      quote.email,
      quote.phone,
      quote.location,
      quote.project_type,
      quote.message ?? null,
      null,
      "new",
      new Date(Date.now() - Math.floor(Math.random() * 14) * 864e5).toISOString(),
    ],
  });
}

try {
  await db.execute(CREATE_TABLE);
  console.log("Table quote_requests ready (created if missing).");

  const existing = await db.execute("SELECT COUNT(*) AS count FROM quote_requests");
  const count = existing.rows[0].count;

  if (Number(count) === 0) {
    for (const quote of MOCK_QUOTES) {
      await insert(quote);
    }
    console.log(`Seeded ${MOCK_QUOTES.length} mock quote requests.`);
  } else {
    console.log(`Skipping seed — ${count} records already present.`);
  }

  const rows = await db.execute(
    "SELECT name, email, project_type, status FROM quote_requests ORDER BY created_at DESC"
  );
  console.table(rows.rows);
} catch (err) {
  console.error("DB setup failed:", err.message);
  process.exit(1);
} finally {
  db.close();
}
