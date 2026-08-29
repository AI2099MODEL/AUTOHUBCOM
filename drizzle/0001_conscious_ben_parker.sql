CREATE TABLE `attribution_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`contentPackageId` int,
	`platform` varchar(80) NOT NULL,
	`eventType` enum('click','outbound','order','revenue') NOT NULL,
	`amount` decimal(12,2),
	`externalReference` varchar(180),
	`consentGiven` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attribution_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content_packages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`platform` enum('instagram','facebook','youtube') NOT NULL,
	`title` varchar(255),
	`caption` text,
	`script` text,
	`callToAction` varchar(255),
	`disclosure` text NOT NULL,
	`trackingUrl` text,
	`status` enum('draft','approved','scheduled','published','blocked') NOT NULL DEFAULT 'draft',
	`scheduledAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `content_packages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(160) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`category` varchar(120) NOT NULL,
	`productType` enum('affiliate','direct') NOT NULL,
	`price` decimal(12,2),
	`currency` varchar(8) NOT NULL DEFAULT 'USD',
	`imageUrl` text,
	`destinationUrl` text,
	`status` enum('draft','active','paused') NOT NULL DEFAULT 'draft',
	`availabilityStatus` enum('unknown','in_stock','out_of_stock') NOT NULL DEFAULT 'unknown',
	`claimSafetyStatus` enum('needs_review','approved','blocked') NOT NULL DEFAULT 'needs_review',
	`audienceFitScore` int NOT NULL DEFAULT 0,
	`profitabilityScore` int NOT NULL DEFAULT 0,
	`availabilityScore` int NOT NULL DEFAULT 0,
	`safetyScore` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `publishing_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentPackageId` int NOT NULL,
	`platform` enum('instagram','facebook','youtube') NOT NULL,
	`integrationStatus` enum('not_connected','connected','blocked','manual_fallback') NOT NULL DEFAULT 'not_connected',
	`status` enum('queued','running','published','failed','paused') NOT NULL DEFAULT 'queued',
	`retryCount` int NOT NULL DEFAULT 0,
	`lastError` text,
	`scheduledAt` timestamp,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `publishing_jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tracked_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`token` varchar(80) NOT NULL,
	`source` varchar(80) NOT NULL,
	`campaign` varchar(120) NOT NULL,
	`destinationUrl` text NOT NULL,
	`clickCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tracked_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `tracked_links_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE INDEX `attribution_events_event_idx` ON `attribution_events` (`eventType`,`platform`);--> statement-breakpoint
CREATE INDEX `content_product_platform_idx` ON `content_packages` (`productId`,`platform`);--> statement-breakpoint
CREATE INDEX `products_status_idx` ON `products` (`status`);--> statement-breakpoint
CREATE INDEX `products_type_idx` ON `products` (`productType`);--> statement-breakpoint
CREATE INDEX `tracked_links_product_idx` ON `tracked_links` (`productId`);