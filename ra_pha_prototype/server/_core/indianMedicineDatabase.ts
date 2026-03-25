/**
 * Indian Medicine & Nutrition Database Integration
 * Real data for Indian medicines, Ayurveda, and nutrition
 */

import { invokeLLM } from "./llm";

// Real Indian Medicines Database
export const INDIAN_MEDICINES = {
  // Ayurvedic Medicines
  ashwagandha: {
    name: "Ashwagandha",
    type: "Ayurvedic",
    scientificName: "Withania somnifera",
    uses: ["Stress relief", "Immune boost", "Sleep improvement", "Energy"],
    dosage: "300-500mg twice daily",
    sideEffects: ["Drowsiness", "Stomach upset"],
    contraindications: ["Pregnancy", "Breastfeeding"],
    interactions: ["Sedatives", "Immunosuppressants"],
  },
  turmeric: {
    name: "Turmeric (Haldi)",
    type: "Ayurvedic",
    scientificName: "Curcuma longa",
    uses: ["Anti-inflammatory", "Digestion", "Joint health", "Skin health"],
    dosage: "500-1000mg daily",
    sideEffects: ["Stomach upset", "Nausea"],
    contraindications: ["Gallstones", "Blood clotting disorders"],
    interactions: ["Blood thinners", "Diabetes medications"],
  },
  neem: {
    name: "Neem",
    type: "Ayurvedic",
    scientificName: "Azadirachta indica",
    uses: ["Blood purification", "Skin health", "Immune support", "Antibacterial"],
    dosage: "1-2 tablets twice daily",
    sideEffects: ["Nausea", "Vomiting"],
    contraindications: ["Pregnancy", "Autoimmune diseases"],
    interactions: ["Immunosuppressants"],
  },
  triphala: {
    name: "Triphala",
    type: "Ayurvedic",
    scientificName: "Combination of Haritaki, Bibhitaki, Amalaki",
    uses: ["Digestion", "Detoxification", "Bowel health", "Antioxidant"],
    dosage: "1-2 teaspoons with warm water at night",
    sideEffects: ["Loose stools", "Abdominal cramps"],
    contraindications: ["Diarrhea", "Pregnancy"],
    interactions: ["Diabetes medications"],
  },
  brahmi: {
    name: "Brahmi",
    type: "Ayurvedic",
    scientificName: "Bacopa monnieri",
    uses: ["Memory enhancement", "Mental clarity", "Anxiety relief", "Brain health"],
    dosage: "300-600mg daily",
    sideEffects: ["Nausea", "Fatigue"],
    contraindications: ["Pregnancy"],
    interactions: ["Sedatives"],
  },

  // Allopathic Medicines (Common)
  paracetamol: {
    name: "Paracetamol (Acetaminophen)",
    type: "Allopathic",
    uses: ["Pain relief", "Fever reduction"],
    dosage: "500-1000mg every 4-6 hours",
    maxDaily: "3000-4000mg",
    sideEffects: ["Liver damage (overdose)", "Allergic reactions"],
    contraindications: ["Liver disease", "Alcohol abuse"],
    interactions: ["Warfarin", "NSAIDs"],
  },
  ibuprofen: {
    name: "Ibuprofen",
    type: "Allopathic",
    uses: ["Pain relief", "Inflammation", "Fever"],
    dosage: "200-400mg every 4-6 hours",
    maxDaily: "1200mg",
    sideEffects: ["Stomach upset", "Heartburn", "Ulcers"],
    contraindications: ["Stomach ulcers", "Kidney disease", "Heart disease"],
    interactions: ["Blood thinners", "Aspirin"],
  },
  metformin: {
    name: "Metformin",
    type: "Allopathic",
    uses: ["Type 2 diabetes", "PCOS", "Weight management"],
    dosage: "500-2000mg daily in divided doses",
    sideEffects: ["Nausea", "Diarrhea", "Metallic taste"],
    contraindications: ["Kidney disease", "Liver disease", "Heart failure"],
    interactions: ["Contrast dye", "Alcohol"],
  },
  atorvastatin: {
    name: "Atorvastatin",
    type: "Allopathic",
    uses: ["High cholesterol", "Heart disease prevention"],
    dosage: "10-80mg daily",
    sideEffects: ["Muscle pain", "Liver damage", "Memory issues"],
    contraindications: ["Pregnancy", "Liver disease", "Muscle disorders"],
    interactions: ["Grapefruit", "Certain antibiotics"],
  },
  lisinopril: {
    name: "Lisinopril",
    type: "Allopathic",
    uses: ["High blood pressure", "Heart failure"],
    dosage: "10-40mg daily",
    sideEffects: ["Dry cough", "Dizziness", "Hyperkalemia"],
    contraindications: ["Pregnancy", "Angioedema history"],
    interactions: ["NSAIDs", "Potassium supplements"],
  },
};

// Real Indian Foods & Nutrition Database
export const INDIAN_NUTRITION_DATABASE = {
  // Grains
  basmatiRice: {
    name: "Basmati Rice",
    type: "Grain",
    calories: 206,
    protein: 4.3,
    carbs: 45,
    fat: 0.3,
    fiber: 0.4,
    benefits: ["Energy", "Digestive health"],
    healthConditions: ["Diabetes (limited)", "Weight management"],
  },
  wholeWheat: {
    name: "Whole Wheat",
    type: "Grain",
    calories: 340,
    protein: 14,
    carbs: 72,
    fat: 2,
    fiber: 10.7,
    benefits: ["Fiber", "Energy", "Heart health"],
    healthConditions: ["Diabetes", "Cholesterol", "Digestion"],
  },
  millets: {
    name: "Millets (Bajra/Jowar)",
    type: "Grain",
    calories: 378,
    protein: 11,
    carbs: 73,
    fat: 4,
    fiber: 8.5,
    benefits: ["Gluten-free", "Mineral-rich", "Energy"],
    healthConditions: ["Celiac disease", "Blood sugar control"],
  },

  // Legumes
  moongDal: {
    name: "Moong Dal",
    type: "Legume",
    calories: 347,
    protein: 24,
    carbs: 63,
    fat: 1.2,
    fiber: 16,
    benefits: ["Protein", "Digestion", "Detox"],
    healthConditions: ["Vegetarian protein", "Digestion"],
  },
  masurDal: {
    name: "Masur Dal (Red Lentils)",
    type: "Legume",
    calories: 353,
    protein: 25,
    carbs: 60,
    fat: 1.1,
    fiber: 31,
    benefits: ["High protein", "Iron", "Fiber"],
    healthConditions: ["Anemia", "Vegetarian diet"],
  },
  chickpeas: {
    name: "Chickpeas (Chana)",
    type: "Legume",
    calories: 364,
    protein: 19,
    carbs: 61,
    fat: 6,
    fiber: 17,
    benefits: ["Protein", "Fiber", "Minerals"],
    healthConditions: ["Diabetes", "Heart health"],
  },

  // Vegetables
  spinach: {
    name: "Spinach (Palak)",
    type: "Vegetable",
    calories: 23,
    protein: 2.7,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    benefits: ["Iron", "Calcium", "Antioxidants"],
    healthConditions: ["Anemia", "Bone health", "Eye health"],
  },
  turmericRoot: {
    name: "Turmeric Root",
    type: "Vegetable/Spice",
    calories: 354,
    protein: 9.7,
    carbs: 67,
    fat: 3.3,
    fiber: 21,
    benefits: ["Anti-inflammatory", "Antioxidant", "Digestion"],
    healthConditions: ["Inflammation", "Joint pain", "Digestion"],
  },
  ginger: {
    name: "Ginger",
    type: "Spice",
    calories: 80,
    protein: 1.8,
    carbs: 18,
    fat: 0.8,
    fiber: 2,
    benefits: ["Digestion", "Anti-nausea", "Anti-inflammatory"],
    healthConditions: ["Nausea", "Digestion", "Inflammation"],
  },

  // Fruits
  banana: {
    name: "Banana",
    type: "Fruit",
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    benefits: ["Potassium", "Energy", "Digestion"],
    healthConditions: ["Heart health", "Blood pressure", "Energy"],
  },
  pomegranate: {
    name: "Pomegranate",
    type: "Fruit",
    calories: 83,
    protein: 1.7,
    carbs: 19,
    fat: 1.2,
    fiber: 4,
    benefits: ["Antioxidant", "Heart health", "Blood health"],
    healthConditions: ["Anemia", "Heart disease", "Cholesterol"],
  },

  // Dairy
  yogurt: {
    name: "Yogurt (Dahi)",
    type: "Dairy",
    calories: 59,
    protein: 10,
    carbs: 3.3,
    fat: 0.4,
    fiber: 0,
    benefits: ["Probiotics", "Calcium", "Protein"],
    healthConditions: ["Digestion", "Bone health", "Immunity"],
  },
  ghee: {
    name: "Ghee (Clarified Butter)",
    type: "Dairy/Fat",
    calories: 876,
    protein: 0,
    carbs: 0,
    fat: 97,
    fiber: 0,
    benefits: ["Fat-soluble vitamins", "Digestion", "Cooking"],
    healthConditions: ["Nutrient absorption"],
  },
};

/**
 * Get medicine recommendations based on health conditions
 */
export async function getMedicineRecommendations(
  conditions: string[],
  abnormalMetrics: string[]
): Promise<Array<{
  medicine: string;
  reason: string;
  dosage: string;
  type: string;
  precautions: string[];
}>> {
  try {
    const recommendationPrompt = `Based on the following health conditions and abnormal metrics, recommend appropriate Indian medicines (both Ayurvedic and Allopathic).

Health Conditions: ${conditions.join(", ")}
Abnormal Metrics: ${abnormalMetrics.join(", ")}

Available Medicines Database:
${JSON.stringify(INDIAN_MEDICINES, null, 2)}

Return a JSON array of medicine recommendations with:
[
  {
    "medicine": "Medicine name",
    "reason": "Why this medicine is recommended",
    "dosage": "Recommended dosage",
    "type": "Ayurvedic|Allopathic",
    "precautions": ["List of precautions"],
    "duration": "How long to take"
  }
]`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are an expert in Indian medicine and health recommendations. Provide safe, evidence-based medicine recommendations.",
        },
        {
          role: "user",
          content: recommendationPrompt,
        },
      ],
    });

    const content = response.choices[0].message.content;
    try {
      const recommendations = typeof content === "string" ? JSON.parse(content) : content;
      return Array.isArray(recommendations) ? recommendations : [];
    } catch (parseError) {
      console.warn("LLM did not return valid JSON for medicine recommendations");
      return [];
    }
  } catch (error) {
    console.error("Error getting medicine recommendations:", error);
    return [];
  }
}

/**
 * Get nutrition recommendations based on health conditions
 */
export async function getNutritionRecommendations(
  conditions: string[],
  healthMetrics: Record<string, any>
): Promise<{
  recommendedFoods: Array<{ name: string; reason: string; servingSize: string }>;
  foodsToAvoid: Array<{ name: string; reason: string }>;
  mealPlan: Array<{ meal: string; foods: string[]; calories: number }>;
  nutritionTips: string[];
}> {
  try {
    const nutritionPrompt = `Based on the following health conditions and metrics, create a personalized Indian nutrition plan.

Health Conditions: ${conditions.join(", ")}
Health Metrics: ${JSON.stringify(healthMetrics)}

Available Indian Foods Database:
${JSON.stringify(INDIAN_NUTRITION_DATABASE, null, 2)}

Return a JSON object with:
{
  "recommendedFoods": [
    {
      "name": "Food name",
      "reason": "Why recommended",
      "servingSize": "Recommended serving",
      "frequency": "How often to eat"
    }
  ],
  "foodsToAvoid": [
    {
      "name": "Food name",
      "reason": "Why to avoid"
    }
  ],
  "mealPlan": [
    {
      "meal": "Breakfast|Lunch|Dinner|Snack",
      "foods": ["Food 1", "Food 2"],
      "calories": 500,
      "timing": "Time to eat"
    }
  ],
  "nutritionTips": ["Tip 1", "Tip 2", "Tip 3"],
  "supplements": ["Recommended supplements if needed"]
}`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a nutritionist specializing in Indian cuisine and health. Create personalized, practical nutrition plans.",
        },
        {
          role: "user",
          content: nutritionPrompt,
        },
      ],
    });

    const content = response.choices[0].message.content;
    let plan;
    try {
      plan = typeof content === "string" ? JSON.parse(content) : content;
    } catch (parseError) {
      console.warn("LLM did not return valid JSON for nutrition recommendations");
      plan = {};
    }

    return {
      recommendedFoods: plan.recommendedFoods || [],
      foodsToAvoid: plan.foodsToAvoid || [],
      mealPlan: plan.mealPlan || [],
      nutritionTips: plan.nutritionTips || [],
    };
  } catch (error) {
    console.error("Error getting nutrition recommendations:", error);
    return {
      recommendedFoods: [],
      foodsToAvoid: [],
      mealPlan: [],
      nutritionTips: [],
    };
  }
}

/**
 * Check medicine interactions
 */
export async function checkMedicineInteractions(medicines: string[]): Promise<{
  interactions: Array<{ medicine1: string; medicine2: string; severity: string; description: string }>;
  warnings: string[];
  safe: boolean;
}> {
  try {
    const interactionPrompt = `Check for interactions between the following medicines:
${medicines.join(", ")}

Available Medicines Database:
${JSON.stringify(INDIAN_MEDICINES, null, 2)}

Return a JSON object with:
{
  "interactions": [
    {
      "medicine1": "Medicine name",
      "medicine2": "Medicine name",
      "severity": "Mild|Moderate|Severe",
      "description": "What interaction occurs"
    }
  ],
  "warnings": ["Important warnings"],
  "safe": true|false
}`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a pharmacist. Check for medicine interactions and provide safety information.",
        },
        {
          role: "user",
          content: interactionPrompt,
        },
      ],
    });

    const content = response.choices[0].message.content;
    let result;
    try {
      result = typeof content === "string" ? JSON.parse(content) : content;
    } catch (parseError) {
      console.warn("LLM did not return valid JSON for medicine interactions");
      result = {};
    }

    return {
      interactions: result.interactions || [],
      warnings: result.warnings || [],
      safe: result.safe !== false,
    };
  } catch (error) {
    console.error("Error checking medicine interactions:", error);
    return {
      interactions: [],
      warnings: ["Unable to check interactions"],
      safe: false,
    };
  }
}
