import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Plus } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function Wellness() {
  const { data: plans, isLoading } = trpc.wellness.getPlans.useQuery();
  const createPlanMutation = trpc.wellness.createPlan.useMutation();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "fitness" as "diet" | "fitness" | "mental_health",
    title: "",
    description: "",
    duration: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPlanMutation.mutateAsync({
        type: formData.type,
        title: formData.title,
        description: formData.description,
        duration: formData.duration ? parseInt(formData.duration) : null,
      });
      setFormData({
        type: "fitness",
        title: "",
        description: "",
        duration: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "diet":
        return "🥗";
      case "fitness":
        return "💪";
      case "mental_health":
        return "🧘";
      default:
        return "📋";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "diet":
        return "bg-green-50 border-l-green-600";
      case "fitness":
        return "bg-blue-50 border-l-blue-600";
      case "mental_health":
        return "bg-purple-50 border-l-purple-600";
      default:
        return "bg-gray-50 border-l-gray-600";
    }
  };

  const dietPlans = plans?.filter(p => p.type === "diet") || [];
  const fitnessPlans = plans?.filter(p => p.type === "fitness") || [];
  const mentalHealthPlans = plans?.filter(p => p.type === "mental_health") || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Dumbbell className="w-8 h-8 text-green-600" />
              Wellness Plans
            </h1>
            <p className="text-gray-600 mt-2">Personalized health programs tailored for you</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="border-indigo-200 bg-indigo-50">
            <CardHeader>
              <CardTitle>Create New Wellness Plan</CardTitle>
              <CardDescription>Design a personalized health program</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="fitness">Fitness</option>
                    <option value="diet">Diet</option>
                    <option value="mental_health">Mental Health</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., 30-Day Cardio Challenge"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your wellness plan..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={createPlanMutation.isPending}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {createPlanMutation.isPending ? "Creating..." : "Create Plan"}
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

        {/* Plans by Type */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading wellness plans...</div>
        ) : plans && plans.length > 0 ? (
          <div className="space-y-6">
            {/* Fitness Plans */}
            {fitnessPlans.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">💪</span>
                    Fitness Plans
                  </CardTitle>
                  <CardDescription>Exercise and physical activity programs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fitnessPlans.map((plan) => (
                    <div key={plan.id} className={`p-4 rounded-lg border-l-4 ${getTypeColor(plan.type)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{plan.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                        </div>
                        <span className="text-sm font-medium text-gray-600 whitespace-nowrap ml-4">
                          {plan.duration} days
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${plan.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{plan.progress}% Complete</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Diet Plans */}
            {dietPlans.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🥗</span>
                    Diet Plans
                  </CardTitle>
                  <CardDescription>Nutrition and dietary guidance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dietPlans.map((plan) => (
                    <div key={plan.id} className={`p-4 rounded-lg border-l-4 ${getTypeColor(plan.type)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{plan.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                        </div>
                        <span className="text-sm font-medium text-gray-600 whitespace-nowrap ml-4">
                          {plan.duration} days
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${plan.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{plan.progress}% Complete</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Mental Health Plans */}
            {mentalHealthPlans.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🧘</span>
                    Mental Health Plans
                  </CardTitle>
                  <CardDescription>Stress management and wellness</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mentalHealthPlans.map((plan) => (
                    <div key={plan.id} className={`p-4 rounded-lg border-l-4 ${getTypeColor(plan.type)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{plan.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                        </div>
                        <span className="text-sm font-medium text-gray-600 whitespace-nowrap ml-4">
                          {plan.duration} days
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${plan.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{plan.progress}% Complete</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12 text-gray-500">
              <p>No wellness plans yet</p>
              <p className="text-sm mt-2">Create a personalized wellness plan to get started</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
