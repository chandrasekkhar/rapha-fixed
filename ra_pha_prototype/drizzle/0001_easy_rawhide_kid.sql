CREATE TABLE `aiInsights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`riskLevel` enum('low','medium','high') NOT NULL DEFAULT 'low',
	`recommendation` text,
	`isRead` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aiInsights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`doctorName` varchar(255) NOT NULL,
	`specialty` varchar(255),
	`appointmentTime` timestamp,
	`status` enum('scheduled','completed','cancelled') NOT NULL DEFAULT 'scheduled',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vitals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`heartRate` int,
	`bloodPressureSystolic` int,
	`bloodPressureDiastolic` int,
	`oxygenLevel` int,
	`sleepHours` int,
	`stressLevel` int,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vitals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wellnessPlans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('diet','fitness','mental_health') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`duration` int,
	`progress` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wellnessPlans_id` PRIMARY KEY(`id`)
);
