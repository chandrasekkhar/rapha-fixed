import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const resetPasswordMutation = trpc.auth.resetPassword.useMutation();

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!token) {
      setError("Invalid reset token");
      setLoading(false);
      return;
    }

    try {
      const result = await resetPasswordMutation.mutateAsync({
        token,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      if (result.success) {
        setSuccess(true);
        setForm({ password: "", confirmPassword: "" });
      }
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-white rounded-xl border border-indigo-200 flex items-center justify-center shadow-lg mb-4">
              <img src={APP_LOGO} alt={APP_TITLE} className="w-10 h-10 rounded-md" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{APP_TITLE}</h1>
          </div>

          <Card className="shadow-lg border-0">
            <CardContent className="pt-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Invalid or missing reset token. Please request a new password reset.
                </AlertDescription>
              </Alert>

              <Button
                onClick={() => setLocation("/forgot-password")}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Request New Reset Link
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white rounded-xl border border-indigo-200 flex items-center justify-center shadow-lg mb-4">
            <img src={APP_LOGO} alt={APP_TITLE} className="w-10 h-10 rounded-md" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{APP_TITLE}</h1>
          <p className="text-gray-600 mt-2">Create New Password</p>
        </div>

        {/* Success Message */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your password has been reset successfully. You can now log in with your new password.
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
              Enter your new password below. Make sure it's strong and secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">New Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      disabled={loading}
                      className="border-gray-300 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    At least 8 characters with uppercase, lowercase, number, and special character
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      disabled={loading}
                      className="border-gray-300 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
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
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Reset Successful</h3>
                  <p className="text-gray-600">
                    Your password has been reset. You can now log in with your new password.
                  </p>
                </div>

                {/* Back to Login Button */}
                <Button
                  onClick={() => setLocation("/login")}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  Go to Login
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
