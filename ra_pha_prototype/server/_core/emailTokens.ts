import crypto from "crypto";

/**
 * Email token configuration
 */
export const EMAIL_TOKEN_CONFIG = {
  VERIFICATION_EXPIRY_MS: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_RESET_EXPIRY_MS: 60 * 60 * 1000, // 1 hour
  TOKEN_LENGTH: 32,
};

/**
 * Generate a secure random token
 */
export function generateToken(): string {
  return crypto.randomBytes(EMAIL_TOKEN_CONFIG.TOKEN_LENGTH).toString("hex");
}

/**
 * Get expiry timestamp for email verification token
 */
export function getVerificationTokenExpiry(): Date {
  return new Date(Date.now() + EMAIL_TOKEN_CONFIG.VERIFICATION_EXPIRY_MS);
}

/**
 * Get expiry timestamp for password reset token
 */
export function getPasswordResetTokenExpiry(): Date {
  return new Date(Date.now() + EMAIL_TOKEN_CONFIG.PASSWORD_RESET_EXPIRY_MS);
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(expiryDate: Date | null): boolean {
  if (!expiryDate) return true;
  return new Date() > expiryDate;
}

/**
 * Generate email verification token and expiry
 */
export function generateEmailVerificationToken(): {
  token: string;
  expiry: Date;
} {
  return {
    token: generateToken(),
    expiry: getVerificationTokenExpiry(),
  };
}

/**
 * Generate password reset token and expiry
 */
export function generatePasswordResetToken(): {
  token: string;
  expiry: Date;
} {
  return {
    token: generateToken(),
    expiry: getPasswordResetTokenExpiry(),
  };
}

/**
 * Validate token format
 */
export function isValidTokenFormat(token: string): boolean {
  // Token should be a 64-character hex string
  return /^[a-f0-9]{64}$/.test(token);
}
