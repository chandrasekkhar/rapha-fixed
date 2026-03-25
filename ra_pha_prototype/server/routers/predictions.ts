import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  predictHealthRisks,
  calculateHealthScore,
  generateHealthAlerts,
  getPersonalizedRecommendations,
} from "../_core/realtimeHealthPrediction";

export const predictionsRouter = router({
  // Get real-time health prediction
  getPrediction: protectedProcedure
    .input(
      z.object({
        vitals: z.record(z.string(), z.number()),
        userAge: z.number(),
        userGender: z.string(),
        medicalHistory: z.array(z.string()).optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        // Convert vitals to array format for prediction
        const vitalsArray: Record<string, number[]> = {};
        for (const [key, value] of Object.entries(input.vitals)) {
          vitalsArray[key] = [value];
        }
        
        const prediction = await predictHealthRisks(
          vitalsArray,
          input.userAge,
          input.userGender,
          input.medicalHistory
        );

        const healthScore = calculateHealthScore(input.vitals);
        const alerts = generateHealthAlerts(input.vitals);
        const recommendations = await getPersonalizedRecommendations(
          prediction,
          input.userAge,
          input.userGender
        );

        return {
          success: true,
          healthScore,
          prediction,
          alerts,
          recommendations,
        };
      } catch (error) {
        console.error("Error getting prediction:", error);
        return {
          success: false,
          healthScore: 0,
          prediction: {
            riskScore: 0,
            predictedConditions: [],
            recommendations: [],
            urgentAlerts: [],
          },
          alerts: [],
          recommendations: [],
        };
      }
    }),

  // Get health score
  getHealthScore: protectedProcedure
    .input(
      z.object({
        vitals: z.record(z.string(), z.number()),
      })
    )
    .query(({ input }) => {
      const score = calculateHealthScore(input.vitals);
      return {
        score,
        status: score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Poor",
        recommendations: [
          "Monitor your vitals regularly",
          "Maintain a healthy lifestyle",
          "Consult your doctor if needed",
        ],
      };
    }),

  // Get health alerts
  getHealthAlerts: protectedProcedure
    .input(
      z.object({
        vitals: z.record(z.string(), z.number()),
      })
    )
    .query(({ input }) => {
      const alerts = generateHealthAlerts(input.vitals);
      return {
        alerts,
        hasUrgentAlerts: alerts.some(a => a.includes("CRITICAL") || a.includes("🚨")),
      };
    }),

  // Get trend analysis
  getTrendAnalysis: protectedProcedure
    .input(
      z.object({
        metric: z.string(),
        values: z.array(z.number()),
        period: z.enum(["daily", "weekly", "monthly"]).optional(),
      })
    )
    .query(({ input }) => {
      if (input.values.length < 2) {
        return {
          trend: "insufficient_data",
          direction: "stable",
          rate: 0,
          analysis: "Need more data points for analysis",
        };
      }

      const firstHalf = input.values.slice(0, Math.floor(input.values.length / 2));
      const secondHalf = input.values.slice(Math.floor(input.values.length / 2));

      const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

      const change = avgSecond - avgFirst;
      const rate = (change / avgFirst) * 100;

      let direction: "increasing" | "decreasing" | "stable" = "stable";
      if (rate > 5) direction = "increasing";
      else if (rate < -5) direction = "decreasing";

      const analysis =
        direction === "increasing"
          ? `${input.metric} is increasing at ${Math.abs(rate).toFixed(1)}% rate. Monitor closely.`
          : direction === "decreasing"
            ? `${input.metric} is decreasing at ${Math.abs(rate).toFixed(1)}% rate. Continue monitoring.`
            : `${input.metric} is stable. Keep maintaining current habits.`;

      return {
        trend: direction,
        direction,
        rate: parseFloat(rate.toFixed(2)),
        analysis,
        avgBefore: parseFloat(avgFirst.toFixed(2)),
        avgAfter: parseFloat(avgSecond.toFixed(2)),
      };
    }),

  // Get predictive health recommendations
  getPredictiveRecommendations: protectedProcedure
    .input(
      z.object({
        vitals: z.record(z.string(), z.number()),
        userAge: z.number(),
        userGender: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const vitalsArray: Record<string, number[]> = {};
        for (const [key, value] of Object.entries(input.vitals)) {
          vitalsArray[key] = [value];
        }
        
        const prediction = await predictHealthRisks(
          vitalsArray,
          input.userAge,
          input.userGender
        );

        const recommendations = await getPersonalizedRecommendations(
          prediction,
          input.userAge,
          input.userGender
        );

        return {
          success: true,
          recommendations,
          predictedRisks: prediction.predictedConditions,
        };
      } catch (error) {
        console.error("Error getting recommendations:", error);
        return {
          success: false,
          recommendations: [],
          predictedRisks: [],
        };
      }
    }),

  // Get health risk summary
  getRiskSummary: protectedProcedure
    .input(
      z.object({
        vitals: z.record(z.string(), z.number()),
        userAge: z.number(),
        userGender: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const healthScore = calculateHealthScore(input.vitals);
        const alerts = generateHealthAlerts(input.vitals);
        const vitalsArray: Record<string, number[]> = {};
        for (const [key, value] of Object.entries(input.vitals)) {
          vitalsArray[key] = [value];
        }
        
        const prediction = await predictHealthRisks(
          vitalsArray,
          input.userAge,
          input.userGender
        );

        return {
          healthScore,
          riskLevel: healthScore >= 80 ? "Low" : healthScore >= 60 ? "Moderate" : healthScore >= 40 ? "High" : "Critical",
          alerts,
          predictedConditions: prediction.predictedConditions,
          urgentAlerts: prediction.urgentAlerts,
        };
      } catch (error) {
        console.error("Error getting risk summary:", error);
        return {
          healthScore: 0,
          riskLevel: "Unknown",
          alerts: [],
          predictedConditions: [],
          urgentAlerts: [],
        };
      }
    }),
});
