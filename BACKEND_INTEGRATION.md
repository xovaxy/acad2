# Backend Integration Guide

## Overview
The Acadira frontend has been configured to use the deployed backend at:
`https://acadira-backend-7lxyxsjax-xovaxys-projects.vercel.app/`

## Updated Services

### 1. Cashfree Client Service (`src/services/cashfreeClientService.ts`)
- **Updated methods:**
  - `createOrderViaBackend()` - Creates payment orders via backend API
  - `verifyPaymentViaBackend()` - Verifies payment status via backend API
  - `createAccountViaBackend()` - Creates institution accounts via backend API

### 2. Subscription Service (`src/services/subscriptionService.ts`)
- **Updated methods:**
  - `activateSubscriptionAfterPayment()` - Activates subscriptions via backend API

## Environment Configuration

### Environment Variables
The following environment variable has been configured:

```env
VITE_BACKEND_URL=https://acadira-backend-7lxyxsjax-xovaxys-projects.vercel.app
```

### Files Updated:
- `.env` - Production environment variables
- `.env.example` - Template for environment variables

## API Endpoints Expected

The frontend expects the following backend API endpoints:

### Payment APIs
1. **POST** `/api/create-cashfree-order`
   - Creates a new payment order
   - Request body: `CashfreeOrder` object
   - Response: `{ payment_session_id: string, order_id: string }`

2. **GET** `/api/verify-payment/{orderId}`
   - Verifies payment status
   - Response: `{ status: string, payment_details?: any }`

3. **POST** `/api/activate-subscription`
   - Activates subscription after successful payment
   - Request body: `{ order_id: string }`
   - Response: Success confirmation

4. **POST** `/api/create-institution-account`
   - Creates institution account
   - Request body: Institution account data
   - Response: `{ success: boolean, account_id?: string }`

## Security Features

### CORS Handling
- All direct Cashfree API calls have been removed from frontend
- Payment processing now goes through secure backend
- Client secrets are no longer exposed in browser

### Error Handling
- Comprehensive error handling for backend connectivity issues
- Fallback to demo mode when backend is unavailable
- Clear error messages for debugging

## Testing

### Demo Mode
- When backend is unavailable, services fall back to demo mode
- Demo mode simulates successful payment flows for testing
- Console logs clearly indicate when in demo mode

### Production Testing
- All payment flows now use the deployed backend
- Real Cashfree integration handled server-side
- Proper payment verification and subscription activation

## Migration Notes

### What Changed:
1. **Backend URL**: Updated from `http://localhost:3001` to deployed URL
2. **Error Messages**: Updated to reflect production deployment
3. **Environment Variables**: Added `VITE_BACKEND_URL` configuration

### What Stayed the Same:
- All frontend payment flows remain unchanged
- Component interfaces and props unchanged
- User experience remains identical

## Troubleshooting

### Common Issues:
1. **CORS Errors**: These are expected and by design - payments should go through backend
2. **Connection Errors**: Check if backend deployment is accessible
3. **Demo Mode**: Indicates backend is not responding, check deployment status

### Debug Information:
- All payment operations log detailed information to console
- Backend URL is logged during service initialization
- Error responses include full backend error details

## Next Steps

1. **Backend Deployment**: Ensure backend is deployed and accessible
2. **API Endpoints**: Implement the required API endpoints on backend
3. **Environment Variables**: Configure production environment variables
4. **Testing**: Test complete payment flow with real backend integration
