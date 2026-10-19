ALTER TABLE `orders` ADD `quoted_price` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `payment_status` text DEFAULT 'unpaid' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `delivery_note` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `admin_notes` text;