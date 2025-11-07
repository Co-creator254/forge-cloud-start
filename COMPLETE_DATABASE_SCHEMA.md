# 📊 COMPLETE AgriConnect Database Schema
**Last Updated:** 2025-11-07  
**Total Tables:** 95  
**Database:** PostgreSQL (Supabase)

---

## 📋 ALL TABLES IN SUPABASE (Alphabetical)

### A
1. **agricultural_events** - Agricultural events & exhibitions
2. **agricultural_organizations** - Partner agricultural organizations
3. **animals** - Livestock tracking system
4. **app_settings** - Application configuration settings

### B
5. **auth_rate_limits** - Authentication rate limiting
6. **barter_listings** - Barter exchange listings
7. **batch_tracking** - Product batch traceability
8. **bluetooth_alerts** - Offline alert distribution
9. **bluetooth_devices** - Bluetooth mesh network devices
10. **bluetooth_shared_prices** - Offline price sharing
11. **bluetooth_traders** - Trader discovery via Bluetooth
12. **bulk_order_bids** - Bids on bulk orders
13. **bulk_orders** - Bulk order coordination
14. **buy_requests** - Buy requests from buyers

### C
15. **carbon_emissions** - Carbon footprint tracking
16. **carbon_offset_projects** - Carbon offset initiatives
17. **city_markets** - Urban market directory
18. **community_comments** - Comments on community posts
19. **community_post_likes** - Post engagement
20. **community_post_reports** - Content moderation
21. **community_posts** - Community forum posts
22. **contract_farming** - Contract farming opportunities
23. **cooperative_activities** - Cooperative group activities
24. **cooperative_dividends** - Dividend distribution
25. **cooperative_groups** - Farmer cooperatives
26. **cooperative_loans** - Cooperative lending
27. **cooperative_votes** - Group voting system
28. **crops** - Crop tracking (Farmer Portal)

### D
29. **donation_requests** - Donation requests
30. **donations** - Donation tracking

### E
31. **equipment_listings_public** - Public equipment listings view
32. **equipment_marketplace** - Equipment sales & rentals
33. **export_opportunities** - Export market opportunities
34. **export_opportunity_applications** - Applications for exports

### F
35. **farm_budgets** - Farm budget planning (Farmer Portal)
36. **farm_input_ban_recommendations** - Input safety warnings
37. **farm_input_categories** - Product categorization
38. **farm_input_entity_flags** - Content flagging system
39. **farm_input_order_items** - Order line items
40. **farm_input_orders** - Farm input orders
41. **farm_input_product_bookmarks** - User bookmarks
42. **farm_input_product_likes** - Product engagement
43. **farm_input_product_ratings** - Product ratings
44. **farm_input_products** - Farm input products catalog
45. **farm_input_supplier_likes** - Supplier engagement
46. **farm_input_supplier_ratings** - Supplier ratings
47. **farm_input_suppliers** - Supplier directory
48. **farm_inventory** - Farm inventory management (Farmer Portal)
49. **farm_statistics** - Farm performance metrics (Farmer Portal)
50. **farm_tourism_hosts** - Farm tourism listings
51. **farm_transactions** - Financial transactions (Farmer Portal)
52. **farms** - Farm profiles

### G-L
53. **food_rescue_listings** - Food waste reduction
54. **food_rescue_matches** - Donor-recipient matching
55. **group_input_orders** - Group buying orders
56. **group_members** - Cooperative membership
57. **group_messages** - Group communication
58. **group_order_participants** - Group order participation
59. **group_transactions** - Group financial records
60. **input_pricing_verification** - Community price verification
61. **input_supplier_reviews** - Supplier reviews
62. **land_parcels** - Land management (Farmer Portal)
63. **loan_repayments** - Loan payment tracking

### M
64. **market_forecasts** - Price forecasts
65. **market_linkages** - Market connections
66. **market_prices** - Real-time market prices
67. **marketplace_listings** - Produce listings
68. **member_dividend_payments** - Individual dividend records
69. **my_trades** - Trade transactions

### N-P
70. **notifications** - User notifications system
71. **partner_events** - Partner-organized events
72. **partners** - Platform partners
73. **payment_transactions** - Payment records
74. **price_trends** - Historical price data
75. **processing_matches** - Processor-farmer matching
76. **produce_inventory** - Produce inventory
77. **products** - General product catalog
78. **profiles** - User profile information

### R
79. **recipients** - Donation recipients
80. **reverse_auction_bids** - Reverse auction bids
81. **reverse_bulk_auctions** - Reverse auction system
82. **reviews** - General review system

### S
83. **security_audit_log** - Security event logging
84. **service_providers** - Service provider directory
85. **subscription_box_deliveries** - F2C delivery tracking
86. **subscription_boxes** - F2C subscription boxes
87. **success_stories** - User success stories

### T-W
88. **training_events** - Training events management
89. **transportation_requests** - Transport service requests
90. **transporters** - Transporter directory
91. **user_directory** - User lookup system
92. **user_roles** - Role-based access control
93. **warehouse_bookings** - Warehouse bookings
94. **warehouses** - Warehouse directory
95. **weather_forecasts** - Weather data with agricultural advisory

---

## 🚫 MISSING TABLES (Features Using Mock Data)

### Needed for Supply Chain Dashboard:
```sql
CREATE TABLE supply_chain_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  farm_id UUID REFERENCES farms,
  stage_name TEXT NOT NULL, -- planting, growth, harvest, storage, transport, market
  status TEXT NOT NULL, -- active, completed, delayed, problem
  progress INTEGER DEFAULT 0, -- 0-100
  start_date DATE,
  end_date DATE,
  issues JSONB,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE supply_chain_financial_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stage_id UUID REFERENCES supply_chain_stages,
  cost_type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'KES',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Needed for Road Markets:
```sql
CREATE TABLE road_markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  road TEXT NOT NULL, -- e.g., "A1 (Namanga to Lokichogio)"
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  coordinates JSONB,
  active_vendors INTEGER DEFAULT 0,
  market_days TEXT[],
  contact_info TEXT,
  facilities TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE market_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID REFERENCES road_markets NOT NULL,
  reporter_id UUID REFERENCES auth.users,
  reporter_name TEXT,
  report_type TEXT, -- price, condition, traffic
  details TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Needed for Route Vendors:
```sql
CREATE TABLE route_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name TEXT NOT NULL,
  route TEXT NOT NULL,
  location TEXT NOT NULL,
  products TEXT[],
  contact TEXT,
  rating NUMERIC,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Needed for Demand Hotspots:
```sql
CREATE TABLE demand_hotspots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity TEXT NOT NULL,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  demand_level TEXT, -- high, medium, low
  buyer_count INTEGER DEFAULT 0,
  avg_price NUMERIC,
  price_trend TEXT, -- increasing, stable, decreasing
  description TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📊 TABLE CATEGORY BREAKDOWN

- **User & Auth:** 4 tables
- **Marketplace & Trading:** 15 tables
- **Farm Management:** 18 tables
- **Community & Social:** 7 tables
- **Cooperatives:** 7 tables
- **Logistics:** 8 tables
- **Market Intelligence:** 5 tables
- **Reviews & Ratings:** 5 tables
- **Offline/Bluetooth:** 4 tables
- **Food Rescue:** 4 tables
- **Partner System:** 2 tables
- **Training & Events:** 2 tables
- **Export:** 2 tables
- **Carbon Tracking:** 2 tables
- **F2C:** 2 tables
- **Misc:** 8 tables

**Total:** 95 tables

---

## 🔒 RLS STATUS

- ✅ RLS Enabled: ~90% of tables
- ⚠️ RLS Missing/Incomplete: ~10%
- **Recommendation:** Run `supabase--linter` to verify all policies

---

## 📈 COMPLETION STATUS

- ✅ **Fully Implemented:** 85 tables (89%)
- ⚠️ **Needs UI Connection:** 6 tables (6%)
- ❌ **Missing Tables:** 4 tables (5%)

---

**For detailed column information on each table, see the original DATABASE_SCHEMA.md**
