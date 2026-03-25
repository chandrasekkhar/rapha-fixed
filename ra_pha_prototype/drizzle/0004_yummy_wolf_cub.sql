CREATE TABLE `emergencyContacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`relationship` varchar(100),
	`isPrimary` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emergencyContacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sosAlerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`latitude` varchar(50),
	`longitude` varchar(50),
	`status` enum('active','resolved','cancelled') NOT NULL DEFAULT 'active',
	`description` text,
	`contactedEmergencyServices` int NOT NULL DEFAULT 0,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sosAlerts_id` PRIMARY KEY(`id`)
);
