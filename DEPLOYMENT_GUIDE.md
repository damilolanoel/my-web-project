# Configuration & Deployment Guide

## Environment Setup

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Installation
```bash
git clone https://github.com/damilolanoel/my-web-project.git
cd my-web-project
npm install
```

### Development
```bash
npm run dev
# Opens at http://localhost:5173
```

### Production Build
```bash
npm run build
npm run preview
```

## Project Structure
```
src/
├── components/          # React components
│   ├── Dashboard.tsx
│   ├── UserDashboard.tsx
│   ├── Contributions.tsx
│   ├── Payouts.tsx
│   ├── Participants.tsx
│   ├── Schedule.tsx
│   ├── Reports.tsx
│   ├── Settings.tsx
│   ├── Help.tsx         # NEW: Help & Support
│   ├── NotificationPanel.tsx  # NEW: Notifications
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Login.tsx
│   └── ...
├── contexts/            # React Context providers
│   └── NotificationContext.tsx  # NEW: Notification state management
├── utils/               # Utility functions
│   ├── cn.ts
│   ├── notifications.ts # NEW: Notification helpers
│   └── export.ts        # NEW: CSV export utilities
├── App.tsx              # Main app component
├── main.tsx
├── index.css
├── types.ts
└── data.ts
```

## Key Features

### 1. Authentication & Security
- Password hashing with bcryptjs
- Secure password verification
- Session management via localStorage
- Admin and user role differentiation

### 2. Notification System
- Real-time notifications
- Persistent notification history
- Categorized notification types
- Mark as read functionality

### 3. Payment Processing
- Mock payment gateway integration
- Payment confirmation workflow
- Status tracking (pending, paid, overdue)
- Automatic notification on completion

### 4. Data Export
- CSV export for contributions
- CSV export for payouts
- CSV export for participants
- Admin-only functionality

### 5. Help & Support
- Searchable FAQs (8 categories)
- Contact form integration
- Direct support information
- Quick links to policies

## Configuration

### Adding Environment Variables
Create `.env` file in project root:
```
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Bookey Thrift Bank
VITE_APP_VERSION=1.0.0
```

### Customizing Payment Processing
Edit `src/components/UserDashboard.tsx` - `PaymentModal` component:
```typescript
// Replace mock payment with real integration
const handlePayment = async () => {
  // Integrate with Stripe, PayPal, etc.
  const response = await processPayment({
    amount: contribution.totalPaid,
    paymentMethod: 'card',
    participantId: participantId,
  });
};
```

## Data Management

### Storage
- localStorage for client-side state
- Contributions and payouts stored in `bookey-contributions` and `bookey-payouts`
- Notifications stored in `bookey-notifications`
- Users stored in `bookey-user`

### Resetting Data
In Settings page, click "Reset Data" button (admin only)

## Performance Optimization

### Current Metrics
- Initial Load Time: ~2.5s
- Bundle Size: 794.53 KB (gzipped: 221.71 KB)
- Lighthouse Score: 85+

### Recommendations for Improvement
1. Implement code splitting
2. Add image lazy loading
3. Enable gzip compression
4. Use CDN for static assets
5. Implement service workers

## Security Best Practices

### Implemented
- ✅ Password hashing (bcryptjs)
- ✅ Client-side validation
- ✅ Role-based access control
- ✅ Secure session management

### To Implement (Backend)
- API rate limiting
- CORS configuration
- HTTPS enforcement
- SQL injection prevention
- CSRF token validation
- XSS protection headers

## Deployment Options

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=docs
```

### Option 3: GitHub Pages
```bash
# Already configured in vite.config.ts
npm run build
git add docs/
git commit -m "Deploy to GitHub Pages"
git push
```

## Database Integration (Future)

### PostgreSQL Example
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contributions (
  id UUID PRIMARY KEY,
  participant_id UUID,
  month INTEGER,
  amount DECIMAL(10, 2),
  status VARCHAR(50),
  created_at TIMESTAMP,
  FOREIGN KEY (participant_id) REFERENCES users(id)
);
```

## API Integration Example

### RESTful API Pattern
```typescript
// src/api/contributions.ts
export async function getContributions() {
  const response = await fetch('/api/contributions');
  return response.json();
}

export async function updateContribution(id: string, data: any) {
  const response = await fetch(`/api/contributions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

## Monitoring & Logging

### Recommended Services
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics 4
- **Performance**: Vercel Analytics
- **Logging**: LogRocket or Datadog

### Basic Monitoring Setup
```typescript
// src/utils/monitoring.ts
export function captureException(error: Error) {
  console.error(error);
  // Send to Sentry
}

export function trackEvent(event: string, properties?: any) {
  console.log(`Event: ${event}`, properties);
  // Send to analytics
}
```

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules
npm install
npm run build
```

### Performance Issues
```bash
# Analyze bundle size
npm install webpack-bundle-analyzer
# Check in vite.config.ts
```

### Notification Not Working
- Check browser console for errors
- Verify NotificationProvider wraps App
- Check localStorage for `bookey-notifications`

## Support Resources
- GitHub Issues: https://github.com/damilolanoel/my-web-project/issues
- Email: support@bookeythrift.com
- Documentation: See PROFESSIONAL_IMPLEMENTATION_REPORT.md

## Version History
- **v1.0.0** (Current): Initial release with payment, notifications, help, and export features
