import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { z } from "zod";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as any,
});

export const paymentRouter = router({
  createCheckoutSession: protectedProcedure
    .input(z.object({
      plan: z.enum(["pro", "premium"]),
      priceInCents: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (!process.env.STRIPE_SECRET_KEY) {
          throw new Error("Stripe API key not configured");
        }

        const origin = ctx.req.headers.origin || "https://localhost:3000";
        
        // Create Stripe checkout session for one-time payment (not subscription)
        // Using payment mode instead of subscription for simpler test flow
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `RA-PHA ${input.plan.charAt(0).toUpperCase() + input.plan.slice(1)} Plan`,
                  description: `Monthly subscription for ${input.plan} plan`,
                },
                unit_amount: input.priceInCents,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/?payment=cancelled`,
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
            plan: input.plan,
          },
          allow_promotion_codes: true,
        });

        // Create payment record in database
        await db.createPayment({
          userId: ctx.user.id,
          stripeSessionId: session.id,
          stripePaymentIntentId: null,
          amount: input.priceInCents,
          currency: "usd",
          status: "pending",
          plan: input.plan as any,
          description: `${input.plan} plan subscription`,
        });

        return {
          sessionId: session.id,
          url: session.url,
        };
      } catch (error) {
        console.error("Error creating checkout session:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Detailed error:", errorMessage);
        throw new Error(`Failed to create checkout session: ${errorMessage}`);
      }
    }),

  getPaymentHistory: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        return await db.getUserPayments(ctx.user.id);
      } catch (error) {
        console.error("Error fetching payment history:", error);
        return [];
      }
    }),

  getSubscriptionStatus: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const subscription = await db.getUserSubscription(ctx.user.id);
        return subscription || {
          plan: "free",
          status: "inactive",
          currentPeriodEnd: null,
        };
      } catch (error) {
        console.error("Error fetching subscription:", error);
        return {
          plan: "free",
          status: "inactive",
          currentPeriodEnd: null,
        };
      }
    }),

  cancelSubscription: protectedProcedure
    .mutation(async ({ ctx }) => {
      try {
        const subscription = await db.getUserSubscription(ctx.user.id);
        if (!subscription || !subscription.stripeSubscriptionId) {
          throw new Error("No active subscription found");
        }

        // Cancel on Stripe
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

        // Update in database
        await db.createOrUpdateSubscription({
          userId: ctx.user.id,
          plan: "free",
          status: "cancelled",
          cancelledAt: new Date(),
        });

        return { success: true };
      } catch (error) {
        console.error("Error cancelling subscription:", error);
        throw new Error("Failed to cancel subscription");
      }
    }),
});
