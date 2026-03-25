import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import * as db from "./db";
import { paymentRouter } from "./routers/payment";
import { emergencyRouter } from "./routers/emergency";
import { bankingRouter } from "./routers/banking";
import { realtimeRouter } from "./routers/realtime";
import { predictionRouter } from "./routers/prediction";
import { predictionsRouter } from "./routers/predictions";
import { healthReportsRouter } from "./routers/healthReports";
import { authRouter } from "./routers/auth";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: authRouter,

  health: router({
    getVitals: protectedProcedure.query(({ ctx }) =>
      db.getUserVitals(ctx.user.id)
    ),
    getLatestVital: protectedProcedure.query(({ ctx }) =>
      db.getLatestVital(ctx.user.id)
    ),
    createVital: protectedProcedure
      .input((data: any) => data)
      .mutation(({ ctx, input }) =>
        db.createVital({ ...input, userId: ctx.user.id })
      ),
  }),

  insights: router({
    getInsights: protectedProcedure.query(({ ctx }) =>
      db.getUserAIInsights(ctx.user.id)
    ),
    createInsight: protectedProcedure
      .input((data: any) => data)
      .mutation(({ ctx, input }) =>
        db.createAIInsight({ ...input, userId: ctx.user.id })
      ),
  }),

  wellness: router({
    getPlans: protectedProcedure.query(({ ctx }) =>
      db.getUserWellnessPlans(ctx.user.id)
    ),
    createPlan: protectedProcedure
      .input((data: any) => data)
      .mutation(({ ctx, input }) =>
        db.createWellnessPlan({ ...input, userId: ctx.user.id })
      ),
  }),

  appointments: router({
    getAppointments: protectedProcedure.query(({ ctx }) =>
      db.getUserAppointments(ctx.user.id)
    ),
    createAppointment: protectedProcedure
      .input((data: any) => data)
      .mutation(({ ctx, input }) =>
        db.createAppointment({ ...input, userId: ctx.user.id })
      ),
  }),

  payment: paymentRouter,
  emergency: emergencyRouter,
  banking: bankingRouter,
  realtime: realtimeRouter,
  prediction: predictionRouter,
  predictions: predictionsRouter,
  healthReports: healthReportsRouter,

  ai: router({
    analyzeVitals: protectedProcedure
      .input((data: any) => data)
      .mutation(async ({ ctx, input }) => {
        const { invokeLLM } = await import("../server/_core/llm");
        const vital = input;
        
        const prompt = `You are a professional health analyst. Based on these vital signs, provide a brief health assessment and recommendations:
- Heart Rate: ${vital.heartRate} bpm
- Blood Pressure: ${vital.bloodPressureSystolic}/${vital.bloodPressureDiastolic} mmHg
- Oxygen Level: ${vital.oxygenLevel}%
- Sleep: ${vital.sleepHours} hours
- Stress Level: ${vital.stressLevel}/10

Provide:
1. A brief health status assessment
2. Any concerning readings
3. 2-3 actionable recommendations

Keep response concise and professional.`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are a professional healthcare advisor providing personalized health insights based on vital signs."
            },
            {
              role: "user",
              content: prompt
            }
          ]
        });

        return response.choices[0].message.content;
      }),

    generateInsights: protectedProcedure
      .input((data: any) => data)
      .mutation(async ({ ctx, input }) => {
        const { invokeLLM } = await import("../server/_core/llm");
        const { vitals } = input;

        const vitalsSummary = vitals.map((v: any) => 
          `HR: ${v.heartRate}, BP: ${v.bloodPressureSystolic}/${v.bloodPressureDiastolic}, O2: ${v.oxygenLevel}%, Sleep: ${v.sleepHours}h, Stress: ${v.stressLevel}/10`
        ).join("\n");

        const prompt = `Analyze these vital signs trends and provide health insights:
${vitalsSummary}

Provide:
1. Overall health trend assessment
2. Risk factors identified
3. Personalized wellness recommendations

Format as JSON with keys: trend, riskLevel (low/medium/high), recommendation`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are a healthcare AI providing personalized health insights. Always respond with valid JSON."
            },
            {
              role: "user",
              content: prompt
            }
          ]
        });

        const content = response.choices[0].message.content;
        try {
          return typeof content === "string" ? JSON.parse(content) : content;
        } catch {
          return { trend: content, riskLevel: "low", recommendation: "Monitor your health regularly" };
        }
      }),

    chatWithAI: protectedProcedure
      .input((data: any) => data)
      .mutation(async ({ ctx, input }) => {
        const { invokeLLM } = await import("../server/_core/llm");
        const { message, conversationHistory } = input;

        const messages = [
          {
            role: "system" as const,
            content: "You are RA-PHA, a Revolutionary Advanced Personalized Healthcare Assistant. You provide evidence-based health advice, wellness tips, and personalized recommendations. Always be empathetic, professional, and encourage users to consult healthcare professionals for serious conditions."
          },
          ...conversationHistory,
          {
            role: "user" as const,
            content: message
          }
        ];

        const response = await invokeLLM({
          messages: messages as any
        });

        return response.choices[0].message.content;
      })
  }),
});

export type AppRouter = typeof appRouter;
