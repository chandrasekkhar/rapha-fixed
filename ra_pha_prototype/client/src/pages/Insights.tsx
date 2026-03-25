import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function Insights() {
  const { data: insights, isLoading } = trpc.insights.getInsights.useQuery();
  const createInsightMutation = trpc.insights.createInsight.useMutation();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    riskLevel: "low" as "low" | "medium" | "high",
    recommendation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInsightMutation.mutateAsync(formData);
      setFormData({
        title: "",
        description: "",
        riskLevel: "low",
        recommendation: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating insight:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const highRiskInsights = insights?.filter(i => i.riskLevel === "high") || [];
  const mediumRiskInsights = insights?.filter(i => i.riskLevel === "medium") || [];
  const lowRiskInsights = insights?.filter(i => i.riskLevel === "low") || [];

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "medium":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "low":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return null;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "bg-red-50 border-l-red-600";
      case "medium":
        return "bg-yellow-50 border-l-yellow-600";
      case "low":
        return "bg-green-50 border-l-green-600";
      default:
        return "bg-gray-50 border-l-gray-600";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-8 h-8 text-purple-600" />
              AI Health Insights
            </h1>
            <p className="text-gray-600 mt-2">Personalized health recommendations based on your data</p>
          </div>
        </div>

        {/* Risk Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-red-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">High Risk Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{highRiskInsights.length}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Medium Risk Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{mediumRiskInsights.length}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Low Risk / Healthy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{lowRiskInsights.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Insights by Risk Level */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading insights...</div>
        ) : insights && insights.length > 0 ? (
          <div className="space-y-6">
            {/* High Risk */}
            {highRiskInsights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    High Risk Alerts
                  </CardTitle>
                  <CardDescription>Immediate attention recommended</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {highRiskInsights.map((insight) => (
                    <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${getRiskColor(insight.riskLevel)}`}>
                      <div className="flex items-start gap-3">
                        {getRiskIcon(insight.riskLevel)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                          {insight.recommendation && (
                            <div className="mt-3 p-3 bg-white rounded border border-red-200">
                              <p className="text-sm font-medium text-gray-900">💡 Recommendation:</p>
                              <p className="text-sm text-gray-700 mt-1">{insight.recommendation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Medium Risk */}
            {mediumRiskInsights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-600">
                    <AlertTriangle className="w-5 h-5" />
                    Medium Risk Alerts
                  </CardTitle>
                  <CardDescription>Monitor closely and take preventive measures</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mediumRiskInsights.map((insight) => (
                    <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${getRiskColor(insight.riskLevel)}`}>
                      <div className="flex items-start gap-3">
                        {getRiskIcon(insight.riskLevel)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                          {insight.recommendation && (
                            <div className="mt-3 p-3 bg-white rounded border border-yellow-200">
                              <p className="text-sm font-medium text-gray-900">💡 Recommendation:</p>
                              <p className="text-sm text-gray-700 mt-1">{insight.recommendation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Low Risk */}
            {lowRiskInsights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    Healthy Status
                  </CardTitle>
                  <CardDescription>Keep up the good work!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lowRiskInsights.map((insight) => (
                    <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${getRiskColor(insight.riskLevel)}`}>
                      <div className="flex items-start gap-3">
                        {getRiskIcon(insight.riskLevel)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                          {insight.recommendation && (
                            <div className="mt-3 p-3 bg-white rounded border border-green-200">
                              <p className="text-sm font-medium text-gray-900">💡 Tip:</p>
                              <p className="text-sm text-gray-700 mt-1">{insight.recommendation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12 text-gray-500">
              <p>No AI insights available yet</p>
              <p className="text-sm mt-2">Record your vitals to receive personalized health insights</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
