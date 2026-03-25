/**
 * Product and pricing definitions for RA-PHA subscription plans
 * These are used for Stripe checkout sessions
 */

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number; // in cents (e.g., 29900 = $299.00)
  currency: string;
  interval: "month" | "year";
  description: string;
  features: string[];
  stripePriceId?: string; // Will be set from Stripe dashboard
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  pro: {
    id: "pro",
    name: "Pro Plan",
    price: 29900, // $299/month
    currency: "usd",
    interval: "month",
    description: "Advanced health monitoring and AI insights",
    features: [
      "Advanced vitals monitoring",
      "AI health insights",
      "Personalized wellness plans",
      "Health trend analysis",
      "Priority support",
    ],
  },
  premium: {
    id: "premium",
    name: "Premium Plan",
    price: 69900, // $699/month
    currency: "usd",
    interval: "month",
    description: "Complete healthcare solution with doctor access",
    features: [
      "All Pro features",
      "Doctor consultations (unlimited)",
      "Emergency SOS support",
      "24/7 health monitoring",
      "Personalized health coaching",
      "Priority support",
      "Family account support",
    ],
  },
};

/**
 * Get a subscription plan by ID
 */
export function getPlan(planId: string): SubscriptionPlan | null {
  return SUBSCRIPTION_PLANS[planId] || null;
}

/**
 * Format price for display
 */
export function formatPrice(cents: number, currency: string = "usd"): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(dollars);
}

/**
 * Get all available plans
 */
export function getAllPlans(): SubscriptionPlan[] {
  return Object.values(SUBSCRIPTION_PLANS);
}
