# 💳 Payment Gateway Integration Guide

## Overview

Your movie booking app is now ready for payment gateway integration! Here are the recommended options:

## 🏆 **Recommended: Stripe (International)**

### Why Stripe?
- ✅ **Easy Integration**: Simple API and excellent documentation
- ✅ **Global Support**: Works worldwide
- ✅ **Multiple Payment Methods**: Cards, UPI, wallets, etc.
- ✅ **Security**: PCI DSS compliant
- ✅ **Developer Friendly**: Great React components

### Integration Steps:

1. **Install Stripe**
   ```bash
   npm install @stripe/stripe-js @stripe/react-stripe-js
   ```

2. **Add Environment Variables**
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
   VITE_STRIPE_SECRET_KEY=sk_test_your_stripe_key
   ```

3. **Create Payment Component**
   ```tsx
   // src/components/PaymentForm.tsx
   import { loadStripe } from '@stripe/stripe-js';
   import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

   const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

   export const PaymentForm = ({ amount, bookingId }) => {
     const stripe = useStripe();
     const elements = useElements();

     const handleSubmit = async (event) => {
       event.preventDefault();
       
       if (!stripe || !elements) return;

       const { error, paymentMethod } = await stripe.createPaymentMethod({
         type: 'card',
         card: elements.getElement(CardElement),
       });

       if (error) {
         console.error('[error]', error);
       } else {
         // Send to your backend
         const response = await fetch('/api/confirm-payment', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             payment_method_id: paymentMethod.id,
             amount,
             booking_id: bookingId
           }),
         });
       }
     };

     return (
       <form onSubmit={handleSubmit}>
         <CardElement />
         <button type="submit" disabled={!stripe}>
           Pay ₹{amount}
         </button>
       </form>
     );
   };
   ```

## 🇮🇳 **India: Razorpay (Recommended for India)**

### Why Razorpay?
- ✅ **India Focused**: UPI, cards, wallets, net banking
- ✅ **Low Transaction Fees**: 2% + GST
- ✅ **Easy Integration**: Simple checkout
- ✅ **Great Support**: Indian customer support

### Integration Steps:

1. **Install Razorpay**
   ```bash
   npm install razorpay
   ```

2. **Add Environment Variables**
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
   VITE_RAZORPAY_KEY_SECRET=your_secret_key
   ```

3. **Create Payment Component**
   ```tsx
   // src/components/RazorpayPayment.tsx
   import { useEffect } from 'react';

   declare global {
     interface Window {
       Razorpay: any;
     }
   }

   export const RazorpayPayment = ({ amount, bookingId, customerName, customerEmail, customerPhone }) => {
     const handlePayment = async () => {
       const options = {
         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
         amount: amount * 100, // Razorpay expects amount in paise
         currency: 'INR',
         name: 'Sheshnag Cinema',
         description: `Booking ${bookingId}`,
         image: '/logo.png',
         order_id: '', // Will be generated from backend
         handler: function (response: any) {
           // Payment successful
           console.log('Payment ID:', response.razorpay_payment_id);
           // Update booking status to 'paid'
         },
         prefill: {
           name: customerName,
           email: customerEmail,
           contact: customerPhone
         },
         theme: {
           color: '#1e3a8a'
         }
       };

       const rzp = new window.Razorpay(options);
       rzp.open();
     };

     useEffect(() => {
       // Load Razorpay script
       const script = document.createElement('script');
       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
       script.async = true;
       document.body.appendChild(script);

       return () => {
         document.body.removeChild(script);
       };
     }, []);

     return (
       <button 
         onClick={handlePayment}
         className="w-full bg-gradient-to-r from-deep-blue to-primary text-white py-3 rounded-lg"
       >
         Pay ₹{amount} with Razorpay
       </button>
     );
   };
   ```

## 🔧 **Backend Integration (Required)**

### Option 1: Vercel Serverless Functions

Create `api/confirm-payment.ts`:
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { payment_method_id, amount, booking_id } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'inr',
      payment_method: payment_method_id,
      confirm: true,
      return_url: `${req.headers.origin}/booking-success`,
    });

    // Update booking status to 'paid'
    // UpdateBookingStatus(booking_id, 'paid');

    res.status(200).json({ 
      success: true, 
      payment_intent_id: paymentIntent.id 
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(400).json({ 
      success: false, 
      error: 'Payment failed' 
    });
  }
}
```

### Option 2: Netlify Functions

Create `netlify/functions/confirm-payment.js`:
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { payment_method_id, amount, booking_id } = JSON.parse(event.body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'inr',
      payment_method: payment_method_id,
      confirm: true,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        payment_intent_id: paymentIntent.id 
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        success: false, 
        error: 'Payment failed' 
      }),
    };
  }
};
```

## 🚀 **Quick Implementation Steps**

### 1. Choose Your Gateway
- **International**: Stripe
- **India Only**: Razorpay
- **Both**: Start with Stripe, add Razorpay later

### 2. Set Up Account
- Create account on chosen platform
- Get API keys
- Add to environment variables

### 3. Integrate Frontend
- Install SDK
- Create payment component
- Add to booking flow

### 4. Set Up Backend
- Create serverless function
- Handle payment confirmation
- Update booking status

### 5. Test & Deploy
- Test with test keys
- Deploy to production
- Switch to live keys

## 💰 **Pricing Comparison**

| Gateway | Setup Fee | Transaction Fee | Currency |
|---------|-----------|----------------|----------|
| Stripe | Free | 2.9% + ₹2 | INR, USD |
| Razorpay | Free | 2% + GST | INR |
| PayU | Free | 2% + GST | INR |
| Instamojo | Free | 2% + ₹3 | INR |

## 🔒 **Security Best Practices**

1. **Never expose secret keys** in frontend code
2. **Use HTTPS** for all payment requests
3. **Validate payments** on backend
4. **Store payment IDs** with bookings
5. **Handle webhooks** for payment status updates

## 📞 **Support**

- **Stripe**: Excellent documentation and support
- **Razorpay**: Great Indian support team
- **Both**: Active developer communities

## 🎯 **Next Steps**

1. Choose your preferred payment gateway
2. Set up developer account
3. Get API keys
4. Follow integration steps above
5. Test thoroughly
6. Deploy to production

Your app is now ready for real payments! 🎉
