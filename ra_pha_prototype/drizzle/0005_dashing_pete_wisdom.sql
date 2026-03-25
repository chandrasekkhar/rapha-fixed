CREATE TABLE `bankAccounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`accountNumber` varchar(50) NOT NULL,
	`bankName` varchar(255) NOT NULL,
	`accountType` enum('savings','current','salary') NOT NULL DEFAULT 'savings',
	`accountHolder` varchar(255) NOT NULL,
	`ifscCode` varchar(20) NOT NULL,
	`balance` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bankAccounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `bankAccounts_accountNumber_unique` UNIQUE(`accountNumber`)
);
--> statement-breakpoint
CREATE TABLE `bankTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accountId` int NOT NULL,
	`userId` int NOT NULL,
	`type` enum('credit','debit') NOT NULL,
	`amount` int NOT NULL,
	`description` varchar(255),
	`referenceNumber` varchar(100),
	`balanceAfter` int NOT NULL,
	`transactionDate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bankTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `insuranceClaims` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`policyId` int NOT NULL,
	`policyType` enum('life','term') NOT NULL,
	`claimNumber` varchar(100) NOT NULL,
	`claimAmount` int NOT NULL,
	`description` text,
	`status` enum('submitted','under-review','approved','rejected','paid') NOT NULL DEFAULT 'submitted',
	`documentUrls` text,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`approvedAt` timestamp,
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `insuranceClaims_id` PRIMARY KEY(`id`),
	CONSTRAINT `insuranceClaims_claimNumber_unique` UNIQUE(`claimNumber`)
);
--> statement-breakpoint
CREATE TABLE `lifeInsurancePolicies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`policyNumber` varchar(100) NOT NULL,
	`providerName` varchar(255) NOT NULL,
	`coverageAmount` int NOT NULL,
	`premiumAmount` int NOT NULL,
	`premiumFrequency` enum('monthly','quarterly','half-yearly','yearly') NOT NULL DEFAULT 'monthly',
	`startDate` timestamp NOT NULL,
	`maturityDate` timestamp,
	`status` enum('active','inactive','lapsed','matured') NOT NULL DEFAULT 'active',
	`nextPremiumDueDate` timestamp,
	`lastPremiumPaidDate` timestamp,
	`beneficiaryName` varchar(255),
	`beneficiaryRelation` varchar(100),
	`documentUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lifeInsurancePolicies_id` PRIMARY KEY(`id`),
	CONSTRAINT `lifeInsurancePolicies_policyNumber_unique` UNIQUE(`policyNumber`)
);
--> statement-breakpoint
CREATE TABLE `termInsurancePolicies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`policyNumber` varchar(100) NOT NULL,
	`providerName` varchar(255) NOT NULL,
	`coverageAmount` int NOT NULL,
	`premiumAmount` int NOT NULL,
	`premiumFrequency` enum('monthly','quarterly','half-yearly','yearly') NOT NULL DEFAULT 'monthly',
	`term` int NOT NULL,
	`startDate` timestamp NOT NULL,
	`expiryDate` timestamp NOT NULL,
	`status` enum('active','inactive','lapsed','expired') NOT NULL DEFAULT 'active',
	`nextPremiumDueDate` timestamp,
	`lastPremiumPaidDate` timestamp,
	`beneficiaryName` varchar(255),
	`beneficiaryRelation` varchar(100),
	`documentUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `termInsurancePolicies_id` PRIMARY KEY(`id`),
	CONSTRAINT `termInsurancePolicies_policyNumber_unique` UNIQUE(`policyNumber`)
);
