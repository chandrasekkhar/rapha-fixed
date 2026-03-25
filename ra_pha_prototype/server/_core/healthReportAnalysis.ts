/**
 * Health Report Analysis Module
 * Analyzes health documents, extracts metrics, predicts risks, and recommends medicine & nutrition
 */

import { invokeLLM } from "./llm";

export interface HealthReport {
  id: string;
  userId: number;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  reportType: "blood_work" | "imaging" | "pathology" | "general_checkup" | "other";
  rawText?: string;
}

export interface ExtractedMetrics {
  hemoglobin?: number;
  whiteBloodCells?: number;
  platelets?: number;
  glucose?: number;
  cholesterol?: number;
  triglycerides?: number;
  ldl?: number;
  hdl?: number;
  creatinine?: number;
  bilirubin?: number;
  albumin?: number;
  ast?: number;
  alt?: number;
  bloodPressure?: string;
  heartRate?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  findings?: string[];
}

export interface HealthRiskPrediction {
  overallRisk: "low" | "moderate" | "high" | "critical";
  riskScore: number;
  identifiedConditions: string[];
  urgentAlerts: string[];
  recommendations: string[];
}

export interface MedicineRecommendation {
  medicineName: string;
  genericName: string;
  dosage: string;
  frequency: string;
  duration: string;
  purpose: string;
  sideEffects: string[];
  contraindications: string[];
  notes: string;
}

export interface NutritionRecommendation {
  category: string;
  recommendations: string[];
  foodsToInclude: string[];
  foodsToAvoid: string[];
  mealPlanSuggestion: string;
  calorieTarget?: number;
  macroNutrients?: {
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface HealthReportAnalysis {
  reportId: string;
  extractedMetrics: ExtractedMetrics;
  riskPrediction: HealthRiskPrediction;
  medicineRecommendations: MedicineRecommendation[];
  nutritionRecommendations: NutritionRecommendation[];
  actionPlan: string[];
  followUpTests: string[];
  doctorNotes: string;
}

/**
 * Analyze health report document using LLM
 */
export async function analyzeHealthReport(
  reportText: string,
  reportType: string,
  userAge: number,
  userGender: string
): Promise<HealthReportAnalysis> {
  try {
    const analysisPrompt = `You are a medical AI assistant. Analyze the following health report and provide comprehensive analysis.

Health Report Type: ${reportType}
Patient Age: ${userAge}
Patient Gender: ${userGender}

Report Content:
${reportText}

Please provide a detailed analysis in JSON format with the following structure:
{
  "extractedMetrics": {
    "hemoglobin": number or null,
    "whiteBloodCells": number or null,
    "platelets": number or null,
    "glucose": number or null,
    "cholesterol": number or null,
    "triglycerides": number or null,
    "ldl": number or null,
    "hdl": number or null,
    "creatinine": number or null,
    "bilirubin": number or null,
    "albumin": number or null,
    "ast": number or null,
    "alt": number or null,
    "bloodPressure": "string or null",
    "heartRate": number or null,
    "weight": number or null,
    "height": number or null,
    "bmi": number or null,
    "findings": ["array of key findings"]
  },
  "riskPrediction": {
    "overallRisk": "low|moderate|high|critical",
    "riskScore": 0-100,
    "identifiedConditions": ["array of potential conditions"],
    "urgentAlerts": ["array of urgent health alerts"],
    "recommendations": ["array of immediate recommendations"]
  },
  "medicineRecommendations": [
    {
      "medicineName": "string",
      "genericName": "string",
      "dosage": "string",
      "frequency": "string",
      "duration": "string",
      "purpose": "string",
      "sideEffects": ["array"],
      "contraindications": ["array"],
      "notes": "string"
    }
  ],
  "nutritionRecommendations": [
    {
      "category": "string",
      "recommendations": ["array"],
      "foodsToInclude": ["array"],
      "foodsToAvoid": ["array"],
      "mealPlanSuggestion": "string",
      "calorieTarget": number or null,
      "macroNutrients": {
        "protein": "string",
        "carbs": "string",
        "fat": "string"
      }
    }
  ],
  "actionPlan": ["array of action items"],
  "followUpTests": ["array of recommended follow-up tests"],
  "doctorNotes": "string with detailed clinical notes"
}

Ensure all recommendations are evidence-based and appropriate for the patient's age and gender.`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are an expert medical AI assistant specialized in analyzing health reports and providing personalized medicine and nutrition recommendations. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
    });

    const content = response.choices[0].message.content;
    const analysisData = typeof content === "string" ? JSON.parse(content) : content;

    return {
      reportId: `report_${Date.now()}`,
      extractedMetrics: analysisData.extractedMetrics || {},
      riskPrediction: analysisData.riskPrediction || {
        overallRisk: "moderate",
        riskScore: 50,
        identifiedConditions: [],
        urgentAlerts: [],
        recommendations: [],
      },
      medicineRecommendations: analysisData.medicineRecommendations || [],
      nutritionRecommendations: analysisData.nutritionRecommendations || [],
      actionPlan: analysisData.actionPlan || [],
      followUpTests: analysisData.followUpTests || [],
      doctorNotes: analysisData.doctorNotes || "",
    };
  } catch (error) {
    console.error("Error analyzing health report:", error);
    throw new Error("Failed to analyze health report");
  }
}

/**
 * Extract text from PDF document (mock - would use actual PDF parser)
 */
export async function extractTextFromDocument(fileUrl: string): Promise<string> {
  try {
    // In production, use pdf2image or similar to extract text
    // For now, return mock data
    return `Health Report Analysis
Date: ${new Date().toISOString()}
Patient: Sample Patient

Blood Work Results:
- Hemoglobin: 13.5 g/dL (Normal: 12-16)
- White Blood Cells: 7.2 K/uL (Normal: 4.5-11)
- Platelets: 250 K/uL (Normal: 150-400)
- Glucose (Fasting): 105 mg/dL (Normal: 70-100)
- Total Cholesterol: 210 mg/dL (Normal: <200)
- LDL: 135 mg/dL (Normal: <100)
- HDL: 45 mg/dL (Normal: >40)
- Triglycerides: 150 mg/dL (Normal: <150)
- Creatinine: 0.9 mg/dL (Normal: 0.7-1.3)
- Bilirubin: 0.8 mg/dL (Normal: 0.1-1.2)
- AST: 28 U/L (Normal: 10-40)
- ALT: 32 U/L (Normal: 7-56)

Vital Signs:
- Blood Pressure: 130/85 mmHg
- Heart Rate: 75 bpm
- Weight: 75 kg
- Height: 175 cm
- BMI: 24.5

Clinical Findings:
- Slightly elevated fasting glucose
- Borderline high cholesterol
- Normal liver and kidney function
- Blood pressure in pre-hypertension range`;
  } catch (error) {
    console.error("Error extracting text from document:", error);
    throw new Error("Failed to extract text from document");
  }
}

/**
 * Generate personalized medicine recommendations
 */
export async function generateMedicineRecommendations(
  analysis: HealthReportAnalysis,
  userAge: number,
  userGender: string,
  existingConditions: string[]
): Promise<MedicineRecommendation[]> {
  try {
    const prompt = `Based on the following health analysis, provide personalized medicine recommendations:

Patient Profile:
- Age: ${userAge}
- Gender: ${userGender}
- Existing Conditions: ${existingConditions.join(", ") || "None"}

Health Analysis:
- Identified Conditions: ${analysis.riskPrediction.identifiedConditions.join(", ")}
- Risk Level: ${analysis.riskPrediction.overallRisk}
- Key Metrics: ${JSON.stringify(analysis.extractedMetrics)}

Provide recommendations as a JSON array of medicine objects with the following structure:
[
  {
    "medicineName": "Brand name",
    "genericName": "Generic name",
    "dosage": "Dosage strength",
    "frequency": "How often to take",
    "duration": "How long to take",
    "purpose": "Why this medicine",
    "sideEffects": ["List of common side effects"],
    "contraindications": ["Conditions where not to use"],
    "notes": "Additional important notes"
  }
]

Ensure recommendations are:
1. Evidence-based and clinically appropriate
2. Safe for the patient's age and gender
3. Consider existing conditions
4. Include dosage and frequency
5. Mention potential side effects`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are an expert pharmacist providing personalized medicine recommendations. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0].message.content;
    const recommendations = typeof content === "string" ? JSON.parse(content) : content;
    return Array.isArray(recommendations) ? recommendations : [];
  } catch (error) {
    console.error("Error generating medicine recommendations:", error);
    return [];
  }
}

/**
 * Generate personalized nutrition recommendations
 */
export async function generateNutritionRecommendations(
  analysis: HealthReportAnalysis,
  userAge: number,
  userGender: string,
  dietaryRestrictions: string[]
): Promise<NutritionRecommendation[]> {
  try {
    const prompt = `Based on the following health analysis, provide personalized nutrition recommendations:

Patient Profile:
- Age: ${userAge}
- Gender: ${userGender}
- Dietary Restrictions: ${dietaryRestrictions.join(", ") || "None"}
- BMI: ${analysis.extractedMetrics.bmi || "Unknown"}

Health Analysis:
- Identified Conditions: ${analysis.riskPrediction.identifiedConditions.join(", ")}
- Risk Level: ${analysis.riskPrediction.overallRisk}
- Key Metrics: ${JSON.stringify(analysis.extractedMetrics)}

Provide recommendations as a JSON array with the following structure:
[
  {
    "category": "Category name (e.g., Diabetes Management, Heart Health)",
    "recommendations": ["Array of specific nutrition recommendations"],
    "foodsToInclude": ["Array of foods to include"],
    "foodsToAvoid": ["Array of foods to avoid"],
    "mealPlanSuggestion": "Sample meal plan or eating pattern",
    "calorieTarget": 2000,
    "macroNutrients": {
      "protein": "25-30%",
      "carbs": "45-50%",
      "fat": "20-25%"
    }
  }
]

Ensure recommendations are:
1. Tailored to identified health conditions
2. Culturally appropriate and practical
3. Include specific foods and meal ideas
4. Consider dietary restrictions
5. Provide macro-nutrient guidance`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are an expert nutritionist providing personalized diet recommendations. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0].message.content;
    const recommendations = typeof content === "string" ? JSON.parse(content) : content;
    return Array.isArray(recommendations) ? recommendations : [];
  } catch (error) {
    console.error("Error generating nutrition recommendations:", error);
    return [];
  }
}

/**
 * Compare multiple health reports for trend analysis
 */
export async function compareHealthReports(
  reports: HealthReportAnalysis[]
): Promise<{
  trends: string[];
  improvements: string[];
  concerns: string[];
  overallTrajectory: "improving" | "stable" | "declining";
}> {
  try {
    if (reports.length < 2) {
      return {
        trends: [],
        improvements: [],
        concerns: [],
        overallTrajectory: "stable",
      };
    }

    const comparisonPrompt = `Analyze the following health report trends and provide insights:

${reports
  .map(
    (report, idx) => `
Report ${idx + 1}:
- Risk Level: ${report.riskPrediction.overallRisk}
- Risk Score: ${report.riskPrediction.riskScore}
- Conditions: ${report.riskPrediction.identifiedConditions.join(", ")}
- Metrics: ${JSON.stringify(report.extractedMetrics)}
`
  )
  .join("\n")}

Provide analysis as JSON with:
{
  "trends": ["Array of observed trends"],
  "improvements": ["Areas that have improved"],
  "concerns": ["Areas of concern"],
  "overallTrajectory": "improving|stable|declining"
}`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a medical analyst comparing health report trends. Respond with valid JSON.",
        },
        {
          role: "user",
          content: comparisonPrompt,
        },
      ],
    });

    const content = response.choices[0].message.content;
    const analysis = typeof content === "string" ? JSON.parse(content) : content;
    return analysis;
  } catch (error) {
    console.error("Error comparing health reports:", error);
    return {
      trends: [],
      improvements: [],
      concerns: [],
      overallTrajectory: "stable",
    };
  }
}
