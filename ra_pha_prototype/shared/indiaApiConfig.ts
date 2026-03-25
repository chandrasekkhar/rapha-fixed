/**
 * Real-time India API Configuration
 * Centralized configuration for integrating with real Indian service providers
 */

export const INDIA_API_CONFIG = {
  // Google Maps API for location and hospital search
  googleMaps: {
    apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || "",
    enabled: !!process.env.VITE_GOOGLE_MAPS_API_KEY,
  },

  // Razorpay Payment Gateway (Indian payments)
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || "",
    keySecret: process.env.RAZORPAY_KEY_SECRET || "",
    enabled: !!process.env.RAZORPAY_KEY_ID,
  },

  // SMS Service (Exotel/Twilio)
  sms: {
    provider: "exotel",
    apiKey: process.env.SMS_API_KEY || "",
    apiSecret: process.env.SMS_API_SECRET || "",
    senderId: process.env.SMS_SENDER_ID || "RAPHA",
    enabled: !!process.env.SMS_API_KEY,
  },

  // Firebase for real-time notifications
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    apiKey: process.env.FIREBASE_API_KEY || "",
    enabled: !!process.env.FIREBASE_PROJECT_ID,
  },

  // Ambulance Services
  ambulance: {
    provider: "ziqitza",
    apiKey: process.env.AMBULANCE_API_KEY || "",
    enabled: !!process.env.AMBULANCE_API_KEY,
  },

  // Wearable Devices
  wearables: {
    fitbit: {
      clientId: process.env.FITBIT_CLIENT_ID || "",
      clientSecret: process.env.FITBIT_CLIENT_SECRET || "",
      enabled: !!process.env.FITBIT_CLIENT_ID,
    },
    googleFit: {
      clientId: process.env.GOOGLE_FIT_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_FIT_CLIENT_SECRET || "",
      enabled: !!process.env.GOOGLE_FIT_CLIENT_ID,
    },
  },

  // NDHM Integration
  ndhm: {
    baseUrl: "https://api.ndhm.gov.in",
    clientId: process.env.NDHM_CLIENT_ID || "",
    clientSecret: process.env.NDHM_CLIENT_SECRET || "",
    enabled: !!process.env.NDHM_CLIENT_ID,
  },

  // Monitoring
  monitoring: {
    sentry: {
      dsn: process.env.SENTRY_DSN || "",
      enabled: !!process.env.SENTRY_DSN,
    },
  },
};

// Type definitions for real-time services
export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  reviews: number;
  distance: number;
  latitude: number;
  longitude: number;
  specializations: string[];
  beds: number;
  emergencyServices: boolean;
  website?: string;
  hours?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  distance: number;
  latitude: number;
  longitude: number;
  hours: string;
  deliveryAvailable: boolean;
  website?: string;
}

export interface AmbulanceBooking {
  bookingId: string;
  status: "requested" | "accepted" | "on-the-way" | "arrived" | "completed";
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  eta: number;
  latitude: number;
  longitude: number;
  cost: number;
}

export interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency: string;
  status: string;
}

export interface HealthVitals {
  timestamp: Date;
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  oxygenLevel: number;
  temperature: number;
  source: "manual" | "wearable";
}
