import React, { useState, useEffect } from 'react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AlertCircle, TrendingUp, Heart, Activity, Zap, Clock } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface VitalReading {
  timestamp: string;
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  oxygenLevel: number;
  sleepHours: number;
  stressLevel: number;
}

interface HealthPrediction {
  healthScore: number;
  riskLevel: string;
  alerts: string[];
  predictedConditions: string[];
  urgentAlerts: string[];
}

interface TrendData {
  timestamp: string;
  value: number;
  status: 'normal' | 'warning' | 'critical';
}

const HealthPredictionDashboard: React.FC = () => {
  const [vitals, setVitals] = useState<VitalReading | null>(null);
  const [prediction, setPrediction] = useState<HealthPrediction | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('heartRate');
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [userAge, setUserAge] = useState<number>(30);
  const [userGender, setUserGender] = useState<string>('male');
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize with mock vitals data
  useEffect(() => {
    const mockVitals: VitalReading = {
      timestamp: new Date().toISOString(),
      heartRate: 72,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      oxygenLevel: 98,
      sleepHours: 7,
      stressLevel: 5,
    };
    setVitals(mockVitals);
  }, []);

  // Generate predictions based on vitals
  useEffect(() => {
    const generatePrediction = async () => {
      if (!vitals) return;

      setLoading(true);
      try {
        // Calculate prediction
        const healthScore = calculateHealthScore(vitals);
        const alerts = generateHealthAlerts(vitals);
        const predictedConditions = predictConditions(vitals, userAge, userGender);
        const urgentAlerts = alerts.filter(a => a.includes('CRITICAL') || a.includes('🚨'));

        setPrediction({
          healthScore,
          riskLevel: healthScore >= 80 ? 'Low' : healthScore >= 60 ? 'Moderate' : healthScore >= 40 ? 'High' : 'Critical',
          alerts,
          predictedConditions,
          urgentAlerts,
        });

        // Generate trend data
        const newTrendData: TrendData[] = [];
        for (let i = 0; i < 12; i++) {
          const value = vitals.heartRate + (Math.random() - 0.5) * 20;
          newTrendData.push({
            timestamp: `${i}:00`,
            value: Math.round(value),
            status: value > 100 ? 'critical' : value > 85 ? 'warning' : 'normal',
          });
        }
        setTrendData(newTrendData);
      } catch (error) {
        console.error('Error generating prediction:', error);
      } finally {
        setLoading(false);
      }
    };

    generatePrediction();
  }, [vitals, userAge, userGender]);

  const calculateHealthScore = (vitals: VitalReading): number => {
    let score = 100;
    
    if (vitals.heartRate > 100 || vitals.heartRate < 60) score -= 15;
    if (vitals.bloodPressureSystolic > 140) score -= 20;
    else if (vitals.bloodPressureSystolic > 130) score -= 10;
    if (vitals.oxygenLevel < 95) score -= 25;
    if (vitals.sleepHours < 6) score -= 10;
    if (vitals.stressLevel > 8) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  };

  const generateHealthAlerts = (vitals: VitalReading): string[] => {
    const alerts: string[] = [];
    
    if (vitals.heartRate > 100) alerts.push(`🚨 CRITICAL: High heart rate (${vitals.heartRate} bpm)`);
    else if (vitals.heartRate < 60) alerts.push(`⚠️ WARNING: Low heart rate (${vitals.heartRate} bpm)`);
    
    if (vitals.bloodPressureSystolic > 140) alerts.push(`🚨 CRITICAL: High blood pressure (${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic})`);
    else if (vitals.bloodPressureSystolic > 130) alerts.push(`⚠️ WARNING: Elevated blood pressure (${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic})`);
    
    if (vitals.oxygenLevel < 95) alerts.push(`🚨 CRITICAL: Low oxygen level (${vitals.oxygenLevel}%)`);
    
    if (vitals.sleepHours < 6) alerts.push(`⚠️ WARNING: Insufficient sleep (${vitals.sleepHours} hours)`);
    
    if (vitals.stressLevel > 8) alerts.push(`⚠️ WARNING: High stress level (${vitals.stressLevel}/10)`);
    
    return alerts;
  };

  const predictConditions = (vitals: VitalReading, age: number, gender: string): string[] => {
    const conditions: string[] = [];
    
    if (vitals.bloodPressureSystolic > 140 || vitals.bloodPressureDiastolic > 90) {
      conditions.push('Hypertension Risk');
    }
    
    if (vitals.heartRate > 100) {
      conditions.push('Tachycardia Risk');
    }
    
    if (vitals.oxygenLevel < 95) {
      conditions.push('Hypoxemia Risk');
    }
    
    if (vitals.sleepHours < 5 && vitals.stressLevel > 7) {
      conditions.push('Burnout Risk');
    }
    
    if (age > 45 && vitals.bloodPressureSystolic > 130) {
      conditions.push('Heart Disease Risk');
    }
    
    return conditions;
  };

  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel?.toLowerCase()) {
      case 'critical':
        return 'from-red-600 to-red-400';
      case 'high':
        return 'from-orange-600 to-orange-400';
      case 'moderate':
        return 'from-yellow-600 to-yellow-400';
      case 'low':
        return 'from-green-600 to-green-400';
      default:
        return 'from-blue-600 to-blue-400';
    }
  };

  const getHealthScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const radarData = vitals ? [
    { metric: 'Heart Rate', value: Math.min((vitals.heartRate / 120) * 100, 100) },
    { metric: 'Blood Pressure', value: Math.min((vitals.bloodPressureSystolic / 140) * 100, 100) },
    { metric: 'Oxygen', value: vitals.oxygenLevel },
    { metric: 'Sleep', value: Math.min((vitals.sleepHours / 8) * 100, 100) },
    { metric: 'Stress', value: Math.min(((10 - vitals.stressLevel) / 10) * 100, 100) },
  ] : [];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Real-Time Health Prediction</h1>
            <p className="text-gray-600 mt-2">AI-powered health monitoring and predictive analytics</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {vitals && (
              <>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Heart Rate</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{vitals.heartRate}</p>
                      <p className="text-gray-500 text-xs mt-1">bpm</p>
                    </div>
                    <Heart className="w-12 h-12 text-red-500 opacity-20" />
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Blood Pressure</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic}</p>
                      <p className="text-gray-500 text-xs mt-1">mmHg</p>
                    </div>
                    <Activity className="w-12 h-12 text-blue-500 opacity-20" />
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Oxygen Level</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{vitals.oxygenLevel}</p>
                      <p className="text-gray-500 text-xs mt-1">%</p>
                    </div>
                    <Zap className="w-12 h-12 text-green-500 opacity-20" />
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Health Score</p>
                      <p className={`text-3xl font-bold mt-2 ${getHealthScoreColor(prediction?.healthScore || 0)}`}>
                        {prediction?.healthScore || 0}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">/100</p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-purple-500 opacity-20" />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Risk Assessment */}
          {prediction && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Risk Level Card */}
              <div className={`bg-gradient-to-br ${getRiskColor(prediction.riskLevel)} rounded-lg p-8 border border-opacity-20 border-white shadow-sm text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Risk Level</h3>
                  <AlertCircle className="w-6 h-6 opacity-80" />
                </div>
                <p className="text-4xl font-bold">{prediction.riskLevel}</p>
                <p className="text-sm mt-2 opacity-80">Based on current vitals and trends</p>
              </div>

              {/* Alerts Card */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-gray-900 font-semibold text-lg mb-4">Active Alerts</h3>
                <div className="space-y-2">
                  {prediction.alerts && prediction.alerts.length > 0 ? (
                    prediction.alerts.slice(0, 3).map((alert, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{alert}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No active alerts</p>
                  )}
                </div>
              </div>

              {/* Urgent Alerts */}
              {prediction.urgentAlerts && prediction.urgentAlerts.length > 0 && (
                <div className="bg-red-50 rounded-lg p-6 border border-red-200 shadow-sm">
                  <h3 className="text-red-900 font-semibold text-lg mb-4">🚨 Urgent Alerts</h3>
                  <div className="space-y-2">
                    {prediction.urgentAlerts.map((alert, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-red-800">{alert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Heart Rate Trend */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-gray-900 font-semibold text-lg mb-4">Heart Rate Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="timestamp" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }} />
                  <Area type="monotone" dataKey="value" stroke="#ef4444" fillOpacity={1} fill="url(#colorHR)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Health Metrics Radar */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-gray-900 font-semibold text-lg mb-4">Health Metrics Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="metric" stroke="#9ca3af" />
                  <PolarRadiusAxis stroke="#9ca3af" />
                  <Radar name="Health Metrics" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Predicted Conditions */}
          {prediction && prediction.predictedConditions && prediction.predictedConditions.length > 0 && (
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-8">
              <h3 className="text-gray-900 font-semibold text-lg mb-4">Predicted Health Conditions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prediction.predictedConditions.map((condition, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 text-sm font-medium">{condition}</p>
                    <p className="text-gray-500 text-xs mt-2">Risk detected based on current vitals</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Settings */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-gray-900 font-semibold text-lg mb-4">Profile Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  value={userAge}
                  onChange={(e) => setUserAge(parseInt(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Gender</label>
                <select
                  value={userGender}
                  onChange={(e) => setUserGender(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HealthPredictionDashboard;
