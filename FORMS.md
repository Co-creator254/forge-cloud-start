# SokoConnect Forms Documentation
**Last Updated:** January 2026  
**Status:** HONEST ASSESSMENT

## ⚠️ IMPORTANT: VERIFICATION STATUS

This document provides an ACCURATE mapping of forms to database tables.

| Status | Meaning |
|--------|---------|
| ✅ Connected | Form exists + Table exists + Confirmed working |
| 🔄 Table Name Differs | Form uses different table name than expected |
| ❌ Missing Table | Form exists but no corresponding table |
| ⏳ Pending | Needs payment integration to complete |

---

## 📋 FORMS BY FEATURE AREA

### 🔐 Authentication & Profile (3 forms)
| # | Form | Table | Status |
|---|------|-------|--------|
| 1 | Login Form | auth.users | ✅ Connected |
| 2 | Registration Form | auth.users, profiles | ✅ Connected |
| 3 | Profile Edit Form | profiles | ✅ Connected |

### 🌾 Farmer Portal (8 forms)
| # | Form | Table | Status |
|---|------|-------|--------|
| 4 | Land Parcel Form | land_parcels | ✅ Connected |
| 5 | Crop Tracking Form | crops | ✅ Connected |
| 6 | Animal Form | animals | ✅ Connected |
| 7 | Inventory Form | farm_inventory | 🔄 Uses farm_inventory |
| 8 | Transaction Form | farm_transactions | 🔄 Uses farm_transactions |
| 9 | Budget Form | farm_budgets | ✅ Connected |
| 10 | Harvest Form | - | ❌ No harvests table |
| 11 | Farm Statistics Form | farm_statistics | ✅ Connected |

### 🛒 Marketplace (12 forms)
| # | Form | Table | Status |
|---|------|-------|--------|
| 12 | Product Listing Form | products, marketplace_listings | ✅ Connected |
| 13 | Buy Request Form | buy_requests | ✅ Connected |
| 14 | Barter Listing Form | barter_listings | ✅ Connected |
| 15 | Equipment Listing Form | equipment_marketplace | ✅ Connected |
| 16 | Bulk Order Form | bulk_orders | ✅ Connected |
| 17 | Bulk Order Bid Form | bulk_order_bids | ✅ Connected |
| 18 | Reverse Auction Form | reverse_bulk_auctions | 🔄 Uses reverse_bulk_auctions |
| 19 | Reverse Auction Bid Form | reverse_auction_bids | ✅ Connected |
| 20 | Price Report Form | - | ❌ No pricing_reports table |
| 21 | F2C Subscription Form | f2c_subscriptions | ⏳ Paystack pending |
| 22 | Market Linkage Form | market_linkages | ✅ Connected |
| 23 | Contract Farming Application | contract_farming | 🔄 Uses contract_farming table |

### 👥 Cooperatives (8 forms)
| # | Form | Table | Status |
|---|------|-------|--------|
| 24 | Cooperative Registration Form | cooperative_groups | ✅ Connected |
| 25 | Membership Application Form | group_members | 🔄 Uses group_members |
| 26 | Group Order Form | group_input_orders | ✅ Connected |
| 27 | Loan Application Form | cooperative_loans | ✅ Connected |
| 28 | Loan Repayment Form | loan_repayments | ✅ Connected |
| 29 | Dividend Declaration Form | cooperative_dividends | ✅ Connected |
| 30 | Voting Form | cooperative_votes | ✅ Connected |
| 31 | Group Message Form | group_messages | ✅ Connected |

### 🌍 Export & Trade (6 forms)
| # | Form | Table | Status |
|---|------|-------|--------|
| 32 | Farmer-Exporter Collaboration | farmer_exporter_collaborations | ✅ Connected |
| 33 | Export Opportunity Form | export_opportunities | ✅ Connected |
| 34 | Export Application Form | export_opportunity_applications | ✅ Connected |
| 35 | Batch Tracking Form | batch_tracking | ✅ Connected |
| 36 | Transportation Request Form | transportation_requests | ✅ Connected |
| 37 | Warehouse Booking Form | warehouse_bookings | ✅ Connected |

### 🌱 Sustainability (4 forms)
| # | Form | Table | Status |
|---|------|-------|--------|
| 38 | Carbon Emission Form | carbon_emissions | ✅ Connected |
| 39 | Carbon Offset Project Form | carbon_offset_projects | ✅ Connected |
| 40 | Carbon Forum Post Form | carbon_forum_posts | ✅ Connected |
| 41 | Carbon Forum Comment Form | carbon_forum_comments | ✅ Connected |

### 📦 Farm Inputs (6 forms)
| # | Form | Table | Status |
|---|------|-------|--------|
| 42 | Supplier Registration Form | farm_input_suppliers | ✅ Connected |
| 43 | Product Catalog Form | farm_input_products | ✅ Connected |
| 44 | Order Form | farm_input_orders | ✅ Connected |
| 45 | Product Review Form | farm_input_product_ratings | ✅ Connected |
| 46 | Supplier Review Form | farm_input_supplier_ratings | ✅ Connected |
| 47 | Price Verification Form | input_pricing_verification | 🔄 Uses input_pricing_verification |

### 🏪 Community & Content (7 forms)
| # | Form | Table | Status |
|---|------|-------|--------|
| 48 | Community Post Form | community_posts | ✅ Connected |
| 49 | Comment Form | community_comments | ✅ Connected |
| 50 | Report Form | community_post_reports | ✅ Connected |
| 51 | Feature Request Form | - | ❌ No feature_requests table |
| 52 | Partner Registration Form | partners | ✅ Connected |
| 53 | Donation Form | donations | ✅ Connected |
| 54 | Donation Request Form | donation_requests | ✅ Connected |

### 📅 Events & Training (3 forms)
| # | Form | Table | Status |
|---|------|-------|--------|
| 55 | Event Creation Form | agricultural_events | ✅ Connected |
| 56 | Training Registration Form | training_events | 🔄 Uses training_events |
| 57 | Event Registration Form | - | ❌ No event_registrations table |

### 🚛 Logistics (3 forms)
| # | Form | Table | Status |
|---|------|-------|--------|
| 58 | Transporter Registration Form | transporters | ✅ Connected |
| 59 | Service Provider Form | service_providers | ✅ Connected |
| 60 | Logistics Onboarding Form | transporters | 🔄 Uses transporters table |

### 📊 Misc (2 forms)
| # | Form | Table | Status |
|---|------|-------|--------|
| 61 | Sentiment Report Form | - | ❌ No market_sentiments table |
| 62 | Success Story Form | success_stories | ✅ Connected |

---

## 📈 HONEST SUMMARY

| Category | Forms | ✅ Connected | 🔄 Different Table | ❌ Missing Table | ⏳ Pending |
|----------|-------|-------------|-------------------|-----------------|------------|
| Auth/Profile | 3 | 3 | 0 | 0 | 0 |
| Farmer Portal | 8 | 5 | 2 | 1 | 0 |
| Marketplace | 12 | 8 | 2 | 1 | 1 |
| Cooperatives | 8 | 7 | 1 | 0 | 0 |
| Export/Trade | 6 | 6 | 0 | 0 | 0 |
| Sustainability | 4 | 4 | 0 | 0 | 0 |
| Farm Inputs | 6 | 5 | 1 | 0 | 0 |
| Community | 7 | 6 | 0 | 1 | 0 |
| Events | 3 | 1 | 1 | 1 | 0 |
| Logistics | 3 | 2 | 1 | 0 | 0 |
| Misc | 2 | 1 | 0 | 1 | 0 |
| **TOTAL** | **62** | **48** | **8** | **5** | **1** |

## ❌ MISSING TABLES (Need Migration)

The following tables need to be created:

1. `harvests` - For harvest tracking
2. `pricing_reports` - For market price reporting
3. `feature_requests` - For user feature requests
4. `event_registrations` - For event/training signups
5. `market_sentiments` - For market sentiment tracking

## ⏳ PENDING INTEGRATION

1. **F2C Subscription Form** - Table exists, Paystack integration pending
