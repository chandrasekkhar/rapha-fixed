ALTER TABLE `users` MODIFY COLUMN `openId` varchar(64);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `loginMethod` varchar(64) NOT NULL DEFAULT 'oauth';--> statement-breakpoint
ALTER TABLE `users` ADD `username` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `passwordHash` text;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_username_unique` UNIQUE(`username`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);