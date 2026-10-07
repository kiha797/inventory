CREATE TABLE `batches` (
	`id` text PRIMARY KEY NOT NULL,
	`company` text NOT NULL,
	`day` text NOT NULL,
	`created` text NOT NULL,
	`target` integer NOT NULL,
	`rules` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `batches_company_day` ON `batches` (`company`,`day`);--> statement-breakpoint
CREATE TABLE `counts` (
	`id` text PRIMARY KEY NOT NULL,
	`batch` text NOT NULL,
	`product` text NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`maker` text NOT NULL,
	`location` text NOT NULL,
	`unit` text NOT NULL,
	`band` text NOT NULL,
	`snapshot` integer NOT NULL,
	`actual` integer,
	`recount` integer,
	`status` text DEFAULT 'pending' NOT NULL,
	`actor` text DEFAULT '' NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`updated` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`batch`) REFERENCES `batches`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `counts_batch_product` ON `counts` (`batch`,`product`);--> statement-breakpoint
CREATE INDEX `counts_product_batch` ON `counts` (`product`,`batch`);--> statement-breakpoint
CREATE INDEX `counts_batch_status` ON `counts` (`batch`,`status`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`count` text NOT NULL,
	`action` text NOT NULL,
	`actor` text NOT NULL,
	`detail` text NOT NULL,
	`created` text NOT NULL,
	FOREIGN KEY (`count`) REFERENCES `counts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `events_count_created` ON `events` (`count`,`created`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`company` text NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`maker` text NOT NULL,
	`location` text NOT NULL,
	`unit` text NOT NULL,
	`stock` integer NOT NULL,
	`sales` integer NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_company_code` ON `products` (`company`,`code`);--> statement-breakpoint
CREATE INDEX `products_company_sales` ON `products` (`company`,`sales`);--> statement-breakpoint
CREATE TABLE `settings` (
	`company` text PRIMARY KEY NOT NULL,
	`daily` integer DEFAULT 120 NOT NULL,
	`top` integer DEFAULT 2000 NOT NULL,
	`low` integer DEFAULT 10 NOT NULL,
	`ratio` integer DEFAULT 50 NOT NULL,
	`exclude` integer DEFAULT 7 NOT NULL
);
