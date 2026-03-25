import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Heart,
  Activity,
  Zap,
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export default function HealthPrediction() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    age: number;
    gender: "male" | "female";
    heartRate: number;
    bloodPressureSystolic: number;
    bloodPressureDiastolic: number;
    oxygenLevel: number;
    bmi: number;
    cholesterol: number;
    glucose: number;
    sleepHours: number;
    stressLevel: number;
    exerciseMinutesPerWeek: number;
    alcoholConsumption: number;
    smokingStatus: "never" | "former" | "current";
    familyHistoryDiabetes: boolean;
    familyHistoryHeartDisease: boolean;
    familyHistoryHypertension: boolean;
    familyHistoryCancer: boolean;
  }>({
    age: 35,
    gender: "male",
    heartRate: 72,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    oxygenLevel: 98,
    bmi: 24,
    cholesterol: 180,
    glucose: 95,
    sleepHours: 7,
    stressLevel: 5,
    exerciseMinutesPerWeek: 150,
    alcoholConsumption: 2,
    smokingStatus: "never",
    familyHistoryDiabetes: false,
    familyHistoryHeartDisease: false,
    familyHistoryHypertension: false,
    familyHistoryCancer: false,
  });

  // Assess health risks
  const { data: riskAssessment, isLoading: assessmentLoading } = trpc.prediction.assessHealthRisks.useQuery(
    formData,
    { enabled: !showForm }
  );

  // Generate prevention plan
  const preventionPlanMutation = trpc.prediction.generatePreventionPlan.useMutation({
    onSuccess: () => {
      toast.success("Prevention plan generated successfully!");
    },
    onError: () => {
      toast.error("Failed to generate prevention plan");
    },
  });

  // Get health score trend
  const { data: healthScoreTrend } = trpc.prediction.getHealthScoreTrend.useQuery();

  // Get disease risk trends
  const { data: diseaseRiskTrends } = trpc.prediction.getDiseaseRiskTrends.useQuery();

  // Get prevention plan progress
  const { data: planProgress } = trpc.prediction.getPreventionPlanProgress.useQuery();

  const handleGeneratePlan = async () => {
    try {
      await preventionPlanMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Error generating prevention plan:", error);
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk > 70) return "text-red-600";
    if (risk > 50) return "text-orange-600";
    if (risk > 30) return "text-yellow-600";
    return "text-green-600";
  };

  const getRiskBgColor = (risk: number) => {
    if (risk > 70) return "bg-red-50";
    if (risk > 50) return "bg-orange-50";
    if (risk > 30) return "bg-yellow-50";
    return "bg-green-50";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">AI Health Prediction</h1>
          <p className="text-slate-600">Early illness detection and personalized prevention plans</p>
        </div>

        {/* Urgent Alerts */}
        {riskAssessment && riskAssessment.urgentAlerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {riskAssessment.urgentAlerts.map((alert, idx) => (
              <Alert key={idx} className="bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{alert}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Overall Health Score */}
        {riskAssessment && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Overall Health Score</span>
                <span className={`text-4xl font-bold ${riskAssessment.overallHealthScore > 70 ? "text-green-600" : riskAssessment.overallHealthScore > 50 ? "text-yellow-600" : "text-red-600"}`}>
                  {riskAssessment.overallHealthScore}
                </span>
              </CardTitle>
              <CardDescription>Risk Level: {riskAssessment.riskLevel.toUpperCase()}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="risks" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="risks">Disease Risks</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="prevention">Prevention Plan</TabsTrigger>
            <TabsTrigger value="metrics">Health Metrics</TabsTrigger>
          </TabsList>

          {/* Disease Risks Tab */}
          <TabsContent value="risks" className="space-y-4">
            {assessmentLoading ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <p>Analyzing health risks...</p>
                </CardContent>
              </Card>
            ) : riskAssessment ? (
              <>
                {/* Risk Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Diabetes", risk: riskAssessment.diabetesRisk, icon: Activity },
                    { name: "Heart Disease", risk: riskAssessment.heartDiseaseRisk, icon: Heart },
                    { name: "Hypertension", risk: riskAssessment.hypertensionRisk, icon: Zap },
                    { name: "Stroke", risk: riskAssessment.strokeRisk, icon: AlertCircle },
                    { name: "Obesity", risk: riskAssessment.obesityRisk, icon: TrendingUp },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Card key={item.name} className={`${getRiskBgColor(item.risk)} border-0`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Icon className="w-5 h-5" />
                              {item.name}
                            </CardTitle>
                            <span className={`text-2xl font-bold ${getRiskColor(item.risk)}`}>{item.risk}%</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                item.risk > 70
                                  ? "bg-red-600"
                                  : item.risk > 50
                                    ? "bg-orange-600"
                                    : item.risk > 30
                                      ? "bg-yellow-600"
                                      : "bg-green-600"
                              }`}
                              style={{ width: `${item.risk}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-600 mt-2">
                            {item.risk > 70
                              ? "High Risk - Seek medical attention"
                              : item.risk > 50
                                ? "Moderate Risk - Lifestyle changes needed"
                                : item.risk > 30
                                  ? "Low-Moderate Risk - Monitor closely"
                                  : "Low Risk - Maintain healthy habits"}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Primary Risks */}
                {riskAssessment.primaryRisks.length > 0 && (
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                      <CardTitle className="text-red-900 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Primary Health Risks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {riskAssessment.primaryRisks.map((risk) => (
                          <div key={risk} className="flex items-center gap-2 text-red-800">
                            <AlertTriangle className="w-4 h-4" />
                            {risk}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : null}
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            {/* Health Score Trend */}
            {healthScoreTrend && (
              <Card>
                <CardHeader>
                  <CardTitle>Health Score Trend</CardTitle>
                  <CardDescription>Your health score progression over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={healthScoreTrend.scores}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-4 flex items-center gap-2 text-green-600">
                    <TrendingUp className="w-5 h-5" />
                    <span>Improving by {healthScoreTrend.improvement}% over the past month</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Disease Risk Trends */}
            {diseaseRiskTrends && (
              <Card>
                <CardHeader>
                  <CardTitle>Disease Risk Trends</CardTitle>
                  <CardDescription>How your disease risks are changing</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={diseaseRiskTrends.diabetes}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} name="Diabetes Risk" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Prevention Plan Tab */}
          <TabsContent value="prevention" className="space-y-4">
            {planProgress && (
              <Card>
                <CardHeader>
                  <CardTitle>{planProgress.planName}</CardTitle>
                  <CardDescription>Started on {planProgress.startDate}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold">Overall Progress</span>
                      <span className="text-sm text-slate-600">{planProgress.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-blue-600"
                        style={{ width: `${planProgress.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{planProgress.completedActivities}</div>
                      <div className="text-xs text-slate-600">Completed Activities</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-600">{planProgress.totalActivities}</div>
                      <div className="text-xs text-slate-600">Total Activities</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{planProgress.adherenceRate}%</div>
                      <div className="text-xs text-slate-600">Adherence Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{planProgress.duration}</div>
                      <div className="text-xs text-slate-600">Duration</div>
                    </div>
                  </div>

                  <Alert className="bg-blue-50 border-blue-200">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">{planProgress.nextMilestone}</AlertDescription>
                  </Alert>

                  <Button onClick={handleGeneratePlan} disabled={preventionPlanMutation.isPending} className="w-full">
                    {preventionPlanMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Plan...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Generate New Prevention Plan
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {riskAssessment && riskAssessment.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {riskAssessment.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Health Metrics Tab */}
          <TabsContent value="metrics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Update Health Metrics</CardTitle>
                <CardDescription>Enter your current health measurements for accurate risk assessment</CardDescription>
              </CardHeader>
              <CardContent>
                {showForm ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-slate-700">Age</label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                          className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-700">Gender</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" })}
                          className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-700">Heart Rate (bpm)</label>
                        <input
                          type="number"
                          value={formData.heartRate}
                          onChange={(e) => setFormData({ ...formData, heartRate: parseInt(e.target.value) })}
                          className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-700">BMI</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.bmi}
                          onChange={(e) => setFormData({ ...formData, bmi: parseFloat(e.target.value) })}
                          className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-700">Blood Pressure (Systolic)</label>
                        <input
                          type="number"
                          value={formData.bloodPressureSystolic}
                          onChange={(e) => setFormData({ ...formData, bloodPressureSystolic: parseInt(e.target.value) })}
                          className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-700">Blood Pressure (Diastolic)</label>
                        <input
                          type="number"
                          value={formData.bloodPressureDiastolic}
                          onChange={(e) => setFormData({ ...formData, bloodPressureDiastolic: parseInt(e.target.value) })}
                          className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-700">Glucose (mg/dL)</label>
                        <input
                          type="number"
                          value={formData.glucose}
                          onChange={(e) => setFormData({ ...formData, glucose: parseInt(e.target.value) })}
                          className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-700">Cholesterol (mg/dL)</label>
                        <input
                          type="number"
                          value={formData.cholesterol}
                          onChange={(e) => setFormData({ ...formData, cholesterol: parseInt(e.target.value) })}
                          className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => setShowForm(false)} className="flex-1">
                        Save & Analyze
                      </Button>
                      <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setShowForm(true)} className="w-full">
                    Update Metrics
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
