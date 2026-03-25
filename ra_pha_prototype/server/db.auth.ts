/**
 * Authentication database helpers
 * Handles user registration and login with username/password
 */

import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { users, InsertUser } from "../drizzle/schema";
import { hashPassword, verifyPassword } from "./_core/password";

/**
 * Get user by username
 */
export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Error getting user by username:", error);
    return undefined;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Error getting user by email:", error);
    return undefined;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Error getting user by ID:", error);
    return undefined;
  }
}

/**
 * Create a new user with username and password
 */
export async function createUser(data: {
  username: string;
  email: string;
  password: string;
  name?: string;
}): Promise<{ success: boolean; userId?: number; error?: string }> {
  const db = await getDb();
  if (!db) {
    return { success: false, error: "Database not available" };
  }

  try {
    // Check if username already exists
    const existingUsername = await getUserByUsername(data.username);
    if (existingUsername) {
      return { success: false, error: "Username already exists" };
    }

    // Check if email already exists
    const existingEmail = await getUserByEmail(data.email);
    if (existingEmail) {
      return { success: false, error: "Email already exists" };
    }

    // Hash password
    const passwordHash = hashPassword(data.password);

    // Create user
    const result = await db.insert(users).values({
      username: data.username,
      email: data.email,
      passwordHash,
      name: data.name || data.username,
      loginMethod: "local",
      role: "user",
      lastSignedIn: new Date(),
    });

    // Get the inserted user ID
    const insertedUser = await getUserByUsername(data.username);
    if (!insertedUser) {
      return { success: false, error: "Failed to create user" };
    }

    return { success: true, userId: insertedUser.id };
  } catch (error) {
    console.error("[Database] Error creating user:", error);
    return { success: false, error: "Failed to create user" };
  }
}

/**
 * Verify user credentials (username/password)
 */
export async function verifyUserCredentials(
  username: string,
  password: string
): Promise<{ success: boolean; user?: typeof users.$inferSelect; error?: string }> {
  try {
    const user = await getUserByUsername(username);

    if (!user) {
      return { success: false, error: "Invalid username or password" };
    }

    if (!user.passwordHash) {
      return { success: false, error: "User does not have password authentication" };
    }

    const isValid = verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return { success: false, error: "Invalid username or password" };
    }

    return { success: true, user };
  } catch (error) {
    console.error("[Database] Error verifying credentials:", error);
    return { success: false, error: "Authentication failed" };
  }
}

/**
 * Update user's last signed in time
 */
export async function updateLastSignedIn(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update user: database not available");
    return false;
  }

  try {
    await db
      .update(users)
      .set({ lastSignedIn: new Date() })
      .where(eq(users.id, userId));

    return true;
  } catch (error) {
    console.error("[Database] Error updating last signed in:", error);
    return false;
  }
}

/**
 * Update user password
 */
export async function updateUserPassword(
  userId: number,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const db = await getDb();
  if (!db) {
    return { success: false, error: "Database not available" };
  }

  try {
    const passwordHash = hashPassword(newPassword);

    await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error("[Database] Error updating password:", error);
    return { success: false, error: "Failed to update password" };
  }
}


/**
 * Set email verification token for user
 */
export async function setEmailVerificationToken(
  userId: number,
  token: string,
  expiry: Date
): Promise<{ success: boolean; error?: string }> {
  const db = await getDb();
  if (!db) {
    return { success: false, error: "Database not available" };
  }

  try {
    await db
      .update(users)
      .set({
        emailVerificationToken: token,
        emailVerificationTokenExpiry: expiry,
      })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error("[Database] Error setting email verification token:", error);
    return { success: false, error: "Failed to set verification token" };
  }
}

/**
 * Verify email with token
 */
export async function verifyEmailWithToken(
  token: string
): Promise<{ success: boolean; user?: typeof users.$inferSelect; error?: string }> {
  const db = await getDb();
  if (!db) {
    return { success: false, error: "Database not available" };
  }

  try {
    // Find user with matching token
    const result = await db
      .select()
      .from(users)
      .where(eq(users.emailVerificationToken, token))
      .limit(1);

    if (result.length === 0) {
      return { success: false, error: "Invalid verification token" };
    }

    const user = result[0];

    // Check if token is expired
    if (
      !user.emailVerificationTokenExpiry ||
      new Date() > user.emailVerificationTokenExpiry
    ) {
      return { success: false, error: "Verification token has expired" };
    }

    // Mark email as verified
    await db
      .update(users)
      .set({
        isEmailVerified: 1,
        emailVerificationToken: null,
        emailVerificationTokenExpiry: null,
      })
      .where(eq(users.id, user.id));

    return { success: true, user };
  } catch (error) {
    console.error("[Database] Error verifying email:", error);
    return { success: false, error: "Failed to verify email" };
  }
}

/**
 * Set password reset token for user
 */
export async function setPasswordResetToken(
  userId: number,
  token: string,
  expiry: Date
): Promise<{ success: boolean; error?: string }> {
  const db = await getDb();
  if (!db) {
    return { success: false, error: "Database not available" };
  }

  try {
    await db
      .update(users)
      .set({
        passwordResetToken: token,
        passwordResetTokenExpiry: expiry,
      })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error("[Database] Error setting password reset token:", error);
    return { success: false, error: "Failed to set reset token" };
  }
}

/**
 * Reset password with token
 */
export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<{ success: boolean; user?: typeof users.$inferSelect; error?: string }> {
  const db = await getDb();
  if (!db) {
    return { success: false, error: "Database not available" };
  }

  try {
    // Find user with matching token
    const result = await db
      .select()
      .from(users)
      .where(eq(users.passwordResetToken, token))
      .limit(1);

    if (result.length === 0) {
      return { success: false, error: "Invalid reset token" };
    }

    const user = result[0];

    // Check if token is expired
    if (
      !user.passwordResetTokenExpiry ||
      new Date() > user.passwordResetTokenExpiry
    ) {
      return { success: false, error: "Reset token has expired" };
    }

    // Hash new password
    const passwordHash = hashPassword(newPassword);

    // Update password and clear reset token
    await db
      .update(users)
      .set({
        passwordHash,
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
      })
      .where(eq(users.id, user.id));

    return { success: true, user };
  } catch (error) {
    console.error("[Database] Error resetting password:", error);
    return { success: false, error: "Failed to reset password" };
  }
}

/**
 * Check if user's email is verified
 */
export async function isEmailVerified(userId: number): Promise<boolean> {
  try {
    const user = await getUserById(userId);
    return user ? user.isEmailVerified === 1 : false;
  } catch (error) {
    console.error("[Database] Error checking email verification:", error);
    return false;
  }
}

/**
 * Get user by email verification token
 */
export async function getUserByVerificationToken(token: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.emailVerificationToken, token))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Error getting user by verification token:", error);
    return undefined;
  }
}

/**
 * Get user by password reset token
 */
export async function getUserByPasswordResetToken(token: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.passwordResetToken, token))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Error getting user by reset token:", error);
    return undefined;
  }
}
