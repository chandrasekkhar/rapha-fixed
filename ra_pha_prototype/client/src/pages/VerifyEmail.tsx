import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2, AlertCircle, CheckCircle, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  const verifyEmailMutation = trpc.auth.verifyEmail.useMutation();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setError("Invalid or missing verification token");
        return;
      }

      try {
        const result = await verifyEmailMutation.mutateAsync({ token });
        if (result.success) {
          setStatus("success");
        }
      } catch (err: any) {
        setStatus("error");
        setError(err.message || "Failed to verify email");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white rounded-xl border border-indigo-200 flex items-center justify-center shadow-lg mb-4">
            <img src={APP_LOGO} alt={APP_TITLE} className="w-10 h-10 rounded-md" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{APP_TITLE}</h1>
          <p className="text-gray-600 mt-2">Email Verification</p>
        </div>

        {/* Card */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Verifying Your Email</CardTitle>
            <CardDescription>
              {status === "loading" && "Please wait while we verify your email address..."}
              {status === "success" && "Your email has been verified successfully!"}
              {status === "error" && "There was an issue verifying your email"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === "loading" && (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-600 text-center">Verifying your email address...</p>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                    Email Verified Successfully
                  </h3>
                  <p className="text-gray-600 text-center">
                    Your email address has been verified. You can now enjoy all RAPHA features.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <strong>Great!</strong> Your account is now fully activated.
                  </p>
                </div>

                {/* Go to Dashboard Button */}
                <Button
                  onClick={() => setLocation("/")}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 mb-3">
                    <strong>What you can do:</strong>
                  </p>
                  <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
                    <li>Request a new verification email</li>
                    <li>Check your email for the correct verification link</li>
                    <li>Contact support if the problem persists</li>
                  </ul>
                </div>

                {/* Request New Link Button */}
                <Button
                  onClick={() => setLocation("/login")}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  Back to Login
                </Button>

                {/* Help Button */}
                <Button
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    // TODO: Open support chat or contact form
                    alert("Support feature coming soon");
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Need help?{" "}
          <button
            onClick={() => setLocation("/login")}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Go back to login
          </button>
        </p>
      </div>
    </div>
  );
}
