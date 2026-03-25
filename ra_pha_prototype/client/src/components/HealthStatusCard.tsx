import { Heart, Activity, Wind, Moon, Brain } from "lucide-react";

interface HealthStatusCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  status: "healthy" | "warning" | "critical";
  trend?: "up" | "down" | "stable";
  color: string;
}

export function HealthStatusCard({
  title,
  value,
  unit,
  icon,
  status,
  trend,
  color,
}: HealthStatusCardProps) {
  const statusColors = {
    healthy: "from-green-400 to-emerald-600",
    warning: "from-yellow-400 to-orange-600",
    critical: "from-red-400 to-red-600",
  };

  const statusBgColors = {
    healthy: "bg-green-50 border-green-200",
    warning: "bg-yellow-50 border-yellow-200",
    critical: "bg-red-50 border-red-200",
  };

  const statusTextColors = {
    healthy: "text-green-700",
    warning: "text-yellow-700",
    critical: "text-red-700",
  };

  return (
    <div className={`card-premium relative overflow-hidden border ${statusBgColors[status]}`}>
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${statusColors[status]} opacity-5`}></div>

      <div className="relative p-6 space-y-4">
        {/* Header with icon and title */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          <div className={`p-2 rounded-lg bg-gradient-to-br ${statusColors[status]} text-white`}>
            {icon}
          </div>
        </div>

        {/* Main value */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            {unit && <span className="text-sm text-gray-600">{unit}</span>}
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${statusColors[status]} pulse-glow`}></div>
            <span className={`text-xs font-semibold ${statusTextColors[status]}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>

        {/* Trend indicator */}
        {trend && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              {trend === "up" && "📈 Increasing"}
              {trend === "down" && "📉 Decreasing"}
              {trend === "stable" && "➡️ Stable"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HealthStatusCard;
