import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileText,
  AlertTriangle,
  Pill,
  Apple,
  TrendingDown,
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle,
  Download,
  Trash2,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

export default function HealthReportAnalysis() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reportType, setReportType] = useState<"blood_work" | "imaging" | "pathology" | "general_checkup" | "other">(
    "blood_work"
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  // Upload and analyze report mutation
  const uploadMutation = trpc.healthReports.uploadAndAnalyzeReport.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setAnalysis(data);
        toast.success("Report analyzed successfully!");
      } else {
        toast.error(data.error || "Failed to analyze report");
      }
      setIsAnalyzing(false);
    },
    onError: (error) => {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze report. Please try again.");
      setIsAnalyzing(false);
    },
  });

  // Get report history
  const { data: reportHistory } = trpc.healthReports.getReportHistory.useQuery();

  // Get action plan
  const { data: actionPlan } = trpc.healthReports.getActionPlan.useQuery(
    {
      healthScore: analysis?.analysis?.healthScore || 0,
      conditions: analysis?.analysis?.risks?.map((r: any) => r.condition) || [],
      abnormalValues: analysis?.analysis?.abnormalValues?.map((v: any) => v.metric) || [],
    },
    { enabled: !!analysis }
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      // Validate file type
      const validTypes = ["application/pdf", "image/jpeg", "image/png", "application/msword"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a PDF, image, or Word document");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const fileContent = e.target?.result as string;
          const base64Data = fileContent.split(",")[1] || fileContent;

          // Call the tRPC mutation with file data
          await uploadMutation.mutateAsync({
            fileUrl: `data:${selectedFile.type};base64,${base64Data}`,
            fileName: selectedFile.name,
            reportType,
            userAge: 30,
            userGender: "male",
          });
        } catch (error) {
          console.error("Error processing file:", error);
          toast.error("Failed to process file");
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Health Report Analysis</h1>
          <p className="text-slate-600">
            Upload and analyze your health documents for personalized medicine and nutrition recommendations
          </p>
        </div>

        {/* Urgent Alerts */}
        {analysis?.analysis?.urgentAlerts?.length > 0 && (
          <div className="mb-6 space-y-2">
            {analysis.analysis.urgentAlerts.map((alert: string, idx: number) => (
              <Alert key={idx} className="bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{alert}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue={analysis ? "analysis" : "upload"} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!analysis}>
              Analysis
            </TabsTrigger>
            <TabsTrigger value="medicine" disabled={!analysis}>
              Medicine
            </TabsTrigger>
            <TabsTrigger value="nutrition" disabled={!analysis}>
              Nutrition
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Health Report
                </CardTitle>
                <CardDescription>Upload your medical documents for AI-powered analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Report Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="blood_work">Blood Work</option>
                    <option value="imaging">Imaging (X-ray, CT, MRI)</option>
                    <option value="pathology">Pathology Report</option>
                    <option value="general_checkup">General Checkup</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileText className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                    <p className="text-slate-700 font-semibold">
                      {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-slate-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                  </label>
                </div>

                <Button onClick={handleAnalyze} disabled={!selectedFile || isAnalyzing} className="w-full">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Report...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Analyze Report
                    </>
                  )}
                </Button>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Our AI analyzes your health documents to extract metrics, identify risks, and provide personalized recommendations.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          {analysis && (
            <TabsContent value="analysis" className="space-y-4">
              {/* Risk Assessment */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Risk Assessment</span>
                    <span
                      className={`text-2xl font-bold ${
                        analysis.analysis.healthScore >= 75
                          ? "text-green-600"
                          : analysis.analysis.healthScore >= 50
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {analysis.analysis.healthScore}/100
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Health Score:{" "}
                    {analysis.analysis.healthScore >= 75
                      ? "Good"
                      : analysis.analysis.healthScore >= 50
                        ? "Fair"
                        : "Needs Attention"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.analysis.risks?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Identified Risks:</h4>
                      <div className="space-y-2">
                        {analysis.analysis.risks.map((risk: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 p-2 bg-white rounded border border-orange-200">
                            <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-slate-900">{risk.condition}</p>
                              <p className="text-xs text-slate-600">Severity: {risk.severity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.analysis.abnormalValues?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Abnormal Values:</h4>
                      <div className="space-y-1">
                        {analysis.analysis.abnormalValues.map((val: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm text-slate-700 p-2 bg-white rounded">
                            <span>{val.metric}</span>
                            <span className="font-semibold text-orange-600">{val.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Clinical Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Clinical Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">{analysis.analysis.clinicalSummary}</p>
                </CardContent>
              </Card>

              {/* Extracted Metrics */}
              {Object.keys(analysis.analysis).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Extracted Health Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Object.entries(analysis.analysis)
                        .filter(([key]) => !["risks", "abnormalValues", "urgentAlerts", "clinicalSummary", "healthScore"].includes(key))
                        .map(([key, value]: [string, any]) => {
                          if (!value || typeof value === "object") return null;
                          return (
                            <div key={key} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                              <p className="text-xs text-slate-600 uppercase font-semibold">{key.replace(/_/g, " ")}</p>
                              <p className="text-lg font-bold text-slate-900">{String(value).substring(0, 20)}</p>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          {/* Medicine Tab */}
          {analysis && (
            <TabsContent value="medicine" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="w-5 h-5" />
                    Recommended Medicines
                  </CardTitle>
                  <CardDescription>Based on your health report analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  {analysis.medicines && analysis.medicines.length > 0 ? (
                    <div className="space-y-3">
                      {analysis.medicines.map((medicine: any, idx: number) => (
                        <div key={idx} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="font-semibold text-slate-900">{medicine.medicine || medicine.name}</p>
                          <p className="text-sm text-slate-600 mt-1">{medicine.uses || medicine.indication}</p>
                          <p className="text-xs text-slate-500 mt-2">Dosage: {medicine.dosage || "Consult doctor"}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-600">No medicine recommendations available for this report.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Nutrition Tab */}
          {analysis && (
            <TabsContent value="nutrition" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Apple className="w-5 h-5" />
                    Nutrition Recommendations
                  </CardTitle>
                  <CardDescription>Personalized diet plan based on your health metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.nutrition ? (
                    <>
                      {analysis.nutrition.recommendedFoods && (
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">Recommended Foods:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {(Array.isArray(analysis.nutrition.recommendedFoods)
                              ? analysis.nutrition.recommendedFoods
                              : [analysis.nutrition.recommendedFoods]
                            ).map((food: any, idx: number) => (
                              <div key={idx} className="p-2 bg-green-50 rounded border border-green-200">
                                <p className="text-sm text-slate-700">{typeof food === "string" ? food : food.name}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {analysis.nutrition.foodsToAvoid && (
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">Foods to Avoid:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {(Array.isArray(analysis.nutrition.foodsToAvoid)
                              ? analysis.nutrition.foodsToAvoid
                              : [analysis.nutrition.foodsToAvoid]
                            ).map((food: any, idx: number) => (
                              <div key={idx} className="p-2 bg-red-50 rounded border border-red-200">
                                <p className="text-sm text-slate-700">{typeof food === "string" ? food : food.name}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-slate-600">No nutrition recommendations available for this report.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Report History</CardTitle>
                <CardDescription>Your previously uploaded health reports</CardDescription>
              </CardHeader>
              <CardContent>
                {reportHistory?.reports && reportHistory.reports.length > 0 ? (
                  <div className="space-y-3">
                    {reportHistory.reports.map((report: any) => (
                      <div key={report.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="font-semibold text-slate-900">{report.fileName}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(report.uploadedAt).toLocaleDateString()} • {report.reportType.replace(/_/g, " ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              report.riskLevel === "critical"
                                ? "bg-red-100 text-red-700"
                                : report.riskLevel === "high"
                                  ? "bg-orange-100 text-orange-700"
                                  : report.riskLevel === "moderate"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                            }`}
                          >
                            {report.riskScore}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600">No reports uploaded yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Plan */}
        {analysis && actionPlan && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Recommended Actions:</h4>
                <ul className="space-y-1">
                  {actionPlan.actionPlan?.map((action: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {actionPlan.timeline && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-slate-600 font-semibold">IMMEDIATE</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{actionPlan.timeline.immediate}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-slate-600 font-semibold">SHORT TERM</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{actionPlan.timeline.shortTerm}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-slate-600 font-semibold">LONG TERM</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{actionPlan.timeline.longTerm}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
