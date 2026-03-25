import { invokeLLM } from "./llm";

export interface VitalTrend {
  metric: string;
  values: number[];
  timestamps: Date[];
  trend: "increasing" | "decreasing" | "stable";
  rate: number;
}

export interface HealthPrediction {
  riskScore: number;
  predictedConditions: Array<{
    condition: string;
    probability: number;
    timeframe: string;
    severity: "low" | "medium" | "high" | "critical";
  }>;
  recommendations: string[];
  urgentAlerts: string[];
}

/**
 * Analyze vital trends to predict health risks
 */
export async function predictHealthRisks(
  vitals: Record<string, number[]>,
  userAge: number,
  userGender: string,
  medicalHistory: string[] = []
): Promise<HealthPrediction> {
  try {
    // Calculate trends for each vital
    const trends: VitalTrend[] = [];
    
    for (const [metric, values] of Object.entries(vitals)) {
      if (values.length < 2) continue;
      
      const trend = calculateTrend(values);
      trends.push({
        metric,
        values,
        timestamps: values.map((_, i) => new Date(Date.now() - (values.length - i) * 86400000)),
        trend: trend.direction,
        rate: trend.rate,
      });
    }

    // Use LLM to analyze trends and predict risks
    const analysisPrompt = `
    You are a medical AI assistant. Analyze the following vital trends and predict potential health risks:
    
    User Profile:
    - Age: ${userAge}
    - Gender: ${userGender}
    - Medical History: ${medicalHistory.join(", ") || "None reported"}
    
    Vital Trends:
    ${trends.map(t => `
    - ${t.metric}: Values [${t.values.join(", ")}], Trend: ${t.trend}, Rate of change: ${t.rate.toFixed(2)}%
    `).join("\n")}
    
    Please provide:
    1. Overall health risk score (0-100)
    2. Predicted conditions with probability and timeframe
    3. Urgent alerts if any
    4. Recommendations for prevention
    
    Format your response as JSON with keys: riskScore, predictedConditions, urgentAlerts, recommendations
    `;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a medical AI assistant that analyzes health data and predicts risks. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
    });

    // Parse LLM response
    const messageContent = response.choices[0]?.message?.content;
    const content = typeof messageContent === "string" ? messageContent : "{}";
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : "{}";
    const analysis = JSON.parse(jsonStr);

    return {
      riskScore: analysis.riskScore || 0,
      predictedConditions: analysis.predictedConditions || [],
      recommendations: analysis.recommendations || [],
      urgentAlerts: analysis.urgentAlerts || [],
    };
  } catch (error) {
    console.error("Error predicting health risks:", error);
    return {
      riskScore: 0,
      predictedConditions: [],
      recommendations: [],
      urgentAlerts: [],
    };
  }
}

/**
 * Calculate trend direction and rate of change
 */
function calculateTrend(values: number[]): { direction: "increasing" | "decreasing" | "stable"; rate: number } {
  if (values.length < 2) {
    return { direction: "stable", rate: 0 };
  }

  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));

  const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  const change = avgSecond - avgFirst;
  const rate = (change / avgFirst) * 100;

  let direction: "increasing" | "decreasing" | "stable" = "stable";
  if (rate > 5) direction = "increasing";
  else if (rate < -5) direction = "decreasing";

  return { direction, rate };
}

/**
 * Get real-time health score based on current vitals
 */
export function calculateHealthScore(vitals: Record<string, number>): number {
  let score = 100;

  // Heart rate (60-100 bpm is normal)
  if (vitals.heartRate) {
    const hr = vitals.heartRate;
    if (hr < 40 || hr > 120) score -= 30;
    else if (hr < 50 || hr > 100) score -= 15;
  }

  // Blood pressure (120/80 is ideal)
  if (vitals.systolic && vitals.diastolic) {
    const sys = vitals.systolic;
    const dia = vitals.diastolic;
    if (sys > 180 || dia > 120) score -= 30;
    else if (sys > 140 || dia > 90) score -= 20;
    else if (sys < 90 || dia < 60) score -= 15;
  }

  // Blood glucose (70-100 fasting is normal)
  if (vitals.glucose) {
    const glucose = vitals.glucose;
    if (glucose > 200) score -= 30;
    else if (glucose > 126) score -= 20;
    else if (glucose < 70) score -= 15;
  }

  // Oxygen saturation (95-100% is normal)
  if (vitals.oxygenSaturation) {
    const o2 = vitals.oxygenSaturation;
    if (o2 < 90) score -= 30;
    else if (o2 < 95) score -= 15;
  }

  // BMI (18.5-24.9 is normal)
  if (vitals.bmi) {
    const bmi = vitals.bmi;
    if (bmi < 18.5 || bmi > 30) score -= 10;
    else if (bmi > 25) score -= 5;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Generate real-time health alerts based on vitals
 */
export function generateHealthAlerts(vitals: Record<string, number>): string[] {
  const alerts: string[] = [];

  if (vitals.heartRate) {
    if (vitals.heartRate > 120) alerts.push("⚠️ High heart rate detected. Consider resting and consulting a doctor.");
    if (vitals.heartRate < 40) alerts.push("⚠️ Low heart rate detected. Seek immediate medical attention.");
  }

  if (vitals.systolic && vitals.diastolic) {
    if (vitals.systolic > 180 || vitals.diastolic > 120) {
      alerts.push("🚨 CRITICAL: Hypertensive crisis detected. Seek emergency medical care immediately.");
    } else if (vitals.systolic > 140 || vitals.diastolic > 90) {
      alerts.push("⚠️ High blood pressure detected. Monitor closely and consult your doctor.");
    }
  }

  if (vitals.glucose) {
    if (vitals.glucose > 300) alerts.push("🚨 CRITICAL: Severe hyperglycemia detected. Seek immediate medical attention.");
    if (vitals.glucose < 70) alerts.push("⚠️ Low blood sugar detected. Consume glucose immediately.");
  }

  if (vitals.oxygenSaturation && vitals.oxygenSaturation < 90) {
    alerts.push("🚨 CRITICAL: Low oxygen saturation. Seek immediate medical attention.");
  }

  return alerts;
}

/**
 * Get personalized health recommendations based on predictions
 */
export async function getPersonalizedRecommendations(
  prediction: HealthPrediction,
  userAge: number,
  userGender: string
): Promise<string[]> {
  try {
    const prompt = `
    Based on the following health prediction, provide 5-7 specific, actionable recommendations:
    
    Risk Score: ${prediction.riskScore}
    Predicted Conditions: ${prediction.predictedConditions.map(c => `${c.condition} (${c.probability}% probability)`).join(", ")}
    
    Provide recommendations for:
    1. Lifestyle changes
    2. Dietary adjustments
    3. Exercise recommendations
    4. When to seek medical help
    5. Preventive measures
    
    Format as a simple list of recommendations.
    `;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a health advisor providing personalized recommendations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const messageContent = response.choices[0]?.message?.content;
    const content = typeof messageContent === "string" ? messageContent : "";
    const recommendations = content.split("\n").filter((r: string) => r.trim().length > 0);

    return recommendations.slice(0, 7);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return [
      "Monitor your vitals regularly",
      "Maintain a healthy diet",
      "Exercise regularly",
      "Get adequate sleep",
      "Manage stress",
      "Consult your doctor for regular checkups",
    ];
  }
}
