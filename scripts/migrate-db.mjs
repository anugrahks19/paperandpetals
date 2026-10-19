import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}
const sql = postgres(url, { max: 1, prepare: false });
try {
  await sql.unsafe("CREATE TABLE IF NOT EXISTS orders (id text PRIMARY KEY, name text NOT NULL, email text NOT NULL, phone text NOT NULL, product text NOT NULL, occasion text NOT NULL, needed_by text, budget text, notes text NOT NULL, status text NOT NULL DEFAULT 'new', quoted_price text, payment_status text NOT NULL DEFAULT 'unpaid', delivery_note text, admin_notes text, created_at text NOT NULL DEFAULT (now() at time zone 'utc')::text, updated_at text NOT NULL DEFAULT (now() at time zone 'utc')::text)");
  await sql.unsafe("CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC)");
  await sql.unsafe("CREATE INDEX IF NOT EXISTS orders_email_idx ON orders (email)");
  console.log("Booking database ready.");
} finally {
  await sql.end();
}
