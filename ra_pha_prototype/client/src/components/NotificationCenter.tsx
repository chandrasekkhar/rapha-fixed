import React, { useState, useEffect } from 'react';
import { X, AlertCircle, AlertTriangle, Info, Bell } from 'lucide-react';
import { notificationService, HealthAlert } from '../services/notificationService';

interface NotificationCenterProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxVisible?: number;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  position = 'top-right',
  maxVisible = 5,
}) => {
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((newAlerts) => {
      setAlerts(newAlerts);
    });

    return unsubscribe;
  }, []);

  const getPositionClasses = (): string => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  const getAlertStyles = (type: 'critical' | 'warning' | 'info') => {
    switch (type) {
      case 'critical':
        return {
          bg: 'bg-red-900',
          border: 'border-red-700',
          icon: <AlertCircle className="w-5 h-5 text-red-400" />,
          text: 'text-red-100',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-900',
          border: 'border-yellow-700',
          icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
          text: 'text-yellow-100',
        };
      default:
        return {
          bg: 'bg-blue-900',
          border: 'border-blue-700',
          icon: <Info className="w-5 h-5 text-blue-400" />,
          text: 'text-blue-100',
        };
    }
  };

  const visibleAlerts = alerts.slice(0, maxVisible);

  return (
    <>
      {/* Notification Bell Icon */}
      <div className={`fixed ${getPositionClasses()} z-40`}>
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="relative p-3 bg-gradient-to-br from-slate-800 to-slate-700 rounded-full border border-slate-600 hover:border-purple-500 transition-all duration-300 shadow-lg"
        >
          <Bell className="w-6 h-6 text-slate-300" />
          {alerts.length > 0 && (
            <span className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {Math.min(alerts.length, 9)}
            </span>
          )}
        </button>
      </div>

      {/* Notifications Panel */}
      {showPanel && (
        <div className={`fixed ${getPositionClasses()} z-50 w-96 max-w-[calc(100vw-2rem)]`}>
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg border border-slate-600 shadow-2xl backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-600">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Health Alerts ({alerts.length})
              </h3>
              <button
                onClick={() => setShowPanel(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alerts List */}
            <div className="max-h-96 overflow-y-auto">
              {alerts.length > 0 ? (
                <div className="space-y-2 p-4">
                  {alerts.map((alert) => {
                    const styles = getAlertStyles(alert.type);
                    return (
                      <div
                        key={alert.id}
                        className={`${styles.bg} ${styles.border} border rounded-lg p-3 flex gap-3 transition-all duration-300`}
                      >
                        <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className={`${styles.text} font-semibold text-sm`}>{alert.title}</p>
                          <p className={`${styles.text} text-xs opacity-90 mt-1`}>{alert.message}</p>
                          <p className={`${styles.text} text-xs opacity-50 mt-2`}>
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          onClick={() => notificationService.dismissAlert(alert.id)}
                          className={`${styles.text} hover:opacity-100 opacity-60 transition-opacity flex-shrink-0`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
                  <p className="text-slate-400 text-sm">No alerts at the moment</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {alerts.length > 0 && (
              <div className="border-t border-slate-600 p-3 flex gap-2">
                <button
                  onClick={() => notificationService.clearAllAlerts()}
                  className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => {
                    notificationService.setSoundEnabled(!notificationService.isSoundEnabled());
                  }}
                  className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors"
                >
                  {notificationService.isSoundEnabled() ? 'Mute' : 'Unmute'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className={`fixed ${getPositionClasses()} z-50 space-y-3 pointer-events-none`}>
        {visibleAlerts.map((alert) => {
          const styles = getAlertStyles(alert.type);
          return (
            <div
              key={alert.id}
              className={`${styles.bg} ${styles.border} border rounded-lg p-4 shadow-lg backdrop-blur-sm pointer-events-auto max-w-sm animate-in fade-in slide-in-from-top-2 duration-300`}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0">{styles.icon}</div>
                <div className="flex-1">
                  <p className={`${styles.text} font-semibold text-sm`}>{alert.title}</p>
                  <p className={`${styles.text} text-xs opacity-90 mt-1`}>{alert.message}</p>
                </div>
                <button
                  onClick={() => notificationService.dismissAlert(alert.id)}
                  className={`${styles.text} hover:opacity-100 opacity-60 transition-opacity flex-shrink-0`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default NotificationCenter;
