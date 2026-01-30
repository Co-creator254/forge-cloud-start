# Paystack Payment Integration
**Status:** Secrets Configured ✅ | **Payments:** Awaiting Paystack Links

## Environment Secrets Configured
- ✅ `PAYSTACK_SECRET_KEY` - Added to Supabase
- ✅ `PAYSTACK_WEBHOOK_SECRET` - Added to Supabase

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

## ACTUAL PAYMENT SERVICES NEEDED

### 1. F2C Subscription Boxes (Farm-to-Consumer)
These are the only subscription payments currently in the app:

| Plan | Description | Price (KES) | Deep Link |
|------|-------------|-------------|-----------|
| f2c-basic | Weekly Box 10kg | TBD | sokoconnect://payment/f2c-basic |
| f2c-standard | Weekly Box 25kg | TBD | sokoconnect://payment/f2c-standard |
| f2c-premium | Weekly Box 50kg | TBD | sokoconnect://payment/f2c-premium |
| f2c-family | Bi-weekly Box 75kg | TBD | sokoconnect://payment/f2c-family |

### 2. Paid Event Tickets (Optional)
Some agricultural events may have entry fees:

| Type | Description | Price (KES) | Deep Link |
|------|-------------|-------------|-----------|
| event-ticket | Event entry fee | Variable | sokoconnect://payment/event/{event-id} |

### 3. Future Consideration (Not Implemented Yet)
- Premium listings
- Verified badges
- Training courses

---

## Webhook Configuration

### Webhook URL
```
https://[YOUR_SUPABASE_PROJECT].supabase.co/functions/v1/paystack-webhook
```

### Events to Subscribe
- `charge.success` - Payment completed
- `subscription.create` - New subscription
- `subscription.disable` - Subscription cancelled

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

---

## NEXT STEPS
1. Create F2C subscription products in Paystack Dashboard
2. Generate payment links for each subscription tier
3. Update this document with actual prices and Paystack link IDs
4. Create `paystack-webhook` edge function to handle payments
