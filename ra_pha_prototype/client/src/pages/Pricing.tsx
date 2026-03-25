import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { getAllPlans, formatPrice } from "@shared/products";

export default function Pricing() {
  const { isAuthenticated, user } = useAuth();
  const createCheckoutMutation = trpc.payment.createCheckoutSession.useMutation();
  const { data: subscription } = trpc.payment.getSubscriptionStatus.useQuery();

  const plans = getAllPlans();

  const handleSubscribe = async (planId: string, priceInCents: number) => {
    if (!isAuthenticated) {
      toast.error("Please log in to subscribe");
      return;
    }

    try {
      toast.loading("Redirecting to checkout...");
      const result = await createCheckoutMutation.mutateAsync({
        plan: planId as any,
        priceInCents,
      });

      if (result.url) {
        window.open(result.url, "_blank");
        toast.dismiss();
        toast.success("Redirecting to checkout page");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to create checkout session");
      console.error("Checkout error:", error);
    }
  };

  const freePlan = {
    id: "free",
    name: "Free Plan",
    price: 0,
    currency: "usd",
    interval: "month" as const,
    description: "Get started with basic health monitoring",
    features: [
      "Basic vitals tracking",
      "Health status overview",
      "Limited AI insights",
      "Mobile app access",
      "Community support",
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Choose the perfect plan for your health journey</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Free Plan */}
          <Card className={`relative ${subscription?.plan === "free" ? "ring-2 ring-indigo-600" : ""}`}>
            {subscription?.plan === "free" && (
              <div className="absolute top-0 left-0 right-0 bg-indigo-600 text-white py-2 text-center text-sm font-semibold rounded-t-lg">
                Current Plan
              </div>
            )}
            <CardHeader className={subscription?.plan === "free" ? "pt-16" : ""}>
              <CardTitle>{freePlan.name}</CardTitle>
              <CardDescription>{freePlan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">Free</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {freePlan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={subscription?.plan === "free" ? "outline" : "default"}
                disabled={subscription?.plan === "free"}
              >
                {subscription?.plan === "free" ? "Current Plan" : "Get Started"}
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          {plans[0] && (
            <Card className={`relative border-2 ${subscription?.plan === "pro" ? "ring-2 ring-indigo-600 border-indigo-600" : "border-gray-200"}`}>
              {subscription?.plan === "pro" && (
                <div className="absolute top-0 left-0 right-0 bg-indigo-600 text-white py-2 text-center text-sm font-semibold rounded-t-lg">
                  Current Plan
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              <CardHeader className={subscription?.plan === "pro" ? "pt-16" : ""}>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-600" />
                  {plans[0].name}
                </CardTitle>
                <CardDescription>{plans[0].description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{(plans[0].price / 100).toFixed(2)}
                  </span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plans[0].features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => handleSubscribe("pro", plans[0].price)}
                  disabled={subscription?.plan === "pro" || createCheckoutMutation.isPending}
                >
                  {subscription?.plan === "pro"
                    ? "Current Plan"
                    : createCheckoutMutation.isPending
                      ? "Processing..."
                      : "Subscribe Now"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Premium Plan */}
          {plans[1] && (
            <Card className={`relative ${subscription?.plan === "premium" ? "ring-2 ring-indigo-600" : ""}`}>
              {subscription?.plan === "premium" && (
                <div className="absolute top-0 left-0 right-0 bg-indigo-600 text-white py-2 text-center text-sm font-semibold rounded-t-lg">
                  Current Plan
                </div>
              )}
              <CardHeader className={subscription?.plan === "premium" ? "pt-16" : ""}>
                <CardTitle>{plans[1].name}</CardTitle>
                <CardDescription>{plans[1].description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{(plans[1].price / 100).toFixed(2)}
                  </span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plans[1].features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={subscription?.plan === "premium" ? "outline" : "default"}
                  onClick={() => handleSubscribe("premium", plans[1].price)}
                  disabled={subscription?.plan === "premium" || createCheckoutMutation.isPending}
                >
                  {subscription?.plan === "premium"
                    ? "Current Plan"
                    : createCheckoutMutation.isPending
                      ? "Processing..."
                      : "Subscribe Now"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change my plan anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will take effect on your next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Start with our Free plan to explore all features. Upgrade anytime to unlock premium capabilities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment processor.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens if I cancel?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your subscription will be cancelled immediately. You'll lose access to premium features at the end of your current billing period.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
