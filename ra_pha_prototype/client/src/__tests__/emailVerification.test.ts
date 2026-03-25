import { describe, it, expect } from "vitest";
import {
  generateEmailVerificationToken,
  generatePasswordResetToken,
  isTokenExpired,
  isValidTokenFormat,
} from "../../../server/_core/emailTokens";

describe("Email Verification and Password Reset", () => {
  describe("Token Generation", () => {
    it("should generate a valid email verification token", () => {
      const { token, expiry } = generateEmailVerificationToken();

      expect(token).toBeDefined();
      expect(token).toHaveLength(64);
      expect(expiry).toBeInstanceOf(Date);
      expect(expiry.getTime()).toBeGreaterThan(Date.now());
    });

    it("should generate a valid password reset token", () => {
      const { token, expiry } = generatePasswordResetToken();

      expect(token).toBeDefined();
      expect(token).toHaveLength(64);
      expect(expiry).toBeInstanceOf(Date);
      expect(expiry.getTime()).toBeGreaterThan(Date.now());
    });

    it("should generate unique tokens", () => {
      const token1 = generateEmailVerificationToken().token;
      const token2 = generateEmailVerificationToken().token;

      expect(token1).not.toBe(token2);
    });
  });

  describe("Token Validation", () => {
    it("should validate correct token format", () => {
      const { token } = generateEmailVerificationToken();
      expect(isValidTokenFormat(token)).toBe(true);
    });

    it("should reject invalid token format", () => {
      expect(isValidTokenFormat("invalid-token")).toBe(false);
      expect(isValidTokenFormat("12345")).toBe(false);
      expect(isValidTokenFormat("")).toBe(false);
    });

    it("should check if token is expired", () => {
      const futureDate = new Date(Date.now() + 1000);
      expect(isTokenExpired(futureDate)).toBe(false);

      const pastDate = new Date(Date.now() - 1000);
      expect(isTokenExpired(pastDate)).toBe(true);

      expect(isTokenExpired(null)).toBe(true);
    });
  });

  describe("Token Expiry", () => {
    it("email verification token should expire in 24 hours", () => {
      const { expiry } = generateEmailVerificationToken();
      const expiryTime = expiry.getTime();
      const now = Date.now();

      // Should expire between 23.5 and 24.5 hours from now
      const minExpiry = now + 23.5 * 60 * 60 * 1000;
      const maxExpiry = now + 24.5 * 60 * 60 * 1000;

      expect(expiryTime).toBeGreaterThan(minExpiry);
      expect(expiryTime).toBeLessThan(maxExpiry);
    });

    it("password reset token should expire in 1 hour", () => {
      const { expiry } = generatePasswordResetToken();
      const expiryTime = expiry.getTime();
      const now = Date.now();

      // Should expire between 59.5 and 60.5 minutes from now
      const minExpiry = now + 59.5 * 60 * 1000;
      const maxExpiry = now + 60.5 * 60 * 1000;

      expect(expiryTime).toBeGreaterThan(minExpiry);
      expect(expiryTime).toBeLessThan(maxExpiry);
    });
  });
});
