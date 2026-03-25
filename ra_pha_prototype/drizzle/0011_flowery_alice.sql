ALTER TABLE `users` ADD `isEmailVerified` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `emailVerificationToken` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `emailVerificationTokenExpiry` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `passwordResetToken` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `passwordResetTokenExpiry` timestamp;