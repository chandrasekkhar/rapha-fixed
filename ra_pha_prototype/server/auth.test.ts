import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
} from "../server/_core/password";

describe("Password Utilities", () => {
  describe("hashPassword", () => {
    it("should hash a password", () => {
      const password = "TestPassword123!";
      const hash = hashPassword(password);

      // Hash should contain a colon separator
      expect(hash).toContain(":");

      // Hash should not be the same as the password
      expect(hash).not.toBe(password);

      // Hash should be a string
      expect(typeof hash).toBe("string");
    });

    it("should generate different hashes for the same password", () => {
      const password = "TestPassword123!";
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);

      // Different hashes due to different salts
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("verifyPassword", () => {
    it("should verify correct password", () => {
      const password = "TestPassword123!";
      const hash = hashPassword(password);

      const isValid = verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", () => {
      const password = "TestPassword123!";
      const hash = hashPassword(password);

      const isValid = verifyPassword("WrongPassword123!", hash);
      expect(isValid).toBe(false);
    });

    it("should handle malformed hash", () => {
      const isValid = verifyPassword("TestPassword123!", "invalid-hash");
      expect(isValid).toBe(false);
    });

    it("should handle empty hash", () => {
      const isValid = verifyPassword("TestPassword123!", "");
      expect(isValid).toBe(false);
    });
  });

  describe("validatePasswordStrength", () => {
    it("should reject password shorter than 8 characters", () => {
      const result = validatePasswordStrength("Short1!");
      expect(result.isValid).toBe(false);
      expect(result.message).toContain("at least 8 characters");
    });

    it("should reject password without uppercase letter", () => {
      const result = validatePasswordStrength("testpassword123!");
      expect(result.isValid).toBe(false);
      expect(result.message).toContain("uppercase");
    });

    it("should reject password without lowercase letter", () => {
      const result = validatePasswordStrength("TESTPASSWORD123!");
      expect(result.isValid).toBe(false);
      expect(result.message).toContain("lowercase");
    });

    it("should reject password without number", () => {
      const result = validatePasswordStrength("TestPassword!");
      expect(result.isValid).toBe(false);
      expect(result.message).toContain("number");
    });

    it("should reject password without special character", () => {
      const result = validatePasswordStrength("TestPassword123");
      expect(result.isValid).toBe(false);
      expect(result.message).toContain("special character");
    });

    it("should accept strong password", () => {
      const result = validatePasswordStrength("TestPassword123!");
      expect(result.isValid).toBe(true);
      expect(result.message).toContain("strong");
    });

    it("should accept strong password with different special characters", () => {
      const specialChars = ["!", "@", "#", "$", "%", "^", "&", "*"];

      specialChars.forEach((char) => {
        const password = `TestPassword123${char}`;
        const result = validatePasswordStrength(password);
        expect(result.isValid).toBe(true);
      });
    });
  });
});
