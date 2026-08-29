CREATE TABLE `social_connections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platform` enum('meta','youtube') NOT NULL,
	`accountId` varchar(180) NOT NULL,
	`accountName` varchar(255),
	`accessToken` text NOT NULL,
	`refreshToken` text,
	`tokenExpiresAt` timestamp,
	`scopes` text,
	`status` enum('connected','expired','revoked','needs_review') NOT NULL DEFAULT 'connected',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `social_connections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `tracked_links` ADD `network` varchar(80) DEFAULT 'cj' NOT NULL;--> statement-breakpoint
ALTER TABLE `tracked_links` ADD `externalLinkId` varchar(180);--> statement-breakpoint
ALTER TABLE `tracked_links` ADD `imageUrl` text;--> statement-breakpoint
ALTER TABLE `tracked_links` ADD `linkStatus` enum('active','expired','paused','needs_review') DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `tracked_links` ADD `firstSeenAt` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `tracked_links` ADD `lastSeenAt` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `tracked_links` ADD `expiresAt` timestamp;--> statement-breakpoint
ALTER TABLE `tracked_links` ADD `lastCheckedAt` timestamp;--> statement-breakpoint
ALTER TABLE `tracked_links` ADD `lastCheckError` text;--> statement-breakpoint
CREATE INDEX `social_connections_platform_idx` ON `social_connections` (`platform`,`status`);--> statement-breakpoint
CREATE INDEX `tracked_links_lifecycle_idx` ON `tracked_links` (`network`,`linkStatus`,`lastCheckedAt`);