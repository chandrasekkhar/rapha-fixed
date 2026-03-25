# RA-PHA Indian API Integration Guide

## Overview

This guide provides step-by-step instructions for integrating real Indian APIs and services into the RA-PHA application.

## 1. Razorpay Payment Gateway Integration

### Setup Instructions

1. **Create Razorpay Account**
   - Visit https://razorpay.com
   - Sign up and complete KYC verification
   - Navigate to Settings > API Keys
   - Copy Key ID and Key Secret

2. **Environment Configuration**
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
   ```

3. **Implementation**
   ```typescript
   // Create payment order
   const order = await trpc.realtime.createRazorpayOrder.mutate({
     amount: 99900, // in paise
     description: "Premium subscription"
   });

   // Verify payment
   const verified = await trpc.realtime.verifyRazorpayPayment.mutate({
     orderId: order.orderId,
     paymentId: paymentId,
     signature: signature
   });
   ```

4. **Test Cards**
   - Success: 4111 1111 1111 1111
   - Failure: 4222 2222 2222 2222
   - Any future expiry date and any CVC

### Documentation
- https://razorpay.com/docs/payments/

---

## 2. SMS Service Integration (Exotel)

### Setup Instructions

1. **Create Exotel Account**
   - Visit https://exotel.com
   - Sign up and complete verification
   - Navigate to Settings > API Credentials
   - Copy API Key and API Secret

2. **Environment Configuration**
   ```
   SMS_API_KEY=your-exotel-api-key
   SMS_API_SECRET=your-exotel-api-secret
   SMS_SENDER_ID=RAPHA
   ```

3. **Implementation**
   ```typescript
   // Send SMS
   const result = await trpc.realtime.sendSMS.mutate({
     phoneNumber: "+91-9876543210",
     message: "Your ambulance has been booked"
   });
   ```

4. **Sender ID Registration**
   - Register sender ID with Exotel
   - Wait for approval (24-48 hours)
   - Use approved sender ID in SMS_SENDER_ID

### Documentation
- https://exotel.com/api-docs/

---

## 3. Google Maps API Integration

### Setup Instructions

1. **Create Google Cloud Project**
   - Visit https://console.cloud.google.com
   - Create new project
   - Enable Maps APIs:
     - Maps JavaScript API
     - Places API
     - Directions API
     - Distance Matrix API

2. **Create API Key**
   - Navigate to Credentials
   - Create API Key
   - Restrict to HTTP referrers
   - Add your domain

3. **Environment Configuration**
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
   ```

4. **Implementation**
   ```typescript
   // Search hospitals
   const hospitals = await trpc.realtime.searchHospitals.query({
     latitude: 28.6139,
     longitude: 77.209,
     radiusKm: 5
   });
   ```

### Documentation
- https://developers.google.com/maps/documentation

---

## 4. Firebase Cloud Messaging (Push Notifications)

### Setup Instructions

1. **Create Firebase Project**
   - Visit https://console.firebase.google.com
   - Create new project
   - Add web app
   - Copy configuration

2. **Environment Configuration**
   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_API_KEY=AIzaSy...
   ```

3. **Implementation**
   ```typescript
   // Send push notification
   const result = await trpc.realtime.sendPushNotification.mutate({
     title: "Health Alert",
     message: "Your vitals are abnormal"
   });
   ```

4. **Client Setup**
   - Initialize Firebase in client
   - Request notification permission
   - Register service worker

### Documentation
- https://firebase.google.com/docs/cloud-messaging

---

## 5. Fitbit Wearable Integration

### Setup Instructions

1. **Register Fitbit Application**
   - Visit https://dev.fitbit.com/build/reference/web-api/
   - Register application
   - Get OAuth 2.0 credentials

2. **Environment Configuration**
   ```
   FITBIT_CLIENT_ID=your-client-id
   FITBIT_CLIENT_SECRET=your-client-secret
   ```

3. **OAuth Flow**
   - Redirect user to Fitbit authorization
   - Exchange code for access token
   - Store refresh token securely

4. **Implementation**
   ```typescript
   // Get wearable data
   const data = await trpc.realtime.getWearableHealthData.query({
     deviceType: "fitbit"
   });
   ```

### Documentation
- https://dev.fitbit.com/build/reference/web-api/

---

## 6. Google Fit Integration

### Setup Instructions

1. **Create Google Fit Project**
   - Visit https://console.cloud.google.com
   - Enable Google Fit API
   - Create OAuth 2.0 credentials

2. **Environment Configuration**
   ```
   GOOGLE_FIT_CLIENT_ID=your-client-id
   GOOGLE_FIT_CLIENT_SECRET=your-client-secret
   ```

3. **Implementation**
   ```typescript
   // Get wearable data
   const data = await trpc.realtime.getWearableHealthData.query({
     deviceType: "google-fit"
   });
   ```

### Documentation
- https://developers.google.com/fit/rest/v1/overview

---

## 7. NDHM Integration (National Digital Health Mission)

### Setup Instructions

1. **Register with NDHM**
   - Visit https://ndhm.gov.in
   - Register as healthcare provider
   - Get API credentials

2. **Environment Configuration**
   ```
   NDHM_CLIENT_ID=your-client-id
   NDHM_CLIENT_SECRET=your-client-secret
   ```

3. **Implementation**
   ```typescript
   // Get health records
   const records = await trpc.realtime.getNDHMHealthRecords.query({
     ndhId: "user-ndhm-id"
   });
   ```

### Documentation
- https://ndhm.gov.in/developers

---

## 8. Ambulance Service Integration (Ziqitza)

### Setup Instructions

1. **Register with Ziqitza**
   - Contact: https://www.ziqitza.com
   - Get API credentials
   - Setup webhook for status updates

2. **Environment Configuration**
   ```
   AMBULANCE_API_KEY=your-api-key
   ```

3. **Implementation**
   ```typescript
   // Book ambulance
   const booking = await trpc.realtime.bookAmbulance.mutate({
     pickupLatitude: 28.6139,
     pickupLongitude: 77.209,
     emergencyType: "medical",
     patientPhone: "+91-9876543210"
   });
   ```

### Documentation
- Contact Ziqitza support for API documentation

---

## 9. Insurance API Integration

### ICICI Lombard

1. **Setup**
   - Register at https://www.icicilombard.com
   - Get API credentials
   - Enable policy APIs

2. **Configuration**
   ```
   ICICI_LOMBARD_API_KEY=your-api-key
   ```

### HDFC ERGO

1. **Setup**
   - Register at https://www.hdfcergo.com
   - Get API credentials
   - Enable policy APIs

2. **Configuration**
   ```
   HDFC_ERGO_API_KEY=your-api-key
   ```

---

## 10. Banking API Integration

### RazorpayX

1. **Setup**
   - Visit https://razorpayx.com
   - Register account
   - Get API credentials

2. **Configuration**
   ```
   RAZORPAYX_API_KEY=your-api-key
   ```

---

## Testing APIs

### Postman Collection

Import the provided Postman collection to test all APIs:

```bash
# Download collection
curl -O https://api.rapha.health/postman-collection.json

# Import in Postman
# File > Import > Select collection
```

### cURL Examples

**Search Hospitals**
```bash
curl -X GET "https://api.rapha.health/api/trpc/realtime.searchHospitals?latitude=28.6139&longitude=77.209&radiusKm=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Book Ambulance**
```bash
curl -X POST "https://api.rapha.health/api/trpc/realtime.bookAmbulance" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupLatitude": 28.6139,
    "pickupLongitude": 77.209,
    "emergencyType": "medical",
    "patientPhone": "+91-9876543210"
  }'
```

---

## Error Handling

### Common Error Codes

| Code | Message | Solution |
|------|---------|----------|
| 401 | Unauthorized | Check API credentials |
| 403 | Forbidden | Verify permissions |
| 404 | Not Found | Check endpoint URL |
| 429 | Rate Limited | Implement backoff |
| 500 | Server Error | Contact API provider |

### Retry Strategy

```typescript
async function retryRequest(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

---

## Production Checklist

- [ ] All API credentials configured
- [ ] Environment variables set correctly
- [ ] SSL certificates installed
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Backup strategy implemented
- [ ] Monitoring alerts setup
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Disaster recovery plan ready

---

## Support

For API integration issues:
- **Email**: api-support@rapha.health
- **Documentation**: https://docs.rapha.health/api
- **Community**: https://forum.rapha.health
- **Status Page**: https://status.rapha.health

---

## Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [NDHM Guidelines](https://ndhm.gov.in/)
- [Indian Healthcare Regulations](https://www.ipc.gov.in/)
