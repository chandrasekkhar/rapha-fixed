import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Plus } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function Vitals() {
  const { data: vitals, isLoading } = trpc.health.getVitals.useQuery();
  const createVitalMutation = trpc.health.createVital.useMutation();
  const analyzeVitalsMutation = trpc.ai.analyzeVitals.useMutation();
  const [showForm, setShowForm] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    heartRate: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    oxygenLevel: "",
    sleepHours: "",
    stressLevel: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    try {
      const vitalData = {
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : null,
        bloodPressureSystolic: formData.bloodPressureSystolic ? parseInt(formData.bloodPressureSystolic) : null,
        bloodPressureDiastolic: formData.bloodPressureDiastolic ? parseInt(formData.bloodPressureDiastolic) : null,
        oxygenLevel: formData.oxygenLevel ? parseInt(formData.oxygenLevel) : null,
        sleepHours: formData.sleepHours ? parseInt(formData.sleepHours) : null,
        stressLevel: formData.stressLevel ? parseInt(formData.stressLevel) : null,
      };
      
      await createVitalMutation.mutateAsync(vitalData);
      
      // Get AI analysis
      const analysis = await analyzeVitalsMutation.mutateAsync(vitalData);
      const analysisText = typeof analysis === "string" ? analysis : JSON.stringify(analysis);
      setAiAnalysis(analysisText);
      
      setFormData({
        heartRate: "",
        bloodPressureSystolic: "",
        bloodPressureDiastolic: "",
        oxygenLevel: "",
        sleepHours: "",
        stressLevel: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating vital:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="w-8 h-8 text-red-600" />
              Vitals Monitoring
            </h1>
            <p className="text-gray-600 mt-2">Track your health metrics over time</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Record Vitals
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="border-indigo-200 bg-indigo-50">
            <CardHeader>
              <CardTitle>Record New Vitals</CardTitle>
              <CardDescription>Enter your current health measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heart Rate (bpm)
                    </label>
                    <input
                      type="number"
                      name="heartRate"
                      value={formData.heartRate}
                      onChange={handleInputChange}
                      placeholder="e.g., 72"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Pressure (Systolic)
                    </label>
                    <input
                      type="number"
                      name="bloodPressureSystolic"
                      value={formData.bloodPressureSystolic}
                      onChange={handleInputChange}
                      placeholder="e.g., 120"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Pressure (Diastolic)
                    </label>
                    <input
                      type="number"
                      name="bloodPressureDiastolic"
                      value={formData.bloodPressureDiastolic}
                      onChange={handleInputChange}
                      placeholder="e.g., 80"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Oxygen Level (%)
                    </label>
                    <input
                      type="number"
                      name="oxygenLevel"
                      value={formData.oxygenLevel}
                      onChange={handleInputChange}
                      placeholder="e.g., 98"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sleep Hours
                    </label>
                    <input
                      type="number"
                      name="sleepHours"
                      value={formData.sleepHours}
                      onChange={handleInputChange}
                      placeholder="e.g., 7"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stress Level (1-10)
                    </label>
                    <input
                      type="number"
                      name="stressLevel"
                      value={formData.stressLevel}
                      onChange={handleInputChange}
                      placeholder="e.g., 5"
                      min="1"
                      max="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={createVitalMutation.isPending || isAnalyzing}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {createVitalMutation.isPending || isAnalyzing ? "Analyzing..." : "Save Vitals"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* AI Analysis */}
        {aiAnalysis && (
          <Card className="border-l-4 border-l-purple-600 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-900">AI Health Analysis</CardTitle>
              <CardDescription>Powered by RA-PHA AI Assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {aiAnalysis}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vitals List */}
        <Card>
          <CardHeader>
            <CardTitle>Health History</CardTitle>
            <CardDescription>Your recorded vitals over time</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading vitals...</div>
            ) : vitals && vitals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Heart Rate</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Blood Pressure</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Oxygen</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Sleep</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Stress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vitals.map((vital) => (
                      <tr key={vital.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {new Date(vital.timestamp).toLocaleDateString()} {new Date(vital.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-3 px-4">{vital.heartRate || "--"} bpm</td>
                        <td className="py-3 px-4">
                          {vital.bloodPressureSystolic && vital.bloodPressureDiastolic
                            ? `${vital.bloodPressureSystolic}/${vital.bloodPressureDiastolic}`
                            : "--"}
                        </td>
                        <td className="py-3 px-4">{vital.oxygenLevel || "--"}%</td>
                        <td className="py-3 px-4">{vital.sleepHours || "--"} hrs</td>
                        <td className="py-3 px-4">{vital.stressLevel || "--"}/10</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No vitals recorded yet</p>
                <p className="text-sm mt-2">Click "Record Vitals" to start tracking your health</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
