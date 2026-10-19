import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  product: text("product").notNull(),
  occasion: text("occasion").notNull(),
  neededBy: text("needed_by"),
  budget: text("budget"),
  notes: text("notes").notNull(),
  status: text("status").notNull().default("new"),
  quotedPrice: text("quoted_price"),
  paymentStatus: text("payment_status").notNull().default("unpaid"),
  deliveryNote: text("delivery_note"),
  adminNotes: text("admin_notes"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});

