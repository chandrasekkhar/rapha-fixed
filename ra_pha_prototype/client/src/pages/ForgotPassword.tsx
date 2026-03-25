import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestResetMutation = trpc.auth.requestPasswordReset.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await requestResetMutation.mutateAsync({ email });

      if (result.success) {
        setSuccess(true);
        setEmail("");
      }
    } catch (err: any) {
      setError(err.message || "Failed to request password reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white rounded-xl border border-indigo-200 flex items-center justify-center shadow-lg mb-4">
            <img src={APP_LOGO} alt={APP_TITLE} className="w-10 h-10 rounded-md" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{APP_TITLE}</h1>
          <p className="text-gray-600 mt-2">Forgot Your Password?</p>
        </div>

        {/* Success Message */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Check your email for password reset instructions. The link expires in 1 hour.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && !success && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form Card */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="border-gray-300"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    We'll send a password reset link to this email address
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                {/* Back to Login */}
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                  onClick={() => setLocation("/login")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h3>
                  <p className="text-gray-600 mb-4">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Check your spam folder if you don't see the email within a few minutes.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Remember:</strong> The reset link expires in 1 hour for security reasons.
                  </p>
                </div>

                {/* Back to Login Button */}
                <Button
                  type="button"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
                  onClick={() => setLocation("/login")}
                >
                  Back to Login
                </Button>

                {/* Try Again Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                  }}
                >
                  Try Another Email
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <button
            onClick={() => setLocation("/login")}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
