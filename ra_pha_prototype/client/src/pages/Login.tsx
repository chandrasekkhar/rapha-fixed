import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  // tRPC mutations
  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await loginMutation.mutateAsync({
        username: loginForm.username,
        password: loginForm.password,
      });

      if (result.success) {
        // Redirect to dashboard
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await registerMutation.mutateAsync({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
        confirmPassword: registerForm.confirmPassword,
        name: registerForm.name || registerForm.username,
      });

      if (result.success) {
        // Redirect to dashboard
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
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
          <p className="text-gray-600 mt-2">Your Personal Health Assistant</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Login Form */}
        {!isRegistering ? (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your health dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={loginForm.username}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, username: e.target.value })
                    }
                    disabled={loading}
                    className="border-gray-300"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
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
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setLocation("/forgot-password")}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>

                {/* OAuth Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    window.location.href = getLoginUrl();
                  }}
                  disabled={loading}
                >
                  Continue with OAuth
                </Button>

                {/* Register Link */}
                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegistering(true);
                        setError(null);
                      }}
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Create one
                    </button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Registration Form */
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Sign up to start tracking your health</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name (Optional)</label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, name: e.target.value })
                    }
                    disabled={loading}
                    className="border-gray-300"
                  />
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <Input
                    type="text"
                    placeholder="Choose a username"
                    value={registerForm.username}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, username: e.target.value })
                    }
                    disabled={loading}
                    className="border-gray-300"
                    required
                  />
                  <p className="text-xs text-gray-500">3-50 characters, letters, numbers, underscores, hyphens</p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, email: e.target.value })
                    }
                    disabled={loading}
                    className="border-gray-300"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, password: e.target.value })
                      }
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
                      placeholder="Confirm your password"
                      value={registerForm.confirmPassword}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, confirmPassword: e.target.value })
                      }
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

                {/* Sign Up Button */}
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                {/* Sign In Link */}
                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegistering(false);
                        setError(null);
                      }}
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Your health data is secure and private
        </p>
      </div>
    </div>
  );
}
