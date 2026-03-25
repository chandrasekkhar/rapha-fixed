ALTER TABLE `payments` MODIFY COLUMN `stripeSessionId` varchar(255);--> statement-breakpoint
ALTER TABLE `payments` MODIFY COLUMN `currency` varchar(3) NOT NULL DEFAULT 'INR';--> statement-breakpoint
ALTER TABLE `payments` MODIFY COLUMN `status` enum('pending','completed','failed','cancelled','refunded') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `payments` ADD `orderId` varchar(255);--> statement-breakpoint
ALTER TABLE `payments` ADD `paymentId` varchar(255);--> statement-breakpoint
ALTER TABLE `payments` ADD `paymentMethod` enum('stripe','razorpay','upi') DEFAULT 'razorpay' NOT NULL;--> statement-breakpoint
ALTER TABLE `payments` ADD `planId` varchar(255);--> statement-breakpoint
ALTER TABLE `payments` ADD `planName` varchar(255);--> statement-breakpoint
ALTER TABLE `payments` ADD `metadata` json;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_orderId_unique` UNIQUE(`orderId`);--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_paymentId_unique` UNIQUE(`paymentId`);