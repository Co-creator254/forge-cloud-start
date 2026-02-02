# Paystack Payment Integration
**Status:** ✅ FULLY CONFIGURED | Edge Functions Deployed

## Environment Secrets Configured
- ✅ `PAYSTACK_SECRET_KEY` - Added to Supabase
- ✅ `PAYSTACK_WEBHOOK_SECRET` - Added to Supabase

## Edge Functions Deployed
- ✅ `paystack-initialize` - Initialize payments
- ✅ `paystack-verify` - Verify payment status
- ✅ `paystack-webhook` - Handle Paystack webhook events

## App Configuration

### Android Package
```
com.sokoconnect.app
```

### Deep Link Scheme
```
sokoconnect://payment/{plan-id}
```

### Production Redirect Base
```
https://sokoconnect.co.ke/payment/success?plan={plan-id}
```

---

## PAYMENT SERVICES

### 1. F2C Subscription Boxes (Farm-to-Consumer)

| Plan | Description | Price (KES) | Deep Link |
|------|-------------|-------------|-----------|
| f2c-basic | Weekly Box 10kg | 1,500 | sokoconnect://payment/f2c-basic |
| f2c-standard | Weekly Box 25kg | 3,000 | sokoconnect://payment/f2c-standard |
| f2c-premium | Weekly Box 50kg | 4,500 | sokoconnect://payment/f2c-premium |
| f2c-family | Bi-weekly Box 75kg | 6,000 | sokoconnect://payment/f2c-family |

### 2. Paid Event Tickets (Optional)

| Type | Description | Price (KES) | Deep Link |
|------|-------------|-------------|-----------|
| event-ticket | Event entry fee | Variable | sokoconnect://payment/event/{event-id} |

---

## Edge Function Endpoints

### Initialize Payment
```
POST /functions/v1/paystack-initialize
Content-Type: application/json

{
  "email": "user@example.com",
  "amount": 1500,
  "metadata": {
    "user_id": "uuid",
    "plan_id": "f2c-basic",
    "subscription_type": "f2c"
  }
}
```

### Verify Payment
```
GET /functions/v1/paystack-verify?reference=SOKO-xxx
```

### Webhook (Paystack → App)
```
POST /functions/v1/paystack-webhook
x-paystack-signature: {signature}
```

---

## Webhook Configuration

### Webhook URL
```
https://[YOUR_SUPABASE_PROJECT].supabase.co/functions/v1/paystack-webhook
```

### Events Handled
- `charge.success` - Payment completed
- `subscription.create` - New subscription
- `subscription.disable` - Subscription cancelled
- `subscription.not_renew` - Renewal failed

---

## Android Deep Link Setup

### AndroidManifest.xml
```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="sokoconnect" android:host="payment" />
</intent-filter>
```
