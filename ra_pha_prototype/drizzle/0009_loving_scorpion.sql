ALTER TABLE `payments` DROP INDEX `payments_orderId_unique`;--> statement-breakpoint
ALTER TABLE `payments` DROP INDEX `payments_paymentId_unique`;--> statement-breakpoint
ALTER TABLE `payments` MODIFY COLUMN `stripeSessionId` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `payments` MODIFY COLUMN `currency` varchar(3) NOT NULL DEFAULT 'usd';--> statement-breakpoint
ALTER TABLE `payments` MODIFY COLUMN `status` enum('pending','completed','failed','cancelled') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_stripePaymentIntentId_unique` UNIQUE(`stripePaymentIntentId`);--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_stripeSessionId_unique` UNIQUE(`stripeSessionId`);--> statement-breakpoint
ALTER TABLE `payments` DROP COLUMN `orderId`;--> statement-breakpoint
ALTER TABLE `payments` DROP COLUMN `paymentId`;--> statement-breakpoint
ALTER TABLE `payments` DROP COLUMN `paymentMethod`;--> statement-breakpoint
ALTER TABLE `payments` DROP COLUMN `planId`;--> statement-breakpoint
ALTER TABLE `payments` DROP COLUMN `planName`;--> statement-breakpoint
ALTER TABLE `payments` DROP COLUMN `metadata`;