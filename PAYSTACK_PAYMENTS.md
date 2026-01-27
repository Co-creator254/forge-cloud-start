# Paystack Payment Integration Guide

## Overview
This document lists all payment services, costs, and redirect URLs needed for Paystack integration with SokoConnect.

## App Deep Linking Configuration

### Android Package Name
```
com.sokoconnect.app
```

### Redirect URL Base (Production)
```
https://sokoconnect.co.ke/payment
```

### App Deep Link Scheme
```
sokoconnect://payment
```

---

## Complete Payment Services List

### 1. F2C SUBSCRIPTION BOXES

| Service | Description | Price (KES) | Price (USD) | Redirect URL | Deep Link |
|---------|-------------|-------------|-------------|--------------|-----------|
| F2C Basic 10kg | Weekly vegetable box (10kg) | 1,300 | $10 | /payment/success?plan=f2c-basic-10kg | sokoconnect://payment/f2c-basic-10kg |
| F2C Standard 25kg | Weekly mixed produce (25kg) | 2,600 | $20 | /payment/success?plan=f2c-standard-25kg | sokoconnect://payment/f2c-standard-25kg |
| F2C Premium 50kg | Weekly premium produce (50kg) | 3,900 | $30 | /payment/success?plan=f2c-premium-50kg | sokoconnect://payment/f2c-premium-50kg |
| F2C Family 75kg | Bi-weekly family box (75kg) | 5,200 | $40 | /payment/success?plan=f2c-family-75kg | sokoconnect://payment/f2c-family-75kg |
| F2C Bulk 90kg | Monthly bulk box (90kg) | 6,500 | $50 | /payment/success?plan=f2c-bulk-90kg | sokoconnect://payment/f2c-bulk-90kg |

### 2. BUSINESS MARKETING PACKAGES

| Service | Description | Price (KES) | Price (USD) | Redirect URL | Deep Link |
|---------|-------------|-------------|-------------|--------------|-----------|
| Marketing Starter | Basic marketing (1 month) | 1,300 | $10 | /payment/success?plan=marketing-starter | sokoconnect://payment/marketing-starter |
| Marketing Professional | Standard marketing (3 months) | 2,600 | $20 | /payment/success?plan=marketing-professional | sokoconnect://payment/marketing-professional |
| Marketing Enterprise | Premium marketing (6 months) | 3,900 | $30 | /payment/success?plan=marketing-enterprise | sokoconnect://payment/marketing-enterprise |

### 3. PREMIUM LISTINGS

| Service | Description | Price (KES) | Price (USD) | Redirect URL | Deep Link |
|---------|-------------|-------------|-------------|--------------|-----------|
| Featured Product (7 days) | Homepage featured listing | 500 | $4 | /payment/success?plan=featured-7d | sokoconnect://payment/featured-7d |
| Featured Product (30 days) | Homepage featured listing | 1,500 | $12 | /payment/success?plan=featured-30d | sokoconnect://payment/featured-30d |
| Top Search (7 days) | Appear first in search | 800 | $6 | /payment/success?plan=top-search-7d | sokoconnect://payment/top-search-7d |
| Top Search (30 days) | Appear first in search | 2,500 | $19 | /payment/success?plan=top-search-30d | sokoconnect://payment/top-search-30d |
| Spotlight Badge | Verified seller badge | 1,000 | $8 | /payment/success?plan=spotlight-badge | sokoconnect://payment/spotlight-badge |

### 4. TRAINING COURSES

| Service | Description | Price (KES) | Price (USD) | Redirect URL | Deep Link |
|---------|-------------|-------------|-------------|--------------|-----------|
| Basic Farming Course | Online course (self-paced) | 1,500 | $12 | /payment/success?plan=course-basic | sokoconnect://payment/course-basic |
| Advanced Agribusiness | Advanced training (8 weeks) | 5,000 | $38 | /payment/success?plan=course-advanced | sokoconnect://payment/course-advanced |
| Export Certification | Export readiness training | 8,000 | $62 | /payment/success?plan=course-export | sokoconnect://payment/course-export |
| Organic Certification | Organic farming course | 3,500 | $27 | /payment/success?plan=course-organic | sokoconnect://payment/course-organic |

### 5. COOPERATIVE SERVICES

| Service | Description | Price (KES) | Price (USD) | Redirect URL | Deep Link |
|---------|-------------|-------------|-------------|--------------|-----------|
| Cooperative Registration | New cooperative setup | 5,000 | $38 | /payment/success?plan=coop-registration | sokoconnect://payment/coop-registration |
| Annual Membership | Yearly cooperative fee | 2,000 | $15 | /payment/success?plan=coop-annual | sokoconnect://payment/coop-annual |
| Premium Coop Tools | Advanced management tools | 3,000 | $23 | /payment/success?plan=coop-premium | sokoconnect://payment/coop-premium |

### 6. LOGISTICS & DELIVERY

| Service | Description | Price (KES) | Price (USD) | Redirect URL | Deep Link |
|---------|-------------|-------------|-------------|--------------|-----------|
| Local Delivery (0-20km) | Same-day delivery | 300 | $2 | /payment/success?plan=delivery-local | sokoconnect://payment/delivery-local |
| Regional Delivery (20-100km) | Next-day delivery | 800 | $6 | /payment/success?plan=delivery-regional | sokoconnect://payment/delivery-regional |
| National Delivery (100km+) | 2-3 days delivery | 1,500 | $12 | /payment/success?plan=delivery-national | sokoconnect://payment/delivery-national |
| Cold Chain Delivery | Temperature controlled | 2,500 | $19 | /payment/success?plan=delivery-coldchain | sokoconnect://payment/delivery-coldchain |
| Bulk Transport (1+ ton) | Commercial transport | 5,000 | $38 | /payment/success?plan=delivery-bulk | sokoconnect://payment/delivery-bulk |

### 7. STORAGE & WAREHOUSING

| Service | Description | Price (KES/month) | Price (USD) | Redirect URL | Deep Link |
|---------|-------------|-------------------|-------------|--------------|-----------|
| Cold Storage (per pallet) | Refrigerated storage | 3,000 | $23 | /payment/success?plan=storage-cold | sokoconnect://payment/storage-cold |
| Dry Storage (per pallet) | Ambient warehouse | 1,500 | $12 | /payment/success?plan=storage-dry | sokoconnect://payment/storage-dry |
| Fumigation Service | Pest control treatment | 500 | $4 | /payment/success?plan=storage-fumigation | sokoconnect://payment/storage-fumigation |

### 8. EXPORT SERVICES

| Service | Description | Price (KES) | Price (USD) | Redirect URL | Deep Link |
|---------|-------------|-------------|-------------|--------------|-----------|
| Export Documentation | Paperwork assistance | 3,000 | $23 | /payment/success?plan=export-docs | sokoconnect://payment/export-docs |
| Phytosanitary Certificate | Plant health cert | 2,500 | $19 | /payment/success?plan=export-phyto | sokoconnect://payment/export-phyto |
| Quality Inspection | Third-party inspection | 5,000 | $38 | /payment/success?plan=export-inspect | sokoconnect://payment/export-inspect |
| Export Matchmaking | Buyer connection service | 10,000 | $77 | /payment/success?plan=export-match | sokoconnect://payment/export-match |

### 9. EQUIPMENT MARKETPLACE

| Service | Description | Price (KES) | Price (USD) | Redirect URL | Deep Link |
|---------|-------------|-------------|-------------|--------------|-----------|
| Equipment Listing Fee | Post equipment for sale | 500 | $4 | /payment/success?plan=equip-listing | sokoconnect://payment/equip-listing |
| Equipment Rental Fee | 5% of rental value | Variable | Variable | /payment/success?plan=equip-rental | sokoconnect://payment/equip-rental |
| Equipment Insurance | Monthly coverage | 2,000 | $15 | /payment/success?plan=equip-insurance | sokoconnect://payment/equip-insurance |

### 10. CARBON CREDITS

| Service | Description | Price (KES) | Price (USD) | Redirect URL | Deep Link |
|---------|-------------|-------------|-------------|--------------|-----------|
| Carbon Audit | Farm carbon assessment | 5,000 | $38 | /payment/success?plan=carbon-audit | sokoconnect://payment/carbon-audit |
| Carbon Certificate | Annual certification | 8,000 | $62 | /payment/success?plan=carbon-cert | sokoconnect://payment/carbon-cert |
| Carbon Offset (per ton) | Buy carbon credits | 3,000 | $23 | /payment/success?plan=carbon-offset | sokoconnect://payment/carbon-offset |

### 11. AUCTION SERVICES

| Service | Description | Price (KES) | Price (USD) | Redirect URL | Deep Link |
|---------|-------------|-------------|-------------|--------------|-----------|
| Auction Listing Fee | List item for auction | 200 | $2 | /payment/success?plan=auction-list | sokoconnect://payment/auction-list |
| Auction Commission | 3% of final sale | Variable | Variable | /payment/success?plan=auction-commission | sokoconnect://payment/auction-commission |
| Premium Auction Slot | Featured auction | 1,000 | $8 | /payment/success?plan=auction-premium | sokoconnect://payment/auction-premium |

### 12. INSURANCE SERVICES

| Service | Description | Price (KES) | Price (USD) | Redirect URL | Deep Link |
|---------|-------------|-------------|-------------|--------------|-----------|
| Crop Insurance (per acre) | Seasonal coverage | 2,500 | $19 | /payment/success?plan=insurance-crop | sokoconnect://payment/insurance-crop |
| Livestock Insurance (per head) | Animal coverage | 1,500 | $12 | /payment/success?plan=insurance-livestock | sokoconnect://payment/insurance-livestock |
| Weather Index Insurance | Climate protection | 3,000 | $23 | /payment/success?plan=insurance-weather | sokoconnect://payment/insurance-weather |

### 13. VERIFICATION & BADGES

| Service | Description | Price (KES) | Price (USD) | Redirect URL | Deep Link |
|---------|-------------|-------------|-------------|--------------|-----------|
| Verified Farmer Badge | Identity verification | 500 | $4 | /payment/success?plan=badge-farmer | sokoconnect://payment/badge-farmer |
| Verified Exporter Badge | Export verification | 2,000 | $15 | /payment/success?plan=badge-exporter | sokoconnect://payment/badge-exporter |
| Verified Cooperative | Coop verification | 3,000 | $23 | /payment/success?plan=badge-coop | sokoconnect://payment/badge-coop |
| Premium Seller Status | Top seller badge | 5,000 | $38 | /payment/success?plan=badge-premium | sokoconnect://payment/badge-premium |

---

## Paystack Webhook Configuration

### Webhook URL
```
https://sokoconnect.co.ke/api/paystack/webhook
```

### Events to Subscribe
- `charge.success` - Payment successful
- `transfer.success` - Payout completed
- `transfer.failed` - Payout failed
- `subscription.create` - New subscription
- `subscription.disable` - Subscription cancelled
- `invoice.payment_failed` - Invoice payment failed

### Webhook Secret
Store in environment as: `PAYSTACK_WEBHOOK_SECRET`

---

## Android Deep Link Configuration

### AndroidManifest.xml Intent Filter
```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="sokoconnect" android:host="payment" />
</intent-filter>

<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="sokoconnect.co.ke" android:pathPrefix="/payment" />
</intent-filter>
```

### Asset Links File (/.well-known/assetlinks.json)
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.sokoconnect.app",
    "sha256_cert_fingerprints": ["YOUR_APP_SIGNING_KEY_FINGERPRINT"]
  }
}]
```

---

## Summary of Payment Links Needed from Paystack

Create the following payment links in Paystack Dashboard:

1. **F2C Subscriptions (5 links)**: KES 1,300, 2,600, 3,900, 5,200, 6,500
2. **Marketing Packages (3 links)**: KES 1,300, 2,600, 3,900
3. **Premium Listings (5 links)**: KES 500, 1,500, 800, 2,500, 1,000
4. **Training Courses (4 links)**: KES 1,500, 5,000, 8,000, 3,500
5. **Cooperative Services (3 links)**: KES 5,000, 2,000, 3,000
6. **Logistics (5 links)**: KES 300, 800, 1,500, 2,500, 5,000
7. **Storage (3 links)**: KES 3,000, 1,500, 500
8. **Export Services (4 links)**: KES 3,000, 2,500, 5,000, 10,000
9. **Equipment (3 links)**: KES 500, Variable, 2,000
10. **Carbon Credits (3 links)**: KES 5,000, 8,000, 3,000
11. **Auctions (3 links)**: KES 200, Variable, 1,000
12. **Insurance (3 links)**: KES 2,500, 1,500, 3,000
13. **Verification Badges (4 links)**: KES 500, 2,000, 3,000, 5,000

**Total: ~48 payment links needed**

---

## Exchange Rate Note
Using approximate rate: **1 USD = 130 KES**

Prices should be reviewed and updated periodically based on current exchange rates.
