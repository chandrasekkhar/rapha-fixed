import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).unique(),
  username: varchar("username", { length: 255 }).unique(),
  passwordHash: text("passwordHash"),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }).default("oauth").notNull(),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isEmailVerified: int("isEmailVerified").default(0).notNull(),
  emailVerificationToken: varchar("emailVerificationToken", { length: 255 }),
  emailVerificationTokenExpiry: timestamp("emailVerificationTokenExpiry"),
  passwordResetToken: varchar("passwordResetToken", { length: 255 }),
  passwordResetTokenExpiry: timestamp("passwordResetTokenExpiry"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const vitals = mysqlTable("vitals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  heartRate: int("heartRate"),
  bloodPressureSystolic: int("bloodPressureSystolic"),
  bloodPressureDiastolic: int("bloodPressureDiastolic"),
  oxygenLevel: int("oxygenLevel"),
  sleepHours: int("sleepHours"),
  stressLevel: int("stressLevel"), // 1-10 scale
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Vital = typeof vitals.$inferSelect;
export type InsertVital = typeof vitals.$inferInsert;

export const aiInsights = mysqlTable("aiInsights", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  riskLevel: mysqlEnum("riskLevel", ["low", "medium", "high"]).default("low").notNull(),
  recommendation: text("recommendation"),
  isRead: int("isRead").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AIInsight = typeof aiInsights.$inferSelect;
export type InsertAIInsight = typeof aiInsights.$inferInsert;

export const wellnessPlans = mysqlTable("wellnessPlans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["diet", "fitness", "mental_health"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  duration: int("duration"), // in days
  progress: int("progress").default(0).notNull(), // 0-100
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WellnessPlan = typeof wellnessPlans.$inferSelect;
export type InsertWellnessPlan = typeof wellnessPlans.$inferInsert;

export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  doctorName: varchar("doctorName", { length: 255 }).notNull(),
  specialty: varchar("specialty", { length: 255 }),
  appointmentTime: timestamp("appointmentTime"),
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled"]).default("scheduled").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  plan: mysqlEnum("plan", ["free", "pro", "premium"]).default("free").notNull(),
  status: mysqlEnum("status", ["active", "cancelled", "past_due", "inactive"]).default("inactive").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelledAt: timestamp("cancelledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).unique(),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }).notNull().unique(),
  amount: int("amount").notNull(), // in cents
  currency: varchar("currency", { length: 3 }).default("usd").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "cancelled"]).default("pending").notNull(),
  plan: mysqlEnum("plan", ["pro", "premium"]).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

export const emergencyContacts = mysqlTable("emergencyContacts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  relationship: varchar("relationship", { length: 100 }),
  isPrimary: int("isPrimary").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsertEmergencyContact = typeof emergencyContacts.$inferInsert;

export const sosAlerts = mysqlTable("sosAlerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  status: mysqlEnum("status", ["active", "resolved", "cancelled"]).default("active").notNull(),
  description: text("description"),
  contactedEmergencyServices: int("contactedEmergencyServices").default(0).notNull(),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SOSAlert = typeof sosAlerts.$inferSelect;
export type InsertSOSAlert = typeof sosAlerts.$inferInsert;

export const lifeInsurancePolicies = mysqlTable("lifeInsurancePolicies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  policyNumber: varchar("policyNumber", { length: 100 }).notNull().unique(),
  providerName: varchar("providerName", { length: 255 }).notNull(),
  coverageAmount: int("coverageAmount").notNull(), // in rupees
  premiumAmount: int("premiumAmount").notNull(), // monthly premium
  premiumFrequency: mysqlEnum("premiumFrequency", ["monthly", "quarterly", "half-yearly", "yearly"]).default("monthly").notNull(),
  startDate: timestamp("startDate").notNull(),
  maturityDate: timestamp("maturityDate"),
  status: mysqlEnum("status", ["active", "inactive", "lapsed", "matured"]).default("active").notNull(),
  nextPremiumDueDate: timestamp("nextPremiumDueDate"),
  lastPremiumPaidDate: timestamp("lastPremiumPaidDate"),
  beneficiaryName: varchar("beneficiaryName", { length: 255 }),
  beneficiaryRelation: varchar("beneficiaryRelation", { length: 100 }),
  documentUrl: text("documentUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LifeInsurancePolicy = typeof lifeInsurancePolicies.$inferSelect;
export type InsertLifeInsurancePolicy = typeof lifeInsurancePolicies.$inferInsert;

export const termInsurancePolicies = mysqlTable("termInsurancePolicies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  policyNumber: varchar("policyNumber", { length: 100 }).notNull().unique(),
  providerName: varchar("providerName", { length: 255 }).notNull(),
  coverageAmount: int("coverageAmount").notNull(), // in rupees
  premiumAmount: int("premiumAmount").notNull(), // monthly premium
  premiumFrequency: mysqlEnum("premiumFrequency", ["monthly", "quarterly", "half-yearly", "yearly"]).default("monthly").notNull(),
  term: int("term").notNull(), // in years
  startDate: timestamp("startDate").notNull(),
  expiryDate: timestamp("expiryDate").notNull(),
  status: mysqlEnum("status", ["active", "inactive", "lapsed", "expired"]).default("active").notNull(),
  nextPremiumDueDate: timestamp("nextPremiumDueDate"),
  lastPremiumPaidDate: timestamp("lastPremiumPaidDate"),
  beneficiaryName: varchar("beneficiaryName", { length: 255 }),
  beneficiaryRelation: varchar("beneficiaryRelation", { length: 100 }),
  documentUrl: text("documentUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TermInsurancePolicy = typeof termInsurancePolicies.$inferSelect;
export type InsertTermInsurancePolicy = typeof termInsurancePolicies.$inferInsert;

export const bankAccounts = mysqlTable("bankAccounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  accountNumber: varchar("accountNumber", { length: 50 }).notNull().unique(),
  bankName: varchar("bankName", { length: 255 }).notNull(),
  accountType: mysqlEnum("accountType", ["savings", "current", "salary"]).default("savings").notNull(),
  accountHolder: varchar("accountHolder", { length: 255 }).notNull(),
  ifscCode: varchar("ifscCode", { length: 20 }).notNull(),
  balance: int("balance").default(0).notNull(), // in rupees
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BankAccount = typeof bankAccounts.$inferSelect;
export type InsertBankAccount = typeof bankAccounts.$inferInsert;

export const bankTransactions = mysqlTable("bankTransactions", {
  id: int("id").autoincrement().primaryKey(),
  accountId: int("accountId").notNull(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["credit", "debit"]).notNull(),
  amount: int("amount").notNull(), // in rupees
  description: varchar("description", { length: 255 }),
  referenceNumber: varchar("referenceNumber", { length: 100 }),
  balanceAfter: int("balanceAfter").notNull(),
  transactionDate: timestamp("transactionDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BankTransaction = typeof bankTransactions.$inferSelect;
export type InsertBankTransaction = typeof bankTransactions.$inferInsert;

export const insuranceClaims = mysqlTable("insuranceClaims", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  policyId: int("policyId").notNull(),
  policyType: mysqlEnum("policyType", ["life", "term"]).notNull(),
  claimNumber: varchar("claimNumber", { length: 100 }).notNull().unique(),
  claimAmount: int("claimAmount").notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["submitted", "under-review", "approved", "rejected", "paid"]).default("submitted").notNull(),
  documentUrls: text("documentUrls"), // JSON array of URLs
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  approvedAt: timestamp("approvedAt"),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InsuranceClaim = typeof insuranceClaims.$inferSelect;
export type InsertInsuranceClaim = typeof insuranceClaims.$inferInsert;

export const healthInsurancePolicies = mysqlTable("healthInsurancePolicies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  policyNumber: varchar("policyNumber", { length: 100 }).notNull().unique(),
  providerName: varchar("providerName", { length: 255 }).notNull(),
  sumInsured: int("sumInsured").notNull(), // in rupees
  premiumAmount: int("premiumAmount").notNull(), // annual premium
  premiumFrequency: mysqlEnum("premiumFrequency", ["monthly", "quarterly", "half-yearly", "yearly"]).default("yearly").notNull(),
  coverageType: mysqlEnum("coverageType", ["individual", "family", "senior"]).default("individual").notNull(),
  familyMembers: int("familyMembers").default(1).notNull(),
  startDate: timestamp("startDate").notNull(),
  renewalDate: timestamp("renewalDate").notNull(),
  status: mysqlEnum("status", ["active", "inactive", "lapsed", "expired"]).default("active").notNull(),
  nextPremiumDueDate: timestamp("nextPremiumDueDate"),
  lastPremiumPaidDate: timestamp("lastPremiumPaidDate"),
  networkHospitals: int("networkHospitals").default(0),
  cashlessLimit: int("cashlessLimit").default(0),
  waitingPeriod: int("waitingPeriod").default(30), // in days
  documentUrl: text("documentUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HealthInsurancePolicy = typeof healthInsurancePolicies.$inferSelect;
export type InsertHealthInsurancePolicy = typeof healthInsurancePolicies.$inferInsert;

export const healthInsuranceClaims = mysqlTable("healthInsuranceClaims", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  policyId: int("policyId").notNull(),
  claimNumber: varchar("claimNumber", { length: 100 }).notNull().unique(),
  claimAmount: int("claimAmount").notNull(),
  hospitalName: varchar("hospitalName", { length: 255 }),
  treatmentType: varchar("treatmentType", { length: 100 }),
  admissionDate: timestamp("admissionDate"),
  dischargeDate: timestamp("dischargeDate"),
  status: mysqlEnum("status", ["submitted", "under-review", "approved", "rejected", "paid"]).default("submitted").notNull(),
  documentUrls: text("documentUrls"), // JSON array of URLs
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  approvedAt: timestamp("approvedAt"),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HealthInsuranceClaim = typeof healthInsuranceClaims.$inferSelect;
export type InsertHealthInsuranceClaim = typeof healthInsuranceClaims.$inferInsert;
