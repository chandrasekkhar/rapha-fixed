import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { INDIAN_BANKS, INDIAN_LIFE_INSURANCE_PROVIDERS, INDIAN_TERM_INSURANCE_PROVIDERS } from "../../shared/indianBanksAndInsurance";
import {
  getUserLifeInsurancePolicies,
  getUserTermInsurancePolicies,
  getUserBankAccounts,
  getAccountTransactions,
  getUserTransactions,
  getUserInsuranceClaims,
  createLifeInsurancePolicy,
  createTermInsurancePolicy,
  createBankAccount,
  createBankTransaction,
  createInsuranceClaim,
  updateInsuranceClaim,
  getUserHealthInsurancePolicies,
  createHealthInsurancePolicy,
  getUserHealthInsuranceClaims,
  createHealthInsuranceClaim,
  updateHealthInsuranceClaim,
} from "../db";
import { INDIAN_HEALTH_INSURANCE_PROVIDERS, calculateHealthInsurancePremium } from "../../shared/indianBanksAndInsurance";

export const bankingRouter = router({
  // Life Insurance Policies
  getLifeInsurancePolicies: protectedProcedure.query(async ({ ctx }) => {
    const policies = await getUserLifeInsurancePolicies(ctx.user.id);
    return policies || [];
  }),

  addLifeInsurancePolicy: protectedProcedure
    .input(
      z.object({
        policyNumber: z.string(),
        providerName: z.string(),
        coverageAmount: z.number(),
        premiumAmount: z.number(),
        premiumFrequency: z.enum(["monthly", "quarterly", "half-yearly", "yearly"]),
        startDate: z.date(),
        maturityDate: z.date().optional(),
        beneficiaryName: z.string().optional(),
        beneficiaryRelation: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const policy = await createLifeInsurancePolicy({
        userId: ctx.user.id,
        ...input,
        status: "active",
        nextPremiumDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      return policy;
    }),

  // Term Insurance Policies
  getTermInsurancePolicies: protectedProcedure.query(async ({ ctx }) => {
    const policies = await getUserTermInsurancePolicies(ctx.user.id);
    return policies || [];
  }),

  addTermInsurancePolicy: protectedProcedure
    .input(
      z.object({
        policyNumber: z.string(),
        providerName: z.string(),
        coverageAmount: z.number(),
        premiumAmount: z.number(),
        premiumFrequency: z.enum(["monthly", "quarterly", "half-yearly", "yearly"]),
        term: z.number(), // in years
        startDate: z.date(),
        beneficiaryName: z.string().optional(),
        beneficiaryRelation: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const expiryDate = new Date(input.startDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + input.term);

      const policy = await createTermInsurancePolicy({
        userId: ctx.user.id,
        ...input,
        expiryDate,
        status: "active",
        nextPremiumDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      return policy;
    }),

  // Bank Accounts
  getBankAccounts: protectedProcedure.query(async ({ ctx }) => {
    const accounts = await getUserBankAccounts(ctx.user.id);
    return accounts || [];
  }),

  addBankAccount: protectedProcedure
    .input(
      z.object({
        accountNumber: z.string(),
        bankName: z.string(),
        accountType: z.enum(["savings", "current", "salary"]),
        accountHolder: z.string(),
        ifscCode: z.string(),
        balance: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const account = await createBankAccount({
        userId: ctx.user.id,
        ...input,
        isActive: 1,
      });
      return account;
    }),

  // Bank Transactions
  getAccountTransactions: protectedProcedure
    .input(z.object({ accountId: z.number() }))
    .query(async ({ input }) => {
      const transactions = await getAccountTransactions(input.accountId);
      return transactions || [];
    }),

  getUserTransactions: protectedProcedure.query(async ({ ctx }) => {
    const transactions = await getUserTransactions(ctx.user.id);
    return transactions || [];
  }),

  addTransaction: protectedProcedure
    .input(
      z.object({
        accountId: z.number(),
        type: z.enum(["credit", "debit"]),
        amount: z.number(),
        description: z.string().optional(),
        referenceNumber: z.string().optional(),
        balanceAfter: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const transaction = await createBankTransaction({
        userId: ctx.user.id,
        ...input,
      });
      return transaction;
    }),

  // Insurance Claims
  getInsuranceClaims: protectedProcedure.query(async ({ ctx }) => {
    const claims = await getUserInsuranceClaims(ctx.user.id);
    return claims || [];
  }),

  submitInsuranceClaim: protectedProcedure
    .input(
      z.object({
        policyId: z.number(),
        policyType: z.enum(["life", "term"]),
        claimAmount: z.number(),
        description: z.string(),
        documentUrls: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const claimNumber = `CLM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const claim = await createInsuranceClaim({
        userId: ctx.user.id,
        ...input,
        claimNumber,
        status: "submitted",
        documentUrls: input.documentUrls ? JSON.stringify(input.documentUrls) : null,
      });
      return claim;
    }),

  updateClaimStatus: protectedProcedure
    .input(
      z.object({
        claimId: z.number(),
        status: z.enum(["submitted", "under-review", "approved", "rejected", "paid"]),
      })
    )
    .mutation(async ({ input }) => {
      const updateData: any = { status: input.status };
      if (input.status === "approved") {
        updateData.approvedAt = new Date();
      } else if (input.status === "paid") {
        updateData.paidAt = new Date();
      }
      const claim = await updateInsuranceClaim(input.claimId, updateData);
      return claim;
    }),

  // Health Insurance Policies
  getHealthInsurancePolicies: protectedProcedure.query(async ({ ctx }) => {
    const policies = await getUserHealthInsurancePolicies(ctx.user.id);
    return policies || [];
  }),

  addHealthInsurancePolicy: protectedProcedure
    .input(
      z.object({
        policyNumber: z.string(),
        providerName: z.string(),
        sumInsured: z.number(),
        coverageType: z.enum(["individual", "family", "senior"]),
        familyMembers: z.number().default(1),
        startDate: z.date(),
        networkHospitals: z.number().optional(),
        cashlessLimit: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const premiumAmount = calculateHealthInsurancePremium(
        30,
        input.sumInsured,
        input.familyMembers
      );

      const renewalDate = new Date(input.startDate);
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);

      const policy = await createHealthInsurancePolicy({
        userId: ctx.user.id,
        ...input,
        premiumAmount,
        renewalDate,
        status: "active",
        nextPremiumDueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      });
      return policy;
    }),

  // Health Insurance Claims
  getHealthInsuranceClaims: protectedProcedure.query(async ({ ctx }) => {
    const claims = await getUserHealthInsuranceClaims(ctx.user.id);
    return claims || [];
  }),

  submitHealthInsuranceClaim: protectedProcedure
    .input(
      z.object({
        policyId: z.number(),
        claimAmount: z.number(),
        hospitalName: z.string(),
        treatmentType: z.string(),
        admissionDate: z.date(),
        dischargeDate: z.date(),
        documentUrls: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const claimNumber = `HLM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const claim = await createHealthInsuranceClaim({
        userId: ctx.user.id,
        ...input,
        claimNumber,
        status: "submitted",
        documentUrls: input.documentUrls ? JSON.stringify(input.documentUrls) : null,
      });
      return claim;
    }),

  updateHealthClaimStatus: protectedProcedure
    .input(
      z.object({
        claimId: z.number(),
        status: z.enum(["submitted", "under-review", "approved", "rejected", "paid"]),
      })
    )
    .mutation(async ({ input }) => {
      const updateData: any = { status: input.status };
      if (input.status === "approved") {
        updateData.approvedAt = new Date();
      } else if (input.status === "paid") {
        updateData.paidAt = new Date();
      }
      const claim = await updateHealthInsuranceClaim(input.claimId, updateData);
      return claim;
    }),

  // Get Indian Providers
  getIndianBanks: protectedProcedure.query(() => INDIAN_BANKS),
  getLifeInsuranceProviders: protectedProcedure.query(() => INDIAN_LIFE_INSURANCE_PROVIDERS),
  getTermInsuranceProviders: protectedProcedure.query(() => INDIAN_TERM_INSURANCE_PROVIDERS),
  getHealthInsuranceProviders: protectedProcedure.query(() => INDIAN_HEALTH_INSURANCE_PROVIDERS),
});
