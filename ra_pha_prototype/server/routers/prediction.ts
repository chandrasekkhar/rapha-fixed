import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  generateRiskAssessment,
  generatePreventionPlan,
  type HealthMetrics,
} from "../_core/healthPrediction";

export const predictionRouter = router({
  // Assess health risks
  assessHealthRisks: protectedProcedure
    .input(
      z.object({
        age: z.number(),
        gender: z.enum(["male", "female"]),
        heartRate: z.number(),
        bloodPressureSystolic: z.number(),
        bloodPressureDiastolic: z.number(),
        oxygenLevel: z.number(),
        bmi: z.number(),
        cholesterol: z.number(),
        glucose: z.number(),
        sleepHours: z.number(),
        stressLevel: z.number(),
        exerciseMinutesPerWeek: z.number(),
        alcoholConsumption: z.number(),
        smokingStatus: z.enum(["never", "former", "current"]),
        familyHistoryDiabetes: z.boolean(),
        familyHistoryHeartDisease: z.boolean(),
        familyHistoryHypertension: z.boolean(),
        familyHistoryCancer: z.boolean(),
      })
    )
    .query(({ input }) => {
      const metrics: HealthMetrics = input;
      return generateRiskAssessment(metrics);
    }),

  // Generate prevention plan
  generatePreventionPlan: protectedProcedure
    .input(
      z.object({
        age: z.number(),
        gender: z.enum(["male", "female"]),
        heartRate: z.number(),
        bloodPressureSystolic: z.number(),
        bloodPressureDiastolic: z.number(),
        oxygenLevel: z.number(),
        bmi: z.number(),
        cholesterol: z.number(),
        glucose: z.number(),
        sleepHours: z.number(),
        stressLevel: z.number(),
        exerciseMinutesPerWeek: z.number(),
        alcoholConsumption: z.number(),
        smokingStatus: z.enum(["never", "former", "current"]),
        familyHistoryDiabetes: z.boolean(),
        familyHistoryHeartDisease: z.boolean(),
        familyHistoryHypertension: z.boolean(),
        familyHistoryCancer: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const metrics: HealthMetrics = input;
      const assessment = generateRiskAssessment(metrics);
      return await generatePreventionPlan(metrics, assessment);
    }),

  // Get health score trend
  getHealthScoreTrend: protectedProcedure.query(({ ctx }) => {
    // Mock data - would fetch from database in production
    return {
      scores: [
        { date: "2025-11-01", score: 65 },
        { date: "2025-11-08", score: 68 },
        { date: "2025-11-15", score: 70 },
        { date: "2025-11-22", score: 72 },
        { date: "2025-11-29", score: 75 },
        { date: "2025-12-06", score: 78 },
      ],
      trend: "improving",
      improvement: 13,
    };
  }),

  // Get disease risk trends
  getDiseaseRiskTrends: protectedProcedure.query(({ ctx }) => {
    return {
      diabetes: [
        { date: "2025-11-01", risk: 65 },
        { date: "2025-11-15", risk: 62 },
        { date: "2025-12-01", risk: 58 },
      ],
      heartDisease: [
        { date: "2025-11-01", risk: 55 },
        { date: "2025-11-15", risk: 52 },
        { date: "2025-12-01", risk: 48 },
      ],
      hypertension: [
        { date: "2025-11-01", risk: 45 },
        { date: "2025-11-15", risk: 42 },
        { date: "2025-12-01", risk: 40 },
      ],
    };
  }),

  // Get prevention plan progress
  getPreventionPlanProgress: protectedProcedure.query(({ ctx }) => {
    return {
      planName: "Diabetes Prevention Plan",
      startDate: "2025-11-01",
      duration: "90 days",
      progress: 45,
      completedActivities: 23,
      totalActivities: 50,
      adherenceRate: 92,
      nextMilestone: "Week 6 - Achieve 10% weight loss",
    };
  }),

  // Save health metrics for prediction
  saveHealthMetrics: protectedProcedure
    .input(
      z.object({
        age: z.number(),
        gender: z.enum(["male", "female"]),
        heartRate: z.number(),
        bloodPressureSystolic: z.number(),
        bloodPressureDiastolic: z.number(),
        oxygenLevel: z.number(),
        bmi: z.number(),
        cholesterol: z.number(),
        glucose: z.number(),
        sleepHours: z.number(),
        stressLevel: z.number(),
        exerciseMinutesPerWeek: z.number(),
        alcoholConsumption: z.number(),
        smokingStatus: z.enum(["never", "former", "current"]),
        familyHistoryDiabetes: z.boolean(),
        familyHistoryHeartDisease: z.boolean(),
        familyHistoryHypertension: z.boolean(),
        familyHistoryCancer: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      // In production, save to database
      return {
        success: true,
        message: "Health metrics saved successfully",
      };
    }),
});
