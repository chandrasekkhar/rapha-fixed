import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Brain, AlertCircle, TrendingUp, Activity, Wind, Moon, Zap } from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import HealthStatusCard from "@/components/HealthStatusCard";
import HealthMetricsChart from "@/components/HealthMetricsChart";

export default function Dashboard() {
  const { data: latestVital, isLoading: vitalLoading } = trpc.health.getLatestVital.useQuery();
  const { data: vitals } = trpc.health.getVitals.useQuery();
  const { data: insights, isLoading: insightsLoading } = trpc.insights.getInsights.useQuery();
  const { data: plans, isLoading: plansLoading } = trpc.wellness.getPlans.useQuery();

  const highRiskInsights = insights?.filter(i => i.riskLevel === "high") || [];
  const mediumRiskInsights = insights?.filter(i => i.riskLevel === "medium") || [];

  const getHealthStatus = () => {
    if (!latestVital) return "No Data";
    if (highRiskInsights.length > 0) return "⚠️ High Risk";
    if (mediumRiskInsights.length > 0) return "⚠️ Medium Risk";
    return "✅ Healthy";
  };

  // Mock chart data
  const chartData = [
    { name: "Mon", heartRate: 72, bloodPressure: 120, oxygenLevel: 98 },
    { name: "Tue", heartRate: 75, bloodPressure: 122, oxygenLevel: 97 },
    { name: "Wed", heartRate: 70, bloodPressure: 118, oxygenLevel: 99 },
    { name: "Thu", heartRate: 78, bloodPressure: 125, oxygenLevel: 96 },
    { name: "Fri", heartRate: 73, bloodPressure: 119, oxygenLevel: 98 },
    { name: "Sat", heartRate: 71, bloodPressure: 117, oxygenLevel: 99 },
    { name: "Sun", heartRate: 74, bloodPressure: 121, oxygenLevel: 97 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Premium Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-20"></div>
          <div className="relative card-premium bg-gradient-to-r from-indigo-50 to-purple-50 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Welcome Back</h1>
                <p className="text-gray-600 mt-2">Your health dashboard at a glance</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Overall Status</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{getHealthStatus()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Health Status Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <HealthStatusCard
            title="Heart Rate"
            value={vitalLoading ? "--" : latestVital?.heartRate || "--"}
            unit="bpm"
            icon={<Heart className="w-5 h-5" />}
            status={
              !latestVital || !latestVital.heartRate
                ? "warning"
                : latestVital.heartRate > 100 || latestVital.heartRate < 60
                  ? "warning"
                  : "healthy"
            }
            trend="stable"
            color="red"
          />

          <HealthStatusCard
            title="Blood Pressure"
            value={vitalLoading ? "--" : latestVital?.bloodPressureSystolic || "--"}
            unit="mmHg"
            icon={<Activity className="w-5 h-5" />}
            status={
              !latestVital || !latestVital.bloodPressureSystolic
                ? "warning"
                : latestVital.bloodPressureSystolic > 140
                  ? "critical"
                  : latestVital.bloodPressureSystolic > 130
                    ? "warning"
                    : "healthy"
            }
            trend="stable"
            color="blue"
          />

          <HealthStatusCard
            title="Oxygen Level"
            value={vitalLoading ? "--" : latestVital?.oxygenLevel || "--"}
            unit="%"
            icon={<Wind className="w-5 h-5" />}
            status={
              !latestVital || !latestVital.oxygenLevel
                ? "warning"
                : latestVital.oxygenLevel < 95
                  ? "critical"
                  : "healthy"
            }
            trend="stable"
            color="green"
          />

          <HealthStatusCard
            title="Sleep Quality"
            value={vitalLoading ? "--" : latestVital?.sleepHours || "--"}
            unit="hours"
            icon={<Moon className="w-5 h-5" />}
            status={
              !latestVital || !latestVital.sleepHours
                ? "warning"
                : latestVital.sleepHours < 6
                  ? "warning"
                  : "healthy"
            }
            trend="up"
            color="purple"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HealthMetricsChart
            title="Heart Rate Trends"
            description="Weekly heart rate pattern"
            data={chartData}
            type="area"
            dataKeys={["heartRate"]}
            colors={["#ef4444"]}
          />

          <HealthMetricsChart
            title="Blood Pressure Trends"
            description="Weekly blood pressure pattern"
            data={chartData}
            type="line"
            dataKeys={["bloodPressure"]}
            colors={["#3b82f6"]}
          />
        </div>

        {/* Insights and Wellness Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Health Insights */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span className="text-gradient">AI Health Insights</span>
              </CardTitle>
              <CardDescription>Personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {insightsLoading ? (
                <p className="text-gray-500">Loading insights...</p>
              ) : insights && insights.length > 0 ? (
                insights.slice(0, 3).map((insight: any) => (
                  <div key={insight.id} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 ${
                          insight.riskLevel === "high"
                            ? "bg-red-500"
                            : insight.riskLevel === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No insights available yet</p>
              )}
              <Link href="/ai-assistant">
                <Button variant="outline" className="w-full mt-4">
                  View All Insights
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Active Wellness Plans */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-600" />
                <span className="text-gradient">Active Plans</span>
              </CardTitle>
              <CardDescription>Your wellness programs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {plansLoading ? (
                <p className="text-gray-500">Loading plans...</p>
              ) : plans && plans.length > 0 ? (
                plans.slice(0, 3).map((plan: any) => (
                  <div key={plan.id} className="p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{plan.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{plan.type}</p>
                      </div>
                      <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                        {plan.status || "Active"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No active plans</p>
              )}
              <Link href="/wellness">
                <Button variant="outline" className="w-full mt-4">
                  View All Plans
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Risk Alerts */}
        {highRiskInsights.length > 0 && (
          <Card className="card-premium border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                Health Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {highRiskInsights.map((alert: any) => (
                  <div key={alert.id} className="p-3 bg-white rounded-lg border border-red-200">
                    <p className="text-sm font-medium text-red-900">{alert.title}</p>
                    <p className="text-xs text-red-700 mt-1">{alert.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
