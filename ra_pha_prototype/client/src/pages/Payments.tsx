import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { formatPrice } from "@shared/products";

export default function Payments() {
  const { data: payments, isLoading } = trpc.payment.getPaymentHistory.useQuery();
  const { data: subscription } = trpc.payment.getSubscriptionStatus.useQuery();

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-8 h-8 text-indigo-600" />
            Payment & Subscription
          </h1>
          <p className="text-gray-600 mt-2">Manage your billing and subscription</p>
        </div>

        {/* Current Subscription */}
        <Card className="border-l-4 border-l-indigo-600">
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Your active plan and billing details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Plan</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">
                    {subscription?.plan || "Free"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(subscription?.status || "inactive")}`}>
                    {subscription?.status || "Inactive"}
                  </div>
                </div>
              </div>

              {subscription?.currentPeriodEnd && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Next Billing Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>
              )}

              {subscription?.plan !== "free" && (
                <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50">
                  Cancel Subscription
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent transactions and invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading payment history...</div>
            ) : payments && payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Plan</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment: any) => (
                      <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{formatDate(payment.createdAt)}</td>
                        <td className="py-3 px-4 text-gray-900 capitalize">{payment.plan}</td>
                        <td className="py-3 px-4 text-gray-900 font-semibold">
                          {formatPrice(payment.amount, payment.currency)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                            <Download className="w-4 h-4 mr-1" />
                            Invoice
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No payments yet</p>
                <p className="text-sm text-gray-500 mt-1">Your payment history will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Billing Information */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>Manage your billing details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> To update your billing information or payment method, please contact our support team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                Update Payment Method
              </Button>
              <Button variant="outline" className="w-full">
                Download Invoice
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">When will I be charged?</h4>
              <p className="text-gray-600 text-sm">You will be charged on the same day each month, starting from your subscription date.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I change my plan?</h4>
              <p className="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes will take effect on your next billing cycle.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What happens if I cancel?</h4>
              <p className="text-gray-600 text-sm">Your subscription will be cancelled immediately, and you will lose access to premium features at the end of your current billing period.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
