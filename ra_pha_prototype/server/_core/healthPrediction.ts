/**
 * AI Health Prediction Module
 * Implements machine learning models for early disease detection and prevention
 */

import { invokeLLM } from "./llm";

export interface HealthMetrics {
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
}

export interface RiskAssessment {
  overallHealthScore: number;
  diabetesRisk: number;
  heartDiseaseRisk: number;
  hypertensionRisk: number;
  strokeRisk: number;
  cancerRisk: number;
  obesityRisk: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  primaryRisks: string[];
  recommendations: string[];
  urgentAlerts: string[];
}

export interface PreventionPlan {
  title: string;
  description: string;
  duration: string;
  activities: string[];
  dietaryChanges: string[];
  exerciseRecommendations: string[];
  medicalCheckups: string[];
  lifestyle: string[];
  expectedOutcome: string;
}

/**
 * Calculate Diabetes Risk Score
 * Based on: Age, BMI, Blood Pressure, Glucose, Family History, Exercise
 */
export function calculateDiabetesRisk(metrics: HealthMetrics): number {
  let score = 0;

  // Age factor (0-20 points)
  if (metrics.age > 45) score += 15;
  else if (metrics.age > 35) score += 10;
  else score += 5;

  // BMI factor (0-25 points)
  if (metrics.bmi > 30) score += 25;
  else if (metrics.bmi > 25) score += 15;
  else if (metrics.bmi > 23) score += 10;

  // Blood Pressure factor (0-15 points)
  if (metrics.bloodPressureSystolic > 140 || metrics.bloodPressureDiastolic > 90) score += 15;
  else if (metrics.bloodPressureSystolic > 130 || metrics.bloodPressureDiastolic > 85) score += 10;

  // Glucose level (0-20 points)
  if (metrics.glucose > 200) score += 20;
  else if (metrics.glucose > 140) score += 15;
  else if (metrics.glucose > 100) score += 10;

  // Family history (0-15 points)
  if (metrics.familyHistoryDiabetes) score += 15;

  // Exercise factor (0-10 points, negative)
  if (metrics.exerciseMinutesPerWeek < 150) score += 10;
  else if (metrics.exerciseMinutesPerWeek < 300) score += 5;

  return Math.min(score, 100);
}

/**
 * Calculate Heart Disease Risk Score
 * Based on: Age, Blood Pressure, Cholesterol, Smoking, Family History, Exercise
 */
export function calculateHeartDiseaseRisk(metrics: HealthMetrics): number {
  let score = 0;

  // Age factor (0-20 points)
  if (metrics.age > 55) score += 20;
  else if (metrics.age > 45) score += 15;
  else if (metrics.age > 35) score += 10;

  // Blood Pressure factor (0-20 points)
  if (metrics.bloodPressureSystolic > 160 || metrics.bloodPressureDiastolic > 100) score += 20;
  else if (metrics.bloodPressureSystolic > 140 || metrics.bloodPressureDiastolic > 90) score += 15;
  else if (metrics.bloodPressureSystolic > 130 || metrics.bloodPressureDiastolic > 85) score += 10;

  // Cholesterol factor (0-20 points)
  if (metrics.cholesterol > 240) score += 20;
  else if (metrics.cholesterol > 200) score += 15;
  else if (metrics.cholesterol > 180) score += 10;

  // Smoking status (0-25 points)
  if (metrics.smokingStatus === "current") score += 25;
  else if (metrics.smokingStatus === "former") score += 10;

  // Family history (0-15 points)
  if (metrics.familyHistoryHeartDisease) score += 15;

  // Exercise factor (0-10 points, negative)
  if (metrics.exerciseMinutesPerWeek < 150) score += 10;

  return Math.min(score, 100);
}

/**
 * Calculate Hypertension Risk Score
 * Based on: Age, Blood Pressure, BMI, Sodium Intake, Stress, Family History
 */
export function calculateHypertensionRisk(metrics: HealthMetrics): number {
  let score = 0;

  // Age factor (0-15 points)
  if (metrics.age > 60) score += 15;
  else if (metrics.age > 50) score += 10;
  else if (metrics.age > 40) score += 5;

  // Current Blood Pressure (0-30 points)
  if (metrics.bloodPressureSystolic > 160 || metrics.bloodPressureDiastolic > 100) score += 30;
  else if (metrics.bloodPressureSystolic > 140 || metrics.bloodPressureDiastolic > 90) score += 20;
  else if (metrics.bloodPressureSystolic > 130 || metrics.bloodPressureDiastolic > 85) score += 10;

  // BMI factor (0-15 points)
  if (metrics.bmi > 30) score += 15;
  else if (metrics.bmi > 25) score += 10;

  // Stress level (0-15 points)
  if (metrics.stressLevel > 8) score += 15;
  else if (metrics.stressLevel > 6) score += 10;

  // Family history (0-15 points)
  if (metrics.familyHistoryHypertension) score += 15;

  // Alcohol consumption (0-10 points)
  if (metrics.alcoholConsumption > 3) score += 10;

  return Math.min(score, 100);
}

/**
 * Calculate Stroke Risk Score
 * Based on: Age, Blood Pressure, Cholesterol, Smoking, Diabetes, Atrial Fibrillation
 */
export function calculateStrokeRisk(metrics: HealthMetrics): number {
  let score = 0;

  // Age factor (0-15 points)
  if (metrics.age > 65) score += 15;
  else if (metrics.age > 55) score += 10;
  else if (metrics.age > 45) score += 5;

  // Blood Pressure (0-20 points)
  if (metrics.bloodPressureSystolic > 160 || metrics.bloodPressureDiastolic > 100) score += 20;
  else if (metrics.bloodPressureSystolic > 140 || metrics.bloodPressureDiastolic > 90) score += 15;

  // Cholesterol (0-15 points)
  if (metrics.cholesterol > 240) score += 15;
  else if (metrics.cholesterol > 200) score += 10;

  // Smoking (0-15 points)
  if (metrics.smokingStatus === "current") score += 15;
  else if (metrics.smokingStatus === "former") score += 5;

  // Diabetes (0-15 points)
  if (calculateDiabetesRisk(metrics) > 50) score += 15;

  return Math.min(score, 100);
}

/**
 * Calculate Obesity Risk Score
 * Based on: BMI, Waist Circumference, Physical Activity, Diet Quality
 */
export function calculateObesityRisk(metrics: HealthMetrics): number {
  let score = 0;

  // BMI factor (0-40 points)
  if (metrics.bmi > 35) score += 40;
  else if (metrics.bmi > 30) score += 30;
  else if (metrics.bmi > 25) score += 15;
  else if (metrics.bmi > 23) score += 5;

  // Physical activity (0-30 points)
  if (metrics.exerciseMinutesPerWeek < 150) score += 30;
  else if (metrics.exerciseMinutesPerWeek < 300) score += 15;

  // Age factor (0-10 points)
  if (metrics.age > 50) score += 10;

  // Stress and sleep (0-20 points)
  if (metrics.sleepHours < 6 || metrics.stressLevel > 7) score += 20;
  else if (metrics.sleepHours < 7 || metrics.stressLevel > 5) score += 10;

  return Math.min(score, 100);
}

/**
 * Generate Comprehensive Risk Assessment
 */
export function generateRiskAssessment(metrics: HealthMetrics): RiskAssessment {
  const diabetesRisk = calculateDiabetesRisk(metrics);
  const heartDiseaseRisk = calculateHeartDiseaseRisk(metrics);
  const hypertensionRisk = calculateHypertensionRisk(metrics);
  const strokeRisk = calculateStrokeRisk(metrics);
  const obesityRisk = calculateObesityRisk(metrics);

  // Calculate overall health score (inverse of average risk)
  const averageRisk = (diabetesRisk + heartDiseaseRisk + hypertensionRisk + strokeRisk + obesityRisk) / 5;
  const overallHealthScore = 100 - averageRisk;

  // Determine risk level
  let riskLevel: "low" | "moderate" | "high" | "critical" = "low";
  if (averageRisk > 70) riskLevel = "critical";
  else if (averageRisk > 50) riskLevel = "high";
  else if (averageRisk > 30) riskLevel = "moderate";

  // Identify primary risks
  const primaryRisks: string[] = [];
  if (diabetesRisk > 60) primaryRisks.push("Diabetes");
  if (heartDiseaseRisk > 60) primaryRisks.push("Heart Disease");
  if (hypertensionRisk > 60) primaryRisks.push("Hypertension");
  if (strokeRisk > 60) primaryRisks.push("Stroke");
  if (obesityRisk > 60) primaryRisks.push("Obesity");

  // Generate recommendations
  const recommendations = generateRecommendations(metrics, {
    diabetesRisk,
    heartDiseaseRisk,
    hypertensionRisk,
    strokeRisk,
    obesityRisk,
  });

  // Generate urgent alerts
  const urgentAlerts: string[] = [];
  if (metrics.bloodPressureSystolic > 180 || metrics.bloodPressureDiastolic > 120) {
    urgentAlerts.push("Critical blood pressure - Seek immediate medical attention");
  }
  if (metrics.glucose > 300) {
    urgentAlerts.push("Dangerously high glucose levels - Consult doctor immediately");
  }
  if (metrics.oxygenLevel < 90) {
    urgentAlerts.push("Low oxygen saturation - Seek medical help");
  }
  if (heartDiseaseRisk > 80 && metrics.age > 50) {
    urgentAlerts.push("High heart disease risk - Schedule cardiac evaluation");
  }

  return {
    overallHealthScore: Math.round(overallHealthScore),
    diabetesRisk: Math.round(diabetesRisk),
    heartDiseaseRisk: Math.round(heartDiseaseRisk),
    hypertensionRisk: Math.round(hypertensionRisk),
    strokeRisk: Math.round(strokeRisk),
    cancerRisk: 0, // Placeholder
    obesityRisk: Math.round(obesityRisk),
    riskLevel,
    primaryRisks,
    recommendations,
    urgentAlerts,
  };
}

/**
 * Generate Personalized Recommendations
 */
function generateRecommendations(
  metrics: HealthMetrics,
  risks: {
    diabetesRisk: number;
    heartDiseaseRisk: number;
    hypertensionRisk: number;
    strokeRisk: number;
    obesityRisk: number;
  }
): string[] {
  const recommendations: string[] = [];

  // Diabetes prevention
  if (risks.diabetesRisk > 40) {
    recommendations.push("Reduce refined carbohydrates and sugar intake");
    recommendations.push("Increase physical activity to 150+ minutes per week");
    recommendations.push("Maintain healthy BMI (18.5-24.9)");
    recommendations.push("Get fasting glucose checked annually");
  }

  // Heart disease prevention
  if (risks.heartDiseaseRisk > 40) {
    recommendations.push("Reduce sodium intake to less than 2,300mg daily");
    recommendations.push("Increase omega-3 fatty acids (fish, nuts)");
    recommendations.push("Get cholesterol levels checked");
    if (metrics.smokingStatus === "current") {
      recommendations.push("Quit smoking - consult smoking cessation programs");
    }
  }

  // Hypertension management
  if (risks.hypertensionRisk > 40) {
    recommendations.push("Monitor blood pressure daily");
    recommendations.push("Reduce sodium intake");
    recommendations.push("Practice stress management (meditation, yoga)");
    recommendations.push("Limit alcohol consumption");
  }

  // Stroke prevention
  if (risks.strokeRisk > 40) {
    recommendations.push("Control blood pressure and cholesterol");
    recommendations.push("Maintain healthy weight");
    recommendations.push("Regular cardiovascular exercise");
  }

  // Weight management
  if (risks.obesityRisk > 40) {
    recommendations.push("Create calorie deficit of 500-750 calories daily");
    recommendations.push("Increase vegetable and fiber intake");
    recommendations.push("Limit processed foods and sugary drinks");
    recommendations.push("Aim for 7-9 hours of quality sleep");
  }

  // General recommendations
  if (metrics.stressLevel > 7) {
    recommendations.push("Practice stress reduction techniques daily");
    recommendations.push("Consider mindfulness or meditation apps");
  }

  if (metrics.sleepHours < 7) {
    recommendations.push("Establish consistent sleep schedule (7-9 hours)");
    recommendations.push("Avoid screens 1 hour before bedtime");
  }

  return recommendations;
}

/**
 * Generate AI-Powered Prevention Plan using LLM
 */
export async function generatePreventionPlan(
  metrics: HealthMetrics,
  assessment: RiskAssessment
): Promise<PreventionPlan> {
  try {
    const prompt = `Based on these health metrics and risk assessment, create a personalized prevention plan:

Health Profile:
- Age: ${metrics.age}, Gender: ${metrics.gender}
- BMI: ${metrics.bmi}, Blood Pressure: ${metrics.bloodPressureSystolic}/${metrics.bloodPressureDiastolic}
- Glucose: ${metrics.glucose}, Cholesterol: ${metrics.cholesterol}
- Exercise: ${metrics.exerciseMinutesPerWeek} min/week, Sleep: ${metrics.sleepHours} hours
- Smoking: ${metrics.smokingStatus}, Stress Level: ${metrics.stressLevel}/10

Risk Assessment:
- Diabetes Risk: ${assessment.diabetesRisk}%
- Heart Disease Risk: ${assessment.heartDiseaseRisk}%
- Hypertension Risk: ${assessment.hypertensionRisk}%
- Overall Health Score: ${assessment.overallHealthScore}

Primary Risks: ${assessment.primaryRisks.join(", ")}

Create a comprehensive 90-day prevention plan with:
1. Daily activities and exercises
2. Dietary changes
3. Medical checkups needed
4. Lifestyle modifications
5. Expected health improvements

Format as JSON with keys: title, description, duration, activities, dietaryChanges, exerciseRecommendations, medicalCheckups, lifestyle, expectedOutcome`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are a health prevention specialist. Create detailed, actionable prevention plans. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0].message.content;
    const planData = typeof content === "string" ? JSON.parse(content) : content;

    return {
      title: planData.title || "Personalized Health Prevention Plan",
      description: planData.description || "",
      duration: planData.duration || "90 days",
      activities: Array.isArray(planData.activities) ? planData.activities : [],
      dietaryChanges: Array.isArray(planData.dietaryChanges) ? planData.dietaryChanges : [],
      exerciseRecommendations: Array.isArray(planData.exerciseRecommendations)
        ? planData.exerciseRecommendations
        : [],
      medicalCheckups: Array.isArray(planData.medicalCheckups) ? planData.medicalCheckups : [],
      lifestyle: Array.isArray(planData.lifestyle) ? planData.lifestyle : [],
      expectedOutcome: planData.expectedOutcome || "",
    };
  } catch (error) {
    console.error("Error generating prevention plan:", error);
    return {
      title: "Health Prevention Plan",
      description: "Follow the recommendations to improve your health",
      duration: "90 days",
      activities: assessment.recommendations,
      dietaryChanges: ["Reduce processed foods", "Increase fruits and vegetables"],
      exerciseRecommendations: ["150 minutes moderate cardio weekly", "Strength training 2-3x weekly"],
      medicalCheckups: ["Annual physical", "Blood work", "Blood pressure monitoring"],
      lifestyle: ["Manage stress", "Improve sleep quality", "Limit alcohol"],
      expectedOutcome: "Improved overall health and reduced disease risk",
    };
  }
}
