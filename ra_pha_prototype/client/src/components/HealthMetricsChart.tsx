import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface HealthMetricsChartProps {
  title: string;
  description?: string;
  data: any[];
  type?: "line" | "area" | "bar" | "radar";
  dataKeys?: string[];
  colors?: string[];
}

export function HealthMetricsChart({
  title,
  description,
  data,
  type = "line",
  dataKeys = ["value"],
  colors = ["#667eea", "#764ba2", "#f093fb"],
}: HealthMetricsChartProps) {
  const chartHeight = 300;

  return (
    <Card className="card-premium">
      <CardHeader>
        <CardTitle className="text-gradient">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="w-full">
          {type === "line" && (
            <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="name" stroke="rgba(0,0,0,0.5)" />
              <YAxis stroke="rgba(0,0,0,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                } as any}
              />
              <Legend />
              {dataKeys.map((key, idx) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={2}
                  dot={{ fill: colors[idx % colors.length], r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
            </ResponsiveContainer>
          )}

          {type === "area" && (
            <ResponsiveContainer width="100%" height={chartHeight}>
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="name" stroke="rgba(0,0,0,0.5)" />
              <YAxis stroke="rgba(0,0,0,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                } as any}
              />
              <Area
                type="monotone"
                dataKey={dataKeys[0]}
                stroke="#667eea"
                fillOpacity={1}
                fill="url(#colorGradient)"
              />
            </AreaChart>
            </ResponsiveContainer>
          )}

          {type === "bar" && (
            <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="name" stroke="rgba(0,0,0,0.5)" />
              <YAxis stroke="rgba(0,0,0,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                } as any}
              />
              <Legend />
              {dataKeys.map((key, idx) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[idx % colors.length]}
                  radius={[8, 8, 0, 0]}
                />
              ))}
            </BarChart>
            </ResponsiveContainer>
          )}

          {type === "radar" && (
            <ResponsiveContainer width="100%" height={chartHeight}>
            <RadarChart data={data}>
              <PolarGrid stroke="rgba(0,0,0,0.1)" />
              <PolarAngleAxis dataKey="name" stroke="rgba(0,0,0,0.5)" />
              <PolarRadiusAxis stroke="rgba(0,0,0,0.5)" />
              <Radar
                name={dataKeys[0]}
                dataKey={dataKeys[0]}
                stroke="#667eea"
                fill="#667eea"
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                } as any}
              />
            </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default HealthMetricsChart;
