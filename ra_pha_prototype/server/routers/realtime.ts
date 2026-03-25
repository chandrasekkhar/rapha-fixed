import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  searchHospitals,
  searchPharmacies,
  bookAmbulance,
  sendSMS,
  sendPushNotification,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getWearableHealthData,
} from "../_core/indiaServices";

export const realtimeRouter = router({
  // Hospital Search
  searchHospitals: protectedProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        radiusKm: z.number().optional().default(5),
      })
    )
    .query(async ({ input }) => {
      return await searchHospitals(input.latitude, input.longitude, input.radiusKm);
    }),

  // Pharmacy Search
  searchPharmacies: protectedProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        radiusKm: z.number().optional().default(5),
      })
    )
    .query(async ({ input }) => {
      return await searchPharmacies(input.latitude, input.longitude, input.radiusKm);
    }),

  // Book Ambulance
  bookAmbulance: protectedProcedure
    .input(
      z.object({
        pickupLatitude: z.number(),
        pickupLongitude: z.number(),
        emergencyType: z.enum(["medical", "accident", "other"]),
        patientPhone: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await bookAmbulance(
        input.pickupLatitude,
        input.pickupLongitude,
        input.emergencyType,
        input.patientPhone
      );
    }),

  // Send SMS
  sendSMS: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await sendSMS(input.phoneNumber, input.message);
      return { success: result };
    }),

  // Send Push Notification
  sendPushNotification: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await sendPushNotification(ctx.user.id.toString(), input.title, input.message);
      return { success: result };
    }),

  // Create Razorpay Order
  createRazorpayOrder: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        description: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await createRazorpayOrder(input.amount, input.description);
    }),

  // Verify Razorpay Payment
  verifyRazorpayPayment: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        paymentId: z.string(),
        signature: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const isValid = await verifyRazorpayPayment(input.orderId, input.paymentId, input.signature);
      return { success: isValid };
    }),

  // Get Wearable Health Data
  getWearableHealthData: protectedProcedure
    .input(
      z.object({
        deviceType: z.enum(["fitbit", "google-fit"]),
      })
    )
    .query(async ({ ctx, input }) => {
      return await getWearableHealthData(ctx.user.id.toString(), input.deviceType);
    }),
});
