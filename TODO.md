# SokoConnect TODO - Updated January 2026

## 📊 DATABASE STATUS
- **Total Tables in Supabase:** 104
- **Total Functions:** 19 (9 existing + 10 new)
- **RLS Policies:** Comprehensive (most tables covered)

## ✅ COMPLETED THIS SESSION
- [x] Created `farmer_exporter_collaborations` table with RLS
- [x] Created `exporter_profiles` table with RLS  
- [x] Created `f2c_subscriptions` table with RLS
- [x] Fixed Subscribe Now button (table was missing)
- [x] Created FORMS.md documenting 62+ forms
- [x] Removed M-Pesa references (using Paystack)
- [x] Fixed smudged tabs on Farmer-Exporter Collaboration page
- [x] Created all 10 missing database functions:
  1. `calculate_farm_statistics(p_user_id)` - Auto-calculate farm metrics
  2. `calculate_crop_yields(p_crop_id)` - Yield calculations
  3. `calculate_cooperative_dividends(p_group_id, p_total_profit, p_financial_year)` - Dividend distribution
  4. `calculate_loan_interest(p_loan_id)` - Loan interest calculations
  5. `update_market_price_trends()` - Price trend analytics
  6. `match_farmers_exporters(p_farmer_collaboration_id)` - Auto-matching algorithm
  7. `calculate_carbon_footprint(p_user_id)` - Carbon calculations
  8. `generate_batch_number(p_farmer_id, p_product_name)` - Batch tracking
  9. `calculate_inventory_alerts(p_user_id)` - Low stock alerts
  10. `update_farmer_ratings(p_farmer_id)` - Rating aggregation

## 💳 PAYSTACK INTEGRATION REQUIRED
**SECRETS NEEDED:** `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`

### Subscription Services (Monthly)
| Service | Price (KES) | USD Equiv | Paystack Link Needed |
|---------|-------------|-----------|---------------------|
| F2C Basic | 1,300 | $10 | ❌ |
| F2C Premium | 2,600 | $20 | ❌ |
| F2C Enterprise | 3,900 | $30 | ❌ |

### One-time Services
| Service | Fee (KES) | USD Equiv | Link Needed |
|---------|-----------|-----------|-------------|
| Business Marketing Basic | 1,300 | $10 | ❌ |
| Business Marketing Standard | 2,600 | $20 | ❌ |
| Business Marketing Premium | 3,900 | $30 | ❌ |
| Export Documentation | 2,600 | $20 | ❌ |
| Featured Equipment Listing | 500 | ~$4 | ❌ |
| Training Event Registration | 500-2,000 | Varies | ❌ |

### Transaction Fees
| Transaction Type | Fee | Description |
|------------------|-----|-------------|
| Marketplace Sale | 2.5% | Per transaction |
| Barter Exchange | 1.5% | Value-based |
| Group Order | 2% | Bulk order commission |

## 🐄 LIVESTOCK MARKETPLACE
Currently handled through `products` and `marketplace_listings` tables with category filtering.
Farmers can:
- List livestock for sale via marketplace
- Use the `animals` table for personal tracking
- Trade via barter system

## 🟡 HIGH PRIORITY FIXES
1. [ ] Integrate Paystack for payments
2. [ ] Connect Contact form to email service
3. [ ] Add iOS Bluetooth permissions to Info.plist
4. [ ] Test Bluetooth on real devices

## 🟢 MEDIUM PRIORITY
1. [ ] Email notifications via Edge Functions
2. [ ] Multi-language support (Swahili)
3. [ ] Performance optimization
4. [ ] Comprehensive E2E tests

## 📋 HAYSTACK AI INTEGRATION
**What is Haystack?** Haystack is an open-source AI framework for building:
- RAG (Retrieval Augmented Generation) pipelines
- Semantic search for market data
- AI-powered Q&A for agricultural knowledge base
- Document processing for export documentation

Current status: Link added to footer. Integration pending API key setup.

## 📁 ESSENTIAL MD FILES
- MASTER_STATUS.md - Main project status
- TODO.md - This file
- FORMS.md - 62+ forms documentation
- PRD.md - Product requirements
- README.md - Project readme
- DATABASE_SCHEMA.md - Schema docs
- API_DOCUMENTATION.md - API docs
- DEPLOYMENT_GUIDE.md - Deploy instructions
- CHANGELOG.md - Version history

## 📊 CURRENT STATUS
- **Features**: 90% complete
- **Database Tables**: 100% complete (104 tables)
- **Database Functions**: 100% complete (19 functions)
- **UI/UX**: 90% complete
- **Payments**: 0% (Paystack integration needed)
- **Testing**: 20% complete
- **Overall**: 80% production ready
