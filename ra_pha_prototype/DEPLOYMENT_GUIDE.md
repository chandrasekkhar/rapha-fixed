# RA-PHA Production Deployment Guide

## Overview

This guide provides instructions for deploying the RA-PHA (Revolutionary Advanced Personalized Healthcare Assistant) application as a production-ready real-time healthcare platform in India.

## Prerequisites

- Node.js 18+ and pnpm
- MySQL/TiDB database
- Environment variables configured
- Indian API credentials (Razorpay, SMS service, Firebase, etc.)

## Environment Configuration

Create a `.env` file in the project root with the following variables:

### Database
```
DATABASE_URL=mysql://user:password@host:port/database
```

### Authentication
```
JWT_SECRET=your-jwt-secret-key
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
```

### Indian Payment Gateway (Razorpay)
```
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

### SMS Service (Exotel/Twilio)
```
SMS_API_KEY=your-sms-api-key
SMS_API_SECRET=your-sms-api-secret
SMS_SENDER_ID=RAPHA
```

### Firebase (Push Notifications)
```
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_API_KEY=your-firebase-api-key
```

### Google Maps API
```
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Ambulance Services
```
AMBULANCE_API_KEY=your-ambulance-service-api-key
```

### Wearable Device Integration
```
FITBIT_CLIENT_ID=your-fitbit-client-id
FITBIT_CLIENT_SECRET=your-fitbit-client-secret
GOOGLE_FIT_CLIENT_ID=your-google-fit-client-id
GOOGLE_FIT_CLIENT_SECRET=your-google-fit-client-secret
```

### NDHM Integration
```
NDHM_CLIENT_ID=your-ndhm-client-id
NDHM_CLIENT_SECRET=your-ndhm-client-secret
```

### Monitoring & Analytics
```
SENTRY_DSN=your-sentry-dsn
LOGROCKET_APP_ID=your-logrocket-app-id
```

## Installation & Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Database
```bash
pnpm db:push
```

### 3. Build Application
```bash
pnpm build
```

### 4. Start Development Server
```bash
pnpm dev
```

## Real-Time Features

### Hospital & Pharmacy Search
- **Endpoint**: `/api/trpc/realtime.searchHospitals`
- **Method**: Query
- **Parameters**: `latitude`, `longitude`, `radiusKm`
- **Returns**: List of nearby hospitals with ratings, specializations, and contact info

### Ambulance Booking
- **Endpoint**: `/api/trpc/realtime.bookAmbulance`
- **Method**: Mutation
- **Parameters**: `pickupLatitude`, `pickupLongitude`, `emergencyType`, `patientPhone`
- **Returns**: Booking confirmation with driver details and ETA

### Razorpay Payment Integration
- **Endpoint**: `/api/trpc/realtime.createRazorpayOrder`
- **Method**: Mutation
- **Parameters**: `amount`, `description`
- **Returns**: Order ID and amount in paise

### SMS Notifications
- **Endpoint**: `/api/trpc/realtime.sendSMS`
- **Method**: Mutation
- **Parameters**: `phoneNumber`, `message`
- **Returns**: Success status

### Push Notifications
- **Endpoint**: `/api/trpc/realtime.sendPushNotification`
- **Method**: Mutation
- **Parameters**: `title`, `message`
- **Returns**: Success status

### Wearable Device Data
- **Endpoint**: `/api/trpc/realtime.getWearableHealthData`
- **Method**: Query
- **Parameters**: `deviceType` (fitbit | google-fit)
- **Returns**: Heart rate, steps, calories, sleep data

## Deployment Steps

### Option 1: Manus Hosting (Recommended)
1. Click "Publish" button in the Manus Management UI
2. Configure custom domain in Settings > Domains
3. Enable SSL/TLS
4. Configure environment variables in Settings > Secrets

### Option 2: Docker Deployment
```bash
# Build Docker image
docker build -t rapha-app .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL=mysql://... \
  -e RAZORPAY_KEY_ID=... \
  rapha-app
```

### Option 3: Traditional Server Deployment
1. Install Node.js on server
2. Clone repository
3. Install dependencies: `pnpm install`
4. Build: `pnpm build`
5. Start: `pnpm start`
6. Configure reverse proxy (Nginx/Apache)
7. Setup SSL certificate (Let's Encrypt)

## Security Best Practices

### 1. Environment Variables
- Never commit `.env` files to version control
- Use secure secret management (Vault, AWS Secrets Manager)
- Rotate API keys regularly

### 2. Database Security
- Enable SSL connections
- Use strong passwords
- Regular backups
- Implement row-level security

### 3. API Security
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- API key rotation

### 4. Authentication
- Enforce strong passwords
- Implement 2FA for sensitive operations
- Session timeout after 30 minutes
- Audit logging for all auth events

### 5. Data Protection
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- GDPR/HIPAA compliance measures
- Regular security audits

## Performance Optimization

### Frontend
- Enable code splitting
- Implement lazy loading
- Cache static assets
- Minimize bundle size

### Backend
- Database query optimization
- Implement caching (Redis)
- Connection pooling
- Load balancing

### Real-Time Services
- Batch API requests
- Implement request debouncing
- Use WebSocket for live updates
- Optimize geolocation queries

## Monitoring & Logging

### Application Monitoring
```bash
# Enable Sentry for error tracking
# Configure in client/src/main.tsx
```

### Log Management
- Centralized logging (ELK Stack, Datadog)
- Log rotation and retention
- Alert on critical errors

### Metrics
- Response time monitoring
- Error rate tracking
- API usage analytics
- User engagement metrics

## Backup & Disaster Recovery

### Database Backups
```bash
# Daily automated backups
mysqldump -u user -p database > backup_$(date +%Y%m%d).sql

# Store in S3 or cloud storage
aws s3 cp backup_*.sql s3://backup-bucket/
```

### Recovery Procedure
1. Restore from latest backup
2. Verify data integrity
3. Test application functionality
4. Monitor for issues

## Scaling Strategy

### Horizontal Scaling
- Load balancer (Nginx, HAProxy)
- Multiple application instances
- Distributed caching (Redis Cluster)
- Database replication

### Vertical Scaling
- Increase server resources
- Optimize database indexes
- Implement query caching
- Use CDN for static assets

## Maintenance Schedule

### Daily
- Monitor error logs
- Check system health
- Verify backups

### Weekly
- Review performance metrics
- Update dependencies
- Security patches

### Monthly
- Full system audit
- Performance optimization
- Capacity planning

## Troubleshooting

### Common Issues

**Issue**: Database connection timeout
```bash
# Solution: Check connection string and firewall rules
# Verify DATABASE_URL format
# Check network connectivity
```

**Issue**: Razorpay payment failures
```bash
# Solution: Verify API credentials
# Check test mode vs production mode
# Review payment logs
```

**Issue**: SMS not sending
```bash
# Solution: Verify SMS service credentials
# Check phone number format
# Review SMS provider logs
```

**Issue**: Location services not working
```bash
# Solution: Enable location permission in browser
# Verify Google Maps API key
# Check geolocation API availability
```

## Support & Resources

- **Documentation**: https://docs.rapha.health
- **API Reference**: https://api.rapha.health/docs
- **Community Forum**: https://forum.rapha.health
- **Support Email**: support@rapha.health
- **Emergency Hotline**: +91-1800-RAPHA-911

## Compliance & Regulations

### Indian Healthcare Regulations
- HIPAA compliance for US users
- GDPR compliance for EU users
- India's Digital Personal Data Protection Act
- Medical Device Rules 2017

### Data Privacy
- User consent management
- Data retention policies
- Right to be forgotten
- Data portability

## Version History

- **v1.0.0** (2025-12-09): Initial production release
  - Real-time hospital/pharmacy search
  - Ambulance booking integration
  - Razorpay payment gateway
  - SMS and push notifications
  - Wearable device integration

## Contact

For deployment assistance or questions, contact:
- **Email**: deployment@rapha.health
- **Phone**: +91-XXXX-RAPHA-1
- **Support Portal**: https://support.rapha.health
