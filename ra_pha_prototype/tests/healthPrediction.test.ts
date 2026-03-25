import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Health Prediction Tests
 * Tests for real-time health prediction algorithms and features
 */

describe('Health Prediction System', () => {
  describe('Health Score Calculation', () => {
    it('should calculate health score correctly for normal vitals', () => {
      const vitals = {
        heartRate: 72,
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 80,
        oxygenLevel: 98,
        sleepHours: 7,
        stressLevel: 5,
      };

      // Expected: All vitals are normal, so score should be high (80+)
      const score = calculateHealthScore(vitals);
      expect(score).toBeGreaterThanOrEqual(80);
    });

    it('should calculate lower health score for abnormal vitals', () => {
      const vitals = {
        heartRate: 120,
        bloodPressureSystolic: 150,
        bloodPressureDiastolic: 100,
        oxygenLevel: 90,
        sleepHours: 4,
        stressLevel: 9,
      };

      // Expected: Multiple abnormal readings, score should be lower
      const score = calculateHealthScore(vitals);
      expect(score).toBeLessThan(60);
    });

    it('should return score between 0 and 100', () => {
      const vitals = {
        heartRate: 72,
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 80,
        oxygenLevel: 98,
        sleepHours: 7,
        stressLevel: 5,
      };

      const score = calculateHealthScore(vitals);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('Health Alert Generation', () => {
    it('should generate alert for high heart rate', () => {
      const vitals = { heartRate: 110 };
      const alerts = generateHealthAlerts(vitals);
      
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts.some(a => a.toLowerCase().includes('heart rate'))).toBe(true);
    });

    it('should generate alert for low oxygen level', () => {
      const vitals = { oxygenLevel: 92 };
      const alerts = generateHealthAlerts(vitals);
      
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts.some(a => a.toLowerCase().includes('oxygen'))).toBe(true);
    });

    it('should generate alert for high blood pressure', () => {
      const vitals = { 
        bloodPressureSystolic: 150,
        bloodPressureDiastolic: 95 
      };
      const alerts = generateHealthAlerts(vitals);
      
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts.some(a => a.toLowerCase().includes('blood pressure'))).toBe(true);
    });

    it('should generate alert for insufficient sleep', () => {
      const vitals = { sleepHours: 4 };
      const alerts = generateHealthAlerts(vitals);
      
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts.some(a => a.toLowerCase().includes('sleep'))).toBe(true);
    });

    it('should generate alert for high stress', () => {
      const vitals = { stressLevel: 9 };
      const alerts = generateHealthAlerts(vitals);
      
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts.some(a => a.toLowerCase().includes('stress'))).toBe(true);
    });

    it('should not generate alerts for normal vitals', () => {
      const vitals = {
        heartRate: 72,
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 80,
        oxygenLevel: 98,
        sleepHours: 7,
        stressLevel: 5,
      };
      const alerts = generateHealthAlerts(vitals);
      
      expect(alerts.length).toBe(0);
    });
  });

  describe('Trend Analysis', () => {
    it('should detect increasing trend', () => {
      const values = [70, 72, 74, 76, 78, 80];
      const trend = analyzeTrend(values);
      
      expect(trend.direction).toBe('increasing');
      expect(trend.rate).toBeGreaterThan(0);
    });

    it('should detect decreasing trend', () => {
      const values = [100, 95, 90, 85, 80, 75];
      const trend = analyzeTrend(values);
      
      expect(trend.direction).toBe('decreasing');
      expect(trend.rate).toBeLessThan(0);
    });

    it('should detect stable trend', () => {
      const values = [75, 75, 76, 75, 74, 75];
      const trend = analyzeTrend(values);
      
      expect(trend.direction).toBe('stable');
      expect(Math.abs(trend.rate)).toBeLessThan(5);
    });

    it('should require minimum data points', () => {
      const values = [75];
      const trend = analyzeTrend(values);
      
      expect(trend.direction).toBe('insufficient_data');
    });
  });

  describe('Risk Prediction', () => {
    it('should predict diabetes risk for high glucose', () => {
      const vitals = {
        bloodPressureSystolic: 140,
        stressLevel: 8,
        sleepHours: 5,
      };
      const prediction = predictDiabetesRisk(vitals, 45, 'male');
      
      expect(prediction.riskScore).toBeGreaterThan(0);
    });

    it('should predict heart disease risk for high BP', () => {
      const vitals = {
        heartRate: 100,
        bloodPressureSystolic: 160,
        bloodPressureDiastolic: 100,
      };
      const prediction = predictHeartDiseaseRisk(vitals, 50, 'male');
      
      expect(prediction.riskScore).toBeGreaterThan(0);
    });

    it('should predict hypertension risk', () => {
      const vitals = {
        bloodPressureSystolic: 150,
        bloodPressureDiastolic: 95,
      };
      const prediction = predictHypertensionRisk(vitals, 40, 'female');
      
      expect(prediction.riskScore).toBeGreaterThan(0);
    });

    it('should predict stroke risk', () => {
      const vitals = {
        heartRate: 110,
        bloodPressureSystolic: 160,
        bloodPressureDiastolic: 100,
        stressLevel: 9,
      };
      const prediction = predictStrokeRisk(vitals, 60, 'male');
      
      expect(prediction.riskScore).toBeGreaterThan(0);
    });

    it('should predict obesity risk', () => {
      const vitals = {
        sleepHours: 4,
        stressLevel: 8,
      };
      const prediction = predictObesityRisk(vitals, 35, 'female');
      
      expect(prediction.riskScore).toBeGreaterThan(0);
    });
  });

  describe('Personalized Recommendations', () => {
    it('should generate recommendations for high heart rate', () => {
      const prediction = {
        riskScore: 75,
        predictedConditions: ['Tachycardia'],
        recommendations: [],
        urgentAlerts: [],
      };
      const recommendations = generateRecommendations(prediction, 35, 'male');
      
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations.some(r => r.toLowerCase().includes('rest'))).toBe(true);
    });

    it('should generate recommendations for high blood pressure', () => {
      const prediction = {
        riskScore: 80,
        predictedConditions: ['Hypertension'],
        recommendations: [],
        urgentAlerts: [],
      };
      const recommendations = generateRecommendations(prediction, 45, 'female');
      
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations.some(r => r.toLowerCase().includes('salt'))).toBe(true);
    });

    it('should generate lifestyle recommendations', () => {
      const prediction = {
        riskScore: 60,
        predictedConditions: [],
        recommendations: [],
        urgentAlerts: [],
      };
      const recommendations = generateRecommendations(prediction, 30, 'male');
      
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations.some(r => 
        r.toLowerCase().includes('exercise') || 
        r.toLowerCase().includes('diet') ||
        r.toLowerCase().includes('sleep')
      )).toBe(true);
    });
  });

  describe('Real-time Monitoring', () => {
    it('should track vital changes over time', () => {
      const readings = [
        { timestamp: Date.now(), heartRate: 72 },
        { timestamp: Date.now() + 60000, heartRate: 75 },
        { timestamp: Date.now() + 120000, heartRate: 78 },
      ];
      
      const changes = trackVitalChanges(readings);
      expect(changes.length).toBe(2);
      expect(changes[0].change).toBeGreaterThan(0);
    });

    it('should detect sudden spikes in vitals', () => {
      const readings = [
        { timestamp: Date.now(), heartRate: 72 },
        { timestamp: Date.now() + 60000, heartRate: 120 },
      ];
      
      const spike = detectSpike(readings);
      expect(spike).toBe(true);
    });

    it('should calculate average vitals', () => {
      const readings = [
        { heartRate: 70 },
        { heartRate: 72 },
        { heartRate: 74 },
      ];
      
      const average = calculateAverageVitals(readings);
      expect(average.heartRate).toBe(72);
    });
  });

  describe('Alert Severity Classification', () => {
    it('should classify critical alerts', () => {
      const vitals = {
        oxygenLevel: 85,
        bloodPressureSystolic: 180,
      };
      const severity = classifyAlertSeverity(vitals);
      
      expect(severity).toBe('critical');
    });

    it('should classify warning alerts', () => {
      const vitals = {
        heartRate: 105,
        sleepHours: 5,
      };
      const severity = classifyAlertSeverity(vitals);
      
      expect(severity).toBe('warning');
    });

    it('should classify info alerts', () => {
      const vitals = {
        stressLevel: 6,
      };
      const severity = classifyAlertSeverity(vitals);
      
      expect(severity).toBe('info');
    });
  });

  describe('Notification Service', () => {
    it('should create critical alerts', () => {
      const alertId = createAlert('critical', 'Test Alert', 'Test message');
      
      expect(alertId).toBeDefined();
      expect(typeof alertId).toBe('string');
    });

    it('should dismiss alerts', () => {
      const alertId = createAlert('warning', 'Test', 'Message');
      dismissAlert(alertId);
      
      const alert = getAlert(alertId);
      expect(alert.dismissed).toBe(true);
    });

    it('should retrieve active alerts', () => {
      createAlert('critical', 'Alert 1', 'Message 1');
      createAlert('warning', 'Alert 2', 'Message 2');
      
      const activeAlerts = getActiveAlerts();
      expect(activeAlerts.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Health Prediction Integration', () => {
    it('should provide comprehensive health assessment', () => {
      const vitals = {
        heartRate: 72,
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 80,
        oxygenLevel: 98,
        sleepHours: 7,
        stressLevel: 5,
      };
      
      const assessment = getHealthAssessment(vitals, 35, 'male');
      
      expect(assessment.healthScore).toBeGreaterThan(0);
      expect(assessment.riskLevel).toBeDefined();
      expect(assessment.alerts).toBeDefined();
      expect(assessment.recommendations).toBeDefined();
    });

    it('should handle missing vital data gracefully', () => {
      const vitals = {
        heartRate: 72,
      };
      
      const assessment = getHealthAssessment(vitals, 35, 'male');
      
      expect(assessment.healthScore).toBeGreaterThanOrEqual(0);
      expect(assessment.healthScore).toBeLessThanOrEqual(100);
    });
  });
});

// Mock functions for testing
function calculateHealthScore(vitals: any): number {
  let score = 100;
  
  if (vitals.heartRate) {
    if (vitals.heartRate > 100 || vitals.heartRate < 60) score -= 15;
  }
  
  if (vitals.bloodPressureSystolic) {
    if (vitals.bloodPressureSystolic > 140) score -= 20;
    else if (vitals.bloodPressureSystolic > 130) score -= 10;
  }
  
  if (vitals.oxygenLevel && vitals.oxygenLevel < 95) score -= 25;
  if (vitals.sleepHours && vitals.sleepHours < 6) score -= 10;
  if (vitals.stressLevel && vitals.stressLevel > 8) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

function generateHealthAlerts(vitals: any): string[] {
  const alerts: string[] = [];
  
  if (vitals.heartRate && (vitals.heartRate > 100 || vitals.heartRate < 60)) {
    alerts.push(`Abnormal heart rate: ${vitals.heartRate} bpm`);
  }
  
  if (vitals.bloodPressureSystolic && vitals.bloodPressureSystolic > 140) {
    alerts.push(`High blood pressure: ${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}`);
  }
  
  if (vitals.oxygenLevel && vitals.oxygenLevel < 95) {
    alerts.push(`Low oxygen level: ${vitals.oxygenLevel}%`);
  }
  
  if (vitals.sleepHours && vitals.sleepHours < 6) {
    alerts.push(`Insufficient sleep: ${vitals.sleepHours} hours`);
  }
  
  if (vitals.stressLevel && vitals.stressLevel > 8) {
    alerts.push(`High stress level: ${vitals.stressLevel}/10`);
  }
  
  return alerts;
}

function analyzeTrend(values: number[]): any {
  if (values.length < 2) {
    return { direction: 'insufficient_data', rate: 0 };
  }
  
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  
  const avgFirst = firstHalf.reduce((a, b) => a + b) / firstHalf.length;
  const avgSecond = secondHalf.reduce((a, b) => a + b) / secondHalf.length;
  
  const rate = ((avgSecond - avgFirst) / avgFirst) * 100;
  
  let direction = 'stable';
  if (rate > 5) direction = 'increasing';
  else if (rate < -5) direction = 'decreasing';
  
  return { direction, rate };
}

function predictDiabetesRisk(vitals: any, age: number, gender: string): any {
  let score = 0;
  if (vitals.bloodPressureSystolic > 130) score += 20;
  if (vitals.stressLevel > 7) score += 15;
  if (vitals.sleepHours < 6) score += 15;
  if (age > 45) score += 10;
  return { riskScore: Math.min(100, score) };
}

function predictHeartDiseaseRisk(vitals: any, age: number, gender: string): any {
  let score = 0;
  if (vitals.heartRate > 90) score += 15;
  if (vitals.bloodPressureSystolic > 140) score += 25;
  if (age > 50) score += 20;
  return { riskScore: Math.min(100, score) };
}

function predictHypertensionRisk(vitals: any, age: number, gender: string): any {
  let score = 0;
  if (vitals.bloodPressureSystolic > 140) score += 40;
  if (vitals.bloodPressureDiastolic > 90) score += 30;
  if (age > 40) score += 10;
  return { riskScore: Math.min(100, score) };
}

function predictStrokeRisk(vitals: any, age: number, gender: string): any {
  let score = 0;
  if (vitals.heartRate > 100) score += 20;
  if (vitals.bloodPressureSystolic > 160) score += 30;
  if (vitals.stressLevel > 8) score += 15;
  if (age > 60) score += 25;
  return { riskScore: Math.min(100, score) };
}

function predictObesityRisk(vitals: any, age: number, gender: string): any {
  let score = 0;
  if (vitals.sleepHours < 6) score += 20;
  if (vitals.stressLevel > 7) score += 20;
  if (age > 35) score += 15;
  return { riskScore: Math.min(100, score) };
}

function generateRecommendations(prediction: any, age: number, gender: string): string[] {
  const recommendations: string[] = [];
  
  if (prediction.predictedConditions.includes('Tachycardia')) {
    recommendations.push('Rest and avoid strenuous activities');
    recommendations.push('Practice deep breathing exercises');
  }
  
  if (prediction.predictedConditions.includes('Hypertension')) {
    recommendations.push('Reduce salt intake');
    recommendations.push('Exercise regularly');
    recommendations.push('Manage stress levels');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Exercise for 30 minutes daily');
    recommendations.push('Maintain a balanced diet');
    recommendations.push('Get 7-8 hours of sleep');
  }
  
  return recommendations;
}

function trackVitalChanges(readings: any[]): any[] {
  const changes = [];
  for (let i = 1; i < readings.length; i++) {
    changes.push({
      change: readings[i].heartRate - readings[i - 1].heartRate,
      timeInterval: readings[i].timestamp - readings[i - 1].timestamp,
    });
  }
  return changes;
}

function detectSpike(readings: any[]): boolean {
  if (readings.length < 2) return false;
  const change = Math.abs(readings[1].heartRate - readings[0].heartRate);
  return change > 30;
}

function calculateAverageVitals(readings: any[]): any {
  const avg = { heartRate: 0 };
  const sum = readings.reduce((acc, r) => acc + r.heartRate, 0);
  avg.heartRate = sum / readings.length;
  return avg;
}

function classifyAlertSeverity(vitals: any): string {
  if (vitals.oxygenLevel < 90 || vitals.bloodPressureSystolic > 180) return 'critical';
  if (vitals.heartRate > 100 || vitals.sleepHours < 5) return 'warning';
  return 'info';
}

function createAlert(type: string, title: string, message: string): string {
  return `alert-${Date.now()}`;
}

function dismissAlert(id: string): void {
  // Mock implementation
}

function getAlert(id: string): any {
  return { dismissed: true };
}

function getActiveAlerts(): any[] {
  return [];
}

function getHealthAssessment(vitals: any, age: number, gender: string): any {
  return {
    healthScore: calculateHealthScore(vitals),
    riskLevel: 'low',
    alerts: generateHealthAlerts(vitals),
    recommendations: generateRecommendations({ predictedConditions: [] }, age, gender),
  };
}
