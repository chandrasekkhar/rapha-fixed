import { describe, it, expect } from "vitest";
import {
  calculateDiabetesRisk,
  calculateHeartDiseaseRisk,
  calculateHypertensionRisk,
  calculateStrokeRisk,
  calculateObesityRisk,
  generateRiskAssessment,
  type HealthMetrics,
} from "../healthPrediction";

const healthyMetrics: HealthMetrics = {
  age: 30,
  gender: "male",
  heartRate: 70,
  bloodPressureSystolic: 120,
  bloodPressureDiastolic: 80,
  oxygenLevel: 98,
  bmi: 22,
  cholesterol: 180,
  glucose: 95,
  sleepHours: 8,
  stressLevel: 3,
  exerciseMinutesPerWeek: 300,
  alcoholConsumption: 1,
  smokingStatus: "never",
  familyHistoryDiabetes: false,
  familyHistoryHeartDisease: false,
  familyHistoryHypertension: false,
  familyHistoryCancer: false,
};

const unhealthyMetrics: HealthMetrics = {
  age: 60,
  gender: "male",
  heartRate: 95,
  bloodPressureSystolic: 160,
  bloodPressureDiastolic: 100,
  oxygenLevel: 94,
  bmi: 32,
  cholesterol: 250,
  glucose: 180,
  sleepHours: 5,
  stressLevel: 9,
  exerciseMinutesPerWeek: 30,
  alcoholConsumption: 4,
  smokingStatus: "current",
  familyHistoryDiabetes: true,
  familyHistoryHeartDisease: true,
  familyHistoryHypertension: true,
  familyHistoryCancer: true,
};

describe("Health Prediction Algorithms", () => {
  describe("calculateDiabetesRisk", () => {
    it("should return low risk for healthy metrics", () => {
      const risk = calculateDiabetesRisk(healthyMetrics);
      expect(risk).toBeLessThan(30);
    });

    it("should return high risk for unhealthy metrics", () => {
      const risk = calculateDiabetesRisk(unhealthyMetrics);
      expect(risk).toBeGreaterThan(50);
    });

    it("should increase risk with age", () => {
      const young = { ...healthyMetrics, age: 25 };
      const old = { ...healthyMetrics, age: 65 };
      expect(calculateDiabetesRisk(old)).toBeGreaterThan(calculateDiabetesRisk(young));
    });

    it("should increase risk with high BMI", () => {
      const normal = { ...healthyMetrics, bmi: 22 };
      const obese = { ...healthyMetrics, bmi: 32 };
      expect(calculateDiabetesRisk(obese)).toBeGreaterThan(calculateDiabetesRisk(normal));
    });

    it("should increase risk with high glucose", () => {
      const normal = { ...healthyMetrics, glucose: 95 };
      const high = { ...healthyMetrics, glucose: 180 };
      expect(calculateDiabetesRisk(high)).toBeGreaterThan(calculateDiabetesRisk(normal));
    });

    it("should increase risk with family history", () => {
      const noHistory = { ...healthyMetrics, familyHistoryDiabetes: false };
      const withHistory = { ...healthyMetrics, familyHistoryDiabetes: true };
      expect(calculateDiabetesRisk(withHistory)).toBeGreaterThan(calculateDiabetesRisk(noHistory));
    });

    it("should cap risk at 100", () => {
      const risk = calculateDiabetesRisk(unhealthyMetrics);
      expect(risk).toBeLessThanOrEqual(100);
    });
  });

  describe("calculateHeartDiseaseRisk", () => {
    it("should return low risk for healthy metrics", () => {
      const risk = calculateHeartDiseaseRisk(healthyMetrics);
      expect(risk).toBeLessThan(30);
    });

    it("should return high risk for unhealthy metrics", () => {
      const risk = calculateHeartDiseaseRisk(unhealthyMetrics);
      expect(risk).toBeGreaterThan(50);
    });

    it("should increase risk with high blood pressure", () => {
      const normal = { ...healthyMetrics, bloodPressureSystolic: 120 };
      const high = { ...healthyMetrics, bloodPressureSystolic: 160 };
      expect(calculateHeartDiseaseRisk(high)).toBeGreaterThan(calculateHeartDiseaseRisk(normal));
    });

    it("should increase risk with smoking", () => {
      const noSmoke = { ...healthyMetrics, smokingStatus: "never" as const };
      const smoke = { ...healthyMetrics, smokingStatus: "current" as const };
      expect(calculateHeartDiseaseRisk(smoke)).toBeGreaterThan(calculateHeartDiseaseRisk(noSmoke));
    });

    it("should increase risk with high cholesterol", () => {
      const normal = { ...healthyMetrics, cholesterol: 180 };
      const high = { ...healthyMetrics, cholesterol: 250 };
      expect(calculateHeartDiseaseRisk(high)).toBeGreaterThan(calculateHeartDiseaseRisk(normal));
    });
  });

  describe("calculateHypertensionRisk", () => {
    it("should return low risk for healthy metrics", () => {
      const risk = calculateHypertensionRisk(healthyMetrics);
      expect(risk).toBeLessThan(30);
    });

    it("should return high risk for unhealthy metrics", () => {
      const risk = calculateHypertensionRisk(unhealthyMetrics);
      expect(risk).toBeGreaterThan(50);
    });

    it("should increase risk with high blood pressure", () => {
      const normal = { ...healthyMetrics, bloodPressureSystolic: 120 };
      const high = { ...healthyMetrics, bloodPressureSystolic: 160 };
      expect(calculateHypertensionRisk(high)).toBeGreaterThan(calculateHypertensionRisk(normal));
    });

    it("should increase risk with high stress level", () => {
      const lowStress = { ...healthyMetrics, stressLevel: 2 };
      const highStress = { ...healthyMetrics, stressLevel: 9 };
      expect(calculateHypertensionRisk(highStress)).toBeGreaterThan(calculateHypertensionRisk(lowStress));
    });
  });

  describe("calculateStrokeRisk", () => {
    it("should return low risk for healthy metrics", () => {
      const risk = calculateStrokeRisk(healthyMetrics);
      expect(risk).toBeLessThan(30);
    });

    it("should return high risk for unhealthy metrics", () => {
      const risk = calculateStrokeRisk(unhealthyMetrics);
      expect(risk).toBeGreaterThan(50);
    });

    it("should increase risk with age", () => {
      const young = { ...healthyMetrics, age: 30 };
      const old = { ...healthyMetrics, age: 70 };
      expect(calculateStrokeRisk(old)).toBeGreaterThan(calculateStrokeRisk(young));
    });
  });

  describe("calculateObesityRisk", () => {
    it("should return low risk for healthy metrics", () => {
      const risk = calculateObesityRisk(healthyMetrics);
      expect(risk).toBeLessThan(30);
    });

    it("should return high risk for unhealthy metrics", () => {
      const risk = calculateObesityRisk(unhealthyMetrics);
      expect(risk).toBeGreaterThan(50);
    });

    it("should increase risk with high BMI", () => {
      const normal = { ...healthyMetrics, bmi: 22 };
      const obese = { ...healthyMetrics, bmi: 35 };
      expect(calculateObesityRisk(obese)).toBeGreaterThan(calculateObesityRisk(normal));
    });

    it("should increase risk with low exercise", () => {
      const active = { ...healthyMetrics, exerciseMinutesPerWeek: 300 };
      const sedentary = { ...healthyMetrics, exerciseMinutesPerWeek: 30 };
      expect(calculateObesityRisk(sedentary)).toBeGreaterThan(calculateObesityRisk(active));
    });

    it("should increase risk with poor sleep", () => {
      const goodSleep = { ...healthyMetrics, sleepHours: 8 };
      const poorSleep = { ...healthyMetrics, sleepHours: 5 };
      expect(calculateObesityRisk(poorSleep)).toBeGreaterThan(calculateObesityRisk(goodSleep));
    });
  });

  describe("generateRiskAssessment", () => {
    it("should return valid risk assessment for healthy metrics", () => {
      const assessment = generateRiskAssessment(healthyMetrics);
      expect(assessment.overallHealthScore).toBeGreaterThan(70);
      expect(assessment.riskLevel).toBe("low");
      expect(assessment.diabetesRisk).toBeLessThan(30);
      expect(assessment.heartDiseaseRisk).toBeLessThan(30);
    });

    it("should return valid risk assessment for unhealthy metrics", () => {
      const assessment = generateRiskAssessment(unhealthyMetrics);
      expect(assessment.overallHealthScore).toBeLessThan(50);
      expect(["high", "critical"]).toContain(assessment.riskLevel);
      expect(assessment.primaryRisks.length).toBeGreaterThan(0);
    });

    it("should identify primary risks correctly", () => {
      const metrics = {
        ...healthyMetrics,
        age: 50,
        glucose: 200,
        bmi: 32,
        bloodPressureSystolic: 160,
        cholesterol: 240,
      };
      const assessment = generateRiskAssessment(metrics);
      // At least some risks should be identified
      expect(assessment.primaryRisks.length).toBeGreaterThan(0);
    });

    it("should generate recommendations", () => {
      const assessment = generateRiskAssessment(unhealthyMetrics);
      expect(assessment.recommendations.length).toBeGreaterThan(0);
    });

    it("should identify urgent alerts", () => {
      const criticalMetrics = {
        ...healthyMetrics,
        bloodPressureSystolic: 200,
        bloodPressureDiastolic: 130,
      };
      const assessment = generateRiskAssessment(criticalMetrics);
      expect(assessment.urgentAlerts.length).toBeGreaterThan(0);
    });

    it("should return values between 0-100", () => {
      const assessment = generateRiskAssessment(healthyMetrics);
      expect(assessment.overallHealthScore).toBeGreaterThanOrEqual(0);
      expect(assessment.overallHealthScore).toBeLessThanOrEqual(100);
      expect(assessment.diabetesRisk).toBeGreaterThanOrEqual(0);
      expect(assessment.diabetesRisk).toBeLessThanOrEqual(100);
      expect(assessment.heartDiseaseRisk).toBeGreaterThanOrEqual(0);
      expect(assessment.heartDiseaseRisk).toBeLessThanOrEqual(100);
    });
  });
});
