import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, LogOut, Shield } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-8 h-8 text-indigo-600" />
            Profile Settings
          </h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences</p>
        </div>

        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-medium">{user?.name || "Not provided"}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-medium">{user?.email || "Not provided"}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account ID</label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500 font-mono text-sm">{user?.id || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>Manage your RA-PHA membership</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-2 border-gray-200 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Free Plan</h4>
                <p className="text-2xl font-bold text-gray-900 mb-3">₹0</p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4 text-left">
                  <li>✓ Basic vitals monitoring</li>
                  <li>✓ Health dashboard</li>
                  <li>✗ AI insights</li>
                  <li>✗ Doctor access</li>
                </ul>
                <Button variant="outline" disabled className="w-full">
                  Current Plan
                </Button>
              </div>

              <div className="border-2 border-indigo-600 rounded-lg p-4 text-center bg-indigo-50">
                <div className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full mb-2">
                  POPULAR
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Pro Plan</h4>
                <p className="text-2xl font-bold text-gray-900 mb-1">₹299</p>
                <p className="text-xs text-gray-600 mb-3">/month</p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4 text-left">
                  <li>✓ Advanced vitals monitoring</li>
                  <li>✓ AI health insights</li>
                  <li>✓ Wellness plans</li>
                  <li>✗ Doctor consultations</li>
                </ul>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Upgrade to Pro
                </Button>
              </div>

              <div className="border-2 border-gray-200 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Premium Plan</h4>
                <p className="text-2xl font-bold text-gray-900 mb-1">₹699</p>
                <p className="text-xs text-gray-600 mb-3">/month</p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4 text-left">
                  <li>✓ All Pro features</li>
                  <li>✓ Doctor consultations</li>
                  <li>✓ Emergency SOS</li>
                  <li>✓ Priority support</li>
                </ul>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security & Privacy
            </CardTitle>
            <CardDescription>Manage your security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Password</h4>
                <p className="text-sm text-gray-600">Last changed 3 months ago</p>
              </div>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">
                Enable 2FA
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Data Privacy</h4>
                <p className="text-sm text-gray-600">Review our privacy policy</p>
              </div>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Health Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Health Preferences</CardTitle>
            <CardDescription>Customize your health tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Daily Health Reminders</h4>
                <p className="text-sm text-gray-600">Get reminders to log vitals</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Health Alerts</h4>
                <p className="text-sm text-gray-600">Receive alerts for abnormal readings</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Weekly Health Report</h4>
                <p className="text-sm text-gray-600">Get a summary of your health data</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => {
                if (confirm("Are you sure you want to logout?")) {
                  logout();
                }
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>

            <Button
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => {
                if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                  // Handle account deletion
                }
              }}
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
