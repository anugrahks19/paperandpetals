CREATE TABLE IF NOT EXISTS "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"product" text NOT NULL,
	"occasion" text NOT NULL,
	"needed_by" text,
	"budget" text,
	"notes" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"quoted_price" text,
	"payment_status" text DEFAULT 'unpaid' NOT NULL,
	"delivery_note" text,
	"admin_notes" text,
	"created_at" text DEFAULT (now() at time zone 'utc')::text NOT NULL,
	"updated_at" text DEFAULT (now() at time zone 'utc')::text NOT NULL
);
