CREATE TABLE `offer_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`sourceType` enum('affiliate','supplier') NOT NULL,
	`endpointUrl` text NOT NULL,
	`enabled` boolean NOT NULL DEFAULT false,
	`lastCheckedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `offer_sources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`orderReference` varchar(80) NOT NULL,
	`customerName` varchar(160) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`status` enum('pending','paid','fulfilled','cancelled') NOT NULL DEFAULT 'pending',
	`amount` decimal(12,2) NOT NULL,
	`currency` varchar(8) NOT NULL DEFAULT 'USD',
	`consentGiven` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderReference_unique` UNIQUE(`orderReference`)
);
