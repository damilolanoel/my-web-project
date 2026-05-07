# Bookey Thrift Bank - Backend API

A robust REST API for the Bookey Thrift Bank application, built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Payment Processing**: Stripe integration for secure payment processing
- **Real-time Notifications**: Automated notification system for payments and alerts
- **Data Management**: Comprehensive CRUD operations for users, contributions, and payouts
- **Security**: Rate limiting, CORS, helmet security headers, input validation
- **Email Notifications**: SMTP-based email notifications for critical alerts

## 🛠️ Technology Stack

```
Backend:
├── Node.js 18+           - Runtime
├── Express.js 4.18+      - Web Framework
├── TypeScript 5.3+       - Type Safety
├── MongoDB 8.0+          - Database
├── Mongoose 8.0+         - ODM
├── JWT 9.0+              - Authentication
├── bcryptjs 2.4+         - Password Hashing
├── Stripe 14.17+         - Payment Processing
├── Nodemailer 6.9+       - Email Service
├── Express Validator     - Input Validation
└── Helmet/CORS           - Security
```

## 📋 Prerequisites

- Node.js 18 or higher
- MongoDB (local or cloud instance)
- Stripe account for payment processing
- SMTP email service for notifications

## 🔧 Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Development:**
   ```bash
   npm run dev
   ```

6. **Production:**
   ```bash
   npm run build
   npm start
   ```

## ⚙️ Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | No (default: 5000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_EXPIRE` | JWT expiration time | No (default: 30d) |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes (for payments) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes (for webhooks) |
| `EMAIL_FROM` | Sender email address | Yes (for notifications) |
| `SMTP_HOST` | SMTP server host | Yes (for notifications) |
| `SMTP_PORT` | SMTP server port | Yes (for notifications) |
| `SMTP_USER` | SMTP username | Yes (for notifications) |
| `SMTP_PASS` | SMTP password/app password | Yes (for notifications) |

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

### Protected Endpoints

All endpoints below require `Authorization: Bearer <token>` header.

#### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

#### Contributions
- `GET /api/contributions` - Get contributions
- `GET /api/contributions/:id` - Get contribution by ID
- `POST /api/contributions` - Create contribution (Admin only)
- `PUT /api/contributions/:id` - Update contribution (Admin only)
- `DELETE /api/contributions/:id` - Delete contribution (Admin only)
- `GET /api/contributions/stats/summary` - Get contribution statistics (Admin only)

#### Payouts
- `GET /api/payouts` - Get payouts
- `GET /api/payouts/:id` - Get payout by ID
- `POST /api/payouts` - Create payout (Admin only)
- `PUT /api/payouts/:id` - Update payout (Admin only)
- `DELETE /api/payouts/:id` - Delete payout (Admin only)
- `GET /api/payouts/stats/summary` - Get payout statistics (Admin only)

#### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/history` - Get payment history
- `POST /api/payments/webhook` - Stripe webhook handler

#### Notifications
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/:id` - Get notification by ID
- `POST /api/notifications` - Create notification (Admin only)
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/mark-all-read` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/stats` - Get notification statistics

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend origin
- **Helmet**: Security headers
- **Input Validation**: Comprehensive validation with express-validator
- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin/User permissions

## 📧 Email Notifications

The system sends automated emails for:
- Payment reminders (3 days before due date)
- Overdue payment alerts
- Payment success confirmations
- Payout notifications
- System alerts

## 💳 Payment Integration

### Stripe Setup
1. Create a Stripe account
2. Get your secret key and webhook secret
3. Configure webhook endpoint: `https://yourdomain.com/api/payments/webhook`
4. Listen for `payment_intent.succeeded` events

### Payment Flow
1. Frontend requests payment intent
2. Backend creates Stripe payment intent
3. Frontend confirms payment with Stripe
4. Webhook updates contribution status
5. Notification is sent to user

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📊 Monitoring

- Health check endpoint: `GET /api/health`
- Morgan logging for HTTP requests
- Error handling with detailed logging

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set up Stripe live keys
4. Configure SMTP for production email

### Build Process
```bash
npm run build
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support, please contact:
- Email: support@bookeythrift.com
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

## 🔄 API Versioning

Current API version: v1
All endpoints are prefixed with `/api/`

Future versions will use `/api/v2/`, etc.