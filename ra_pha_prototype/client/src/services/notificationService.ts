/**
 * Notification Service for Real-Time Health Alerts
 * Handles browser notifications, sound alerts, and in-app notifications
 */

export interface HealthAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  actionUrl?: string;
  dismissed: boolean;
}

class NotificationService {
  private alerts: Map<string, HealthAlert> = new Map();
  private listeners: ((alerts: HealthAlert[]) => void)[] = [];
  private soundEnabled: boolean = true;
  private browserNotificationsEnabled: boolean = false;

  constructor() {
    this.requestNotificationPermission();
  }

  /**
   * Request browser notification permission
   */
  private async requestNotificationPermission(): Promise<void> {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        this.browserNotificationsEnabled = permission === 'granted';
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  }

  /**
   * Add a new health alert
   */
  addAlert(alert: Omit<HealthAlert, 'id' | 'timestamp' | 'dismissed'>): string {
    const id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newAlert: HealthAlert = {
      ...alert,
      id,
      timestamp: new Date(),
      dismissed: false,
    };

    this.alerts.set(id, newAlert);
    this.notifyListeners();
    this.playSound(alert.type);
    this.sendBrowserNotification(newAlert);

    // Auto-dismiss info alerts after 5 seconds
    if (alert.type === 'info') {
      setTimeout(() => this.dismissAlert(id), 5000);
    }

    return id;
  }

  /**
   * Dismiss an alert
   */
  dismissAlert(id: string): void {
    const alert = this.alerts.get(id);
    if (alert) {
      alert.dismissed = true;
      this.notifyListeners();
    }
  }

  /**
   * Get all active alerts
   */
  getActiveAlerts(): HealthAlert[] {
    return Array.from(this.alerts.values()).filter(alert => !alert.dismissed);
  }

  /**
   * Get all alerts (including dismissed)
   */
  getAllAlerts(): HealthAlert[] {
    return Array.from(this.alerts.values());
  }

  /**
   * Clear all alerts
   */
  clearAllAlerts(): void {
    this.alerts.forEach(alert => alert.dismissed = true);
    this.notifyListeners();
  }

  /**
   * Subscribe to alert changes
   */
  subscribe(callback: (alerts: HealthAlert[]) => void): () => void {
    this.listeners.push(callback);
    // Immediately call with current alerts
    callback(this.getActiveAlerts());
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notify all listeners of alert changes
   */
  private notifyListeners(): void {
    const activeAlerts = this.getActiveAlerts();
    this.listeners.forEach(listener => listener(activeAlerts));
  }

  /**
   * Play sound alert based on severity
   */
  private playSound(type: 'critical' | 'warning' | 'info'): void {
    if (!this.soundEnabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different frequencies for different alert types
      switch (type) {
        case 'critical':
          oscillator.frequency.value = 1000; // High frequency for critical
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
          break;
        case 'warning':
          oscillator.frequency.value = 700; // Medium frequency for warning
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
        case 'info':
          oscillator.frequency.value = 500; // Low frequency for info
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  /**
   * Send browser notification
   */
  private sendBrowserNotification(alert: HealthAlert): void {
    if (!this.browserNotificationsEnabled || !('Notification' in window)) return;

    try {
      const icon = this.getIconForType(alert.type);
      new Notification(alert.title, {
        body: alert.message,
        icon,
        tag: alert.id,
        requireInteraction: alert.type === 'critical',
      });
    } catch (error) {
      console.error('Error sending browser notification:', error);
    }
  }

  /**
   * Get icon URL for notification type
   */
  private getIconForType(type: 'critical' | 'warning' | 'info'): string {
    switch (type) {
      case 'critical':
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dc2626"><circle cx="12" cy="12" r="10"/><path fill="white" d="M12 7v5m0 3v1"/></svg>';
      case 'warning':
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f59e0b"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>';
      default:
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233b82f6"><circle cx="12" cy="12" r="10"/><path fill="white" d="M12 7v5m0 3v1"/></svg>';
    }
  }

  /**
   * Toggle sound alerts
   */
  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  /**
   * Check if sound is enabled
   */
  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  /**
   * Create critical health alert
   */
  createCriticalAlert(title: string, message: string, actionUrl?: string): string {
    return this.addAlert({
      type: 'critical',
      title,
      message,
      actionUrl,
    });
  }

  /**
   * Create warning alert
   */
  createWarningAlert(title: string, message: string, actionUrl?: string): string {
    return this.addAlert({
      type: 'warning',
      title,
      message,
      actionUrl,
    });
  }

  /**
   * Create info alert
   */
  createInfoAlert(title: string, message: string, actionUrl?: string): string {
    return this.addAlert({
      type: 'info',
      title,
      message,
      actionUrl,
    });
  }

  /**
   * Generate alerts based on vitals
   */
  generateVitalsAlerts(vitals: Record<string, number>): void {
    // Heart rate alerts
    if (vitals.heartRate > 100) {
      this.createWarningAlert(
        'High Heart Rate Detected',
        `Your heart rate is ${vitals.heartRate} bpm. Please rest and monitor.`,
        '/health-prediction'
      );
    } else if (vitals.heartRate < 60) {
      this.createWarningAlert(
        'Low Heart Rate Detected',
        `Your heart rate is ${vitals.heartRate} bpm. Consider consulting a doctor.`,
        '/health-prediction'
      );
    }

    // Blood pressure alerts
    if (vitals.bloodPressureSystolic > 140 || vitals.bloodPressureDiastolic > 90) {
      this.createCriticalAlert(
        'High Blood Pressure Alert',
        `Your BP is ${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic} mmHg. Seek medical attention.`,
        '/health-prediction'
      );
    }

    // Oxygen level alerts
    if (vitals.oxygenLevel < 95) {
      this.createCriticalAlert(
        'Low Oxygen Level',
        `Your oxygen level is ${vitals.oxygenLevel}%. This requires immediate attention.`,
        '/health-prediction'
      );
    }

    // Sleep alerts
    if (vitals.sleepHours < 5) {
      this.createWarningAlert(
        'Insufficient Sleep',
        `You got only ${vitals.sleepHours} hours of sleep. Aim for 7-8 hours.`,
        '/health-prediction'
      );
    }

    // Stress alerts
    if (vitals.stressLevel > 8) {
      this.createWarningAlert(
        'High Stress Levels',
        `Your stress level is ${vitals.stressLevel}/10. Try relaxation techniques.`,
        '/health-prediction'
      );
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
