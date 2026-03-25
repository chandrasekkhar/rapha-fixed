CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stripePaymentIntentId` varchar(255),
	`stripeSessionId` varchar(255),
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'usd',
	`status` enum('pending','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`plan` enum('pro','premium') NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_stripePaymentIntentId_unique` UNIQUE(`stripePaymentIntentId`),
	CONSTRAINT `payments_stripeSessionId_unique` UNIQUE(`stripeSessionId`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`plan` enum('free','pro','premium') NOT NULL DEFAULT 'free',
	`status` enum('active','cancelled','past_due','inactive') NOT NULL DEFAULT 'inactive',
	`currentPeriodStart` timestamp,
	`currentPeriodEnd` timestamp,
	`cancelledAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
