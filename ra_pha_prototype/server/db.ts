import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, vitals, InsertVital, aiInsights, InsertAIInsight, wellnessPlans, InsertWellnessPlan, appointments, InsertAppointment, subscriptions, InsertSubscription, payments, InsertPayment, emergencyContacts, InsertEmergencyContact, sosAlerts, InsertSOSAlert, lifeInsurancePolicies, InsertLifeInsurancePolicy, termInsurancePolicies, InsertTermInsurancePolicy, bankAccounts, InsertBankAccount, bankTransactions, InsertBankTransaction, insuranceClaims, InsertInsuranceClaim, healthInsurancePolicies, InsertHealthInsurancePolicy, healthInsuranceClaims, InsertHealthInsuranceClaim } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field as keyof InsertUser] = normalized as any;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserVitals(userId: number, limit = 30) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(vitals)
    .where(eq(vitals.userId, userId))
    .orderBy((v) => desc(v.timestamp))
    .limit(limit);
}

export async function getLatestVital(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(vitals)
    .where(eq(vitals.userId, userId))
    .orderBy((v) => desc(v.timestamp))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createVital(vital: InsertVital) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(vitals).values(vital);
  return result;
}

export async function getUserAIInsights(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(aiInsights)
    .where(eq(aiInsights.userId, userId))
    .orderBy((i) => desc(i.createdAt));
}

export async function createAIInsight(insight: InsertAIInsight) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(aiInsights).values(insight);
}

export async function getUserWellnessPlans(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(wellnessPlans)
    .where(eq(wellnessPlans.userId, userId))
    .orderBy((p) => desc(p.createdAt));
}

export async function createWellnessPlan(plan: InsertWellnessPlan) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(wellnessPlans).values(plan);
}

export async function getUserAppointments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(appointments)
    .where(eq(appointments.userId, userId))
    .orderBy((a) => desc(a.appointmentTime));
}

export async function createAppointment(appointment: InsertAppointment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(appointments).values(appointment);
}

export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOrUpdateSubscription(data: InsertSubscription) {
  const db = await getDb();
  if (!db) return undefined;
  
  const existing = await db.select().from(subscriptions).where(eq(subscriptions.userId, data.userId)).limit(1);
  
  if (existing.length > 0) {
    await db.update(subscriptions).set(data).where(eq(subscriptions.userId, data.userId));
    return (await db.select().from(subscriptions).where(eq(subscriptions.userId, data.userId)).limit(1))[0];
  } else {
    await db.insert(subscriptions).values(data);
    return (await db.select().from(subscriptions).where(eq(subscriptions.userId, data.userId)).limit(1))[0];
  }
}

export async function createPayment(data: InsertPayment) {
  const db = await getDb();
  if (!db) return undefined;
  await db.insert(payments).values(data);
  return (await db.select().from(payments).where(eq(payments.stripeSessionId, data.stripeSessionId)).limit(1))[0];
}

export async function getPaymentBySessionId(sessionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(payments).where(eq(payments.stripeSessionId, sessionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserPayments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
}

export async function updatePaymentStatus(sessionId: string, status: string) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(payments).set({ status: status as any }).where(eq(payments.stripeSessionId, sessionId));
  return (await db.select().from(payments).where(eq(payments.stripeSessionId, sessionId)).limit(1))[0];
}

// Emergency Contacts
export async function createEmergencyContact(contact: InsertEmergencyContact) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(emergencyContacts).values(contact);
  return result;
}

export async function getUserEmergencyContacts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(emergencyContacts).where(eq(emergencyContacts.userId, userId));
}

export async function updateEmergencyContact(id: number, contact: Partial<InsertEmergencyContact>) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(emergencyContacts).set(contact).where(eq(emergencyContacts.id, id));
  return (await db.select().from(emergencyContacts).where(eq(emergencyContacts.id, id)).limit(1))[0];
}

export async function deleteEmergencyContact(id: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(emergencyContacts).where(eq(emergencyContacts.id, id));
  return true;
}

// SOS Alerts
export async function createSOSAlert(alert: InsertSOSAlert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(sosAlerts).values(alert);
  return result;
}

export async function getUserSOSAlerts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sosAlerts).where(eq(sosAlerts.userId, userId)).orderBy(desc(sosAlerts.createdAt));
}

export async function getActiveSOSAlert(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(sosAlerts).where(and(eq(sosAlerts.userId, userId), eq(sosAlerts.status, "active"))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateSOSAlertStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) return undefined;
  const updateData: any = { status };
  if (status === "resolved") {
    updateData.resolvedAt = new Date();
  }
  await db.update(sosAlerts).set(updateData).where(eq(sosAlerts.id, id));
  return (await db.select().from(sosAlerts).where(eq(sosAlerts.id, id)).limit(1))[0];
}


// Life Insurance Policies
export async function createLifeInsurancePolicy(policy: InsertLifeInsurancePolicy) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(lifeInsurancePolicies).values(policy);
  return result;
}

export async function getUserLifeInsurancePolicies(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lifeInsurancePolicies).where(eq(lifeInsurancePolicies.userId, userId)).orderBy(desc(lifeInsurancePolicies.createdAt));
}

export async function getLifeInsurancePolicyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(lifeInsurancePolicies).where(eq(lifeInsurancePolicies.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateLifeInsurancePolicy(id: number, policy: Partial<InsertLifeInsurancePolicy>) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(lifeInsurancePolicies).set(policy).where(eq(lifeInsurancePolicies.id, id));
  return (await db.select().from(lifeInsurancePolicies).where(eq(lifeInsurancePolicies.id, id)).limit(1))[0];
}

// Term Insurance Policies
export async function createTermInsurancePolicy(policy: InsertTermInsurancePolicy) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(termInsurancePolicies).values(policy);
  return result;
}

export async function getUserTermInsurancePolicies(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(termInsurancePolicies).where(eq(termInsurancePolicies.userId, userId)).orderBy(desc(termInsurancePolicies.createdAt));
}

export async function getTermInsurancePolicyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(termInsurancePolicies).where(eq(termInsurancePolicies.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateTermInsurancePolicy(id: number, policy: Partial<InsertTermInsurancePolicy>) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(termInsurancePolicies).set(policy).where(eq(termInsurancePolicies.id, id));
  return (await db.select().from(termInsurancePolicies).where(eq(termInsurancePolicies.id, id)).limit(1))[0];
}

// Bank Accounts
export async function createBankAccount(account: InsertBankAccount) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(bankAccounts).values(account);
  return result;
}

export async function getUserBankAccounts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bankAccounts).where(eq(bankAccounts.userId, userId)).orderBy(desc(bankAccounts.createdAt));
}

export async function getBankAccountById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(bankAccounts).where(eq(bankAccounts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateBankAccount(id: number, account: Partial<InsertBankAccount>) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(bankAccounts).set(account).where(eq(bankAccounts.id, id));
  return (await db.select().from(bankAccounts).where(eq(bankAccounts.id, id)).limit(1))[0];
}

// Bank Transactions
export async function createBankTransaction(transaction: InsertBankTransaction) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(bankTransactions).values(transaction);
  return result;
}

export async function getAccountTransactions(accountId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bankTransactions).where(eq(bankTransactions.accountId, accountId)).orderBy(desc(bankTransactions.transactionDate));
}

export async function getUserTransactions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bankTransactions).where(eq(bankTransactions.userId, userId)).orderBy(desc(bankTransactions.transactionDate));
}

// Insurance Claims
export async function createInsuranceClaim(claim: InsertInsuranceClaim) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(insuranceClaims).values(claim);
  return result;
}

export async function getUserInsuranceClaims(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(insuranceClaims).where(eq(insuranceClaims.userId, userId)).orderBy(desc(insuranceClaims.submittedAt));
}

export async function getInsuranceClaimById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(insuranceClaims).where(eq(insuranceClaims.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateInsuranceClaim(id: number, claim: Partial<InsertInsuranceClaim>) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(insuranceClaims).set(claim).where(eq(insuranceClaims.id, id));
  return (await db.select().from(insuranceClaims).where(eq(insuranceClaims.id, id)).limit(1))[0];
}


// Health Insurance Policies
export async function createHealthInsurancePolicy(policy: InsertHealthInsurancePolicy) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(healthInsurancePolicies).values(policy);
  return result;
}

export async function getUserHealthInsurancePolicies(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(healthInsurancePolicies).where(eq(healthInsurancePolicies.userId, userId)).orderBy(desc(healthInsurancePolicies.createdAt));
}

export async function getHealthInsurancePolicyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(healthInsurancePolicies).where(eq(healthInsurancePolicies.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateHealthInsurancePolicy(id: number, policy: Partial<InsertHealthInsurancePolicy>) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(healthInsurancePolicies).set(policy).where(eq(healthInsurancePolicies.id, id));
  return (await db.select().from(healthInsurancePolicies).where(eq(healthInsurancePolicies.id, id)).limit(1))[0];
}

// Health Insurance Claims
export async function createHealthInsuranceClaim(claim: InsertHealthInsuranceClaim) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(healthInsuranceClaims).values(claim);
  return result;
}

export async function getUserHealthInsuranceClaims(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(healthInsuranceClaims).where(eq(healthInsuranceClaims.userId, userId)).orderBy(desc(healthInsuranceClaims.submittedAt));
}

export async function getHealthInsuranceClaimById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(healthInsuranceClaims).where(eq(healthInsuranceClaims.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateHealthInsuranceClaim(id: number, claim: Partial<InsertHealthInsuranceClaim>) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(healthInsuranceClaims).set(claim).where(eq(healthInsuranceClaims.id, id));
  return (await db.select().from(healthInsuranceClaims).where(eq(healthInsuranceClaims.id, id)).limit(1))[0];
}
