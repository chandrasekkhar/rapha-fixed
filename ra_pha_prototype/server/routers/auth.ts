/**
 * Authentication router for username/password login and registration
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import {
  createUser,
  verifyUserCredentials,
  updateLastSignedIn,
  getUserById,
  getUserByEmail,
  setEmailVerificationToken,
  verifyEmailWithToken,
  setPasswordResetToken,
  resetPasswordWithToken,
} from "../db.auth";
import { validatePasswordStrength } from "../_core/password";
import {
  generateEmailVerificationToken,
  generatePasswordResetToken,
  isTokenExpired,
} from "../_core/emailTokens";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../_core/emailService";
import { getSessionCookieOptions } from "../_core/cookies";
import { SignJWT } from "jose";
import { ENV } from "../_core/env";

const COOKIE_NAME = "session";

export const authRouter = router({
  /**
   * Register a new user with username and password
   */
  register: publicProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(3, "Username must be at least 3 characters")
          .max(50, "Username must be less than 50 characters")
          .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
        name: z.string().optional(),
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      try {
        // Validate password strength
        const passwordValidation = validatePasswordStrength(input.password);
        if (!passwordValidation.isValid) {
          throw new Error(passwordValidation.message);
        }

        // Create user
        const result = await createUser({
          username: input.username,
          email: input.email,
          password: input.password,
          name: input.name,
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to create user");
        }

        // Get the created user
        const user = await getUserById(result.userId!);
        if (!user) {
          throw new Error("Failed to retrieve created user");
        }

        // Generate and save email verification token
        const { token, expiry } = generateEmailVerificationToken();
        await setEmailVerificationToken(user.id, token, expiry);

        // Send verification email
        const verificationUrl = `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${token}`;
        await sendVerificationEmail(
          user.email || "",
          user.name || user.username || "",
          token,
          verificationUrl
        );

        // Create session token using JWT
        const secret = new TextEncoder().encode(ENV.cookieSecret || "default-secret");
        const sessionToken = await new SignJWT({
          userId: user.id,
          username: user.username,
        })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("7d")
          .sign(secret);

        // Set session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);

        return {
          success: true,
          message: "User registered successfully. Please verify your email.",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            isEmailVerified: user.isEmailVerified === 1,
          },
        };
      } catch (error: any) {
        console.error("[Auth] Registration error:", error);
        throw new Error(error.message || "Registration failed");
      }
    }),

  /**
   * Login with username and password
   */
  login: publicProcedure
    .input(
      z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Verify credentials
        const result = await verifyUserCredentials(input.username, input.password);

        if (!result.success) {
          throw new Error(result.error || "Invalid credentials");
        }

        const user = result.user!;

        // Update last signed in
        await updateLastSignedIn(user.id);

        // Create session token using JWT
        const secret = new TextEncoder().encode(ENV.cookieSecret || "default-secret");
        const sessionToken = await new SignJWT({
          userId: user.id,
          username: user.username,
        })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("7d")
          .sign(secret);

        // Set session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);

        return {
          success: true,
          message: "Login successful",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            isEmailVerified: user.isEmailVerified === 1,
          },
        };
      } catch (error: any) {
        console.error("[Auth] Login error:", error);
        throw new Error(error.message || "Login failed");
      }
    }),

  /**
   * Get current user info
   */
  me: publicProcedure.query((opts) => opts.ctx.user),

  /**
   * Logout
   */
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return {
      success: true,
    } as const;
  }),

  /**
   * Check if username is available
   */
  checkUsernameAvailable: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      try {
        const { getUserByUsername } = await import("../db.auth");
        const user = await getUserByUsername(input.username);
        return {
          available: !user,
        };
      } catch (error) {
        console.error("[Auth] Error checking username:", error);
        return {
          available: false,
        };
      }
    }),

  /**
   * Check if email is available
   */
  checkEmailAvailable: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      try {
        const user = await getUserByEmail(input.email);
        return {
          available: !user,
        };
      } catch (error) {
        console.error("[Auth] Error checking email:", error);
        return {
          available: false,
        };
      }
    }),

  /**
   * Request password reset
   */
  requestPasswordReset: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      try {
        const user = await getUserByEmail(input.email);

        if (!user) {
          // Don't reveal if email exists for security
          return {
            success: true,
            message: "If an account exists with this email, a password reset link has been sent",
          };
        }

        // Generate reset token
        const { token, expiry } = generatePasswordResetToken();

        // Save token to database
        const result = await setPasswordResetToken(user.id, token, expiry);
        if (!result.success) {
          throw new Error("Failed to generate reset token");
        }

        // Send reset email
        const resetUrl = `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${token}`;
        const emailSent = await sendPasswordResetEmail(
          user.email || "",
          user.name || user.username || "",
          token,
          resetUrl
        );

        if (!emailSent) {
          console.warn("[Auth] Failed to send password reset email");
        }

        return {
          success: true,
          message: "If an account exists with this email, a password reset link has been sent",
        };
      } catch (error: any) {
        console.error("[Auth] Password reset request error:", error);
        return {
          success: true,
          message: "If an account exists with this email, a password reset link has been sent",
        };
      }
    }),

  /**
   * Reset password with token
   */
  resetPassword: publicProcedure
    .input(
      z
        .object({
          token: z.string(),
          password: z.string().min(8, "Password must be at least 8 characters"),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords don't match",
          path: ["confirmPassword"],
        })
    )
    .mutation(async ({ input }) => {
      try {
        // Validate password strength
        const passwordValidation = validatePasswordStrength(input.password);
        if (!passwordValidation.isValid) {
          throw new Error(passwordValidation.message);
        }

        // Reset password with token
        const result = await resetPasswordWithToken(input.token, input.password);

        if (!result.success) {
          throw new Error(result.error || "Failed to reset password");
        }

        return {
          success: true,
          message: "Password reset successfully",
        };
      } catch (error: any) {
        console.error("[Auth] Password reset error:", error);
        throw new Error(error.message || "Failed to reset password");
      }
    }),

  /**
   * Verify email with token
   */
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const result = await verifyEmailWithToken(input.token);

        if (!result.success) {
          throw new Error(result.error || "Failed to verify email");
        }

        return {
          success: true,
          message: "Email verified successfully",
          user: {
            id: result.user!.id,
            username: result.user!.username,
            email: result.user!.email,
          },
        };
      } catch (error: any) {
        console.error("[Auth] Email verification error:", error);
        throw new Error(error.message || "Failed to verify email");
      }
    }),

  /**
   * Send verification email
   */
  sendVerificationEmail: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const user = ctx.user;
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Generate verification token
      const { token, expiry } = generateEmailVerificationToken();

      // Save token to database
      const result = await setEmailVerificationToken(user.id, token, expiry);
      if (!result.success) {
        throw new Error("Failed to generate verification token");
      }

      // Send verification email
      const verificationUrl = `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${token}`;
      const emailSent = await sendVerificationEmail(
        user.email || "",
        user.name || user.username || "",
        token,
        verificationUrl
      );

      if (!emailSent) {
        console.warn("[Auth] Failed to send verification email");
      }

      return {
        success: true,
        message: "Verification email sent",
      };
    } catch (error: any) {
      console.error("[Auth] Send verification email error:", error);
      throw new Error(error.message || "Failed to send verification email");
    }
  }),
});
