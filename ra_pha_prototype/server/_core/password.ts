import crypto from "crypto";

/**
 * Hash a password using PBKDF2
 * @param password - The plain text password
 * @returns The hashed password with salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a password against its hash
 * @param password - The plain text password to verify
 * @param hash - The stored hash (salt:hash format)
 * @returns True if password matches, false otherwise
 */
export function verifyPassword(password: string, hash: string): boolean {
  try {
    const [salt, storedHash] = hash.split(":");
    if (!salt || !storedHash) {
      return false;
    }

    const computedHash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, "sha512")
      .toString("hex");

    return computedHash === storedHash;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}

/**
 * Validate password strength
 * @param password - The password to validate
 * @returns Object with validation result and message
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  message: string;
} {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character (!@#$%^&*)",
    };
  }

  return {
    isValid: true,
    message: "Password is strong",
  };
}
