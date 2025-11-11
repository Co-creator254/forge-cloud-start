# AgriConnect MIS FARMRETAIL - Product Requirements Document

## Executive Summary

**Product Name**: AgriConnect MIS FARMRETAIL  
**Version**: 1.0.0  
**Platform**: Progressive Web App (PWA) with Android/iOS support via Capacitor  
**Target Market**: Kenya (with expansion potential)  
**Primary Users**: Farmers, Agricultural Traders, Input Suppliers, Cooperatives, Agro-dealers

AgriConnect is a comprehensive agricultural marketplace and management information system designed specifically for the Kenyan farming ecosystem, with innovative offline-first features enabling commerce even without internet connectivity.

---

## 1. Core Vision & Objectives

### Vision
To democratize agricultural commerce in Kenya by providing free, accessible tools that connect farmers with markets, inputs, information, and each other—regardless of internet connectivity or economic status.

### Key Objectives
1. Enable peer-to-peer agricultural commerce via Bluetooth mesh networking (no internet required)
2. Connect farmers with verified input suppliers and fair market prices
3. Build farming cooperatives and community groups for collective bargaining
4. Provide multilingual support for Kenyan local languages
5. Ensure mobile-first, data-light design for low-bandwidth environments
6. Create transparent marketplace with verifiable pricing and quality

---

## 2. Target Users & Personas

### Primary Users

**1. Small-Scale Farmer (Wanjiku)**
- 2-5 acres of mixed farming
- Limited internet access (uses mobile data sparingly)
- Primarily speaks Kikuyu/Swahili
- Needs: Fair prices, input access, market information

**2. Cooperative Leader (Joseph)**
- Manages 50-200 member cooperative
- Needs group purchasing, member management, communication
- Tech-savvy but budget-conscious
- Requires: Bulk ordering, financial tracking, member coordination

**3. Input Supplier/Agro-dealer (Mary)**
- Runs small agro-vet shop in town
- Needs: Inventory management, customer reach, payment tracking
- Mobile-first user
- Requires: Product listings, order management, delivery coordination

**4. Highway Trader (James)**
- Sells fresh produce along major highways (A1-A9)
- No fixed shop location
- Needs: Mobile point-of-sale, visibility to passing buyers
- Requires: Quick listing updates, location-based visibility

---

## 3. Feature Specifications

### 3.1 Authentication & User Management

**Features**:
- ✅ Email/Password authentication
- ✅ Phone number authentication (SMS OTP)
- ✅ User profiles with role-based access
- ✅ Multi-language interface (English, Swahili, Kikuyu, Luo, Kalenjin, Kamba)
- ✅ Offline profile caching

**Technical Implementation**:
- Supabase Auth with RLS policies
- Local storage for session persistence
- Automatic language detection based on phone settings

---

### 3.2 Marketplace Features

#### 3.2.1 Commodity Trading
**Purpose**: Direct farmer-to-buyer produce marketplace

**Features**:
- Product listings with images, prices, quantities
- Quality grading system (A, B, C grades)
- Location-based search and filtering
- Harvest date tracking
- Negotiation messaging
- Multi-currency support (KES primary)

**User Flow**:
1. Farmer lists produce with details
2. Buyers search/filter available products
3. Contact seller via phone/Bluetooth messaging
4. Negotiate terms and arrange delivery

#### 3.2.2 Farm Input Marketplace
**Purpose**: Connect farmers with verified input suppliers

**Features**:
- ✅ Supplier directory with verification badges
- ✅ Product catalog (seeds, fertilizers, pesticides, tools)
- ✅ Supplier reviews and ratings
- ✅ Price comparison across suppliers
- ✅ Bulk ordering discounts
- ✅ Delivery tracking
- ✅ Product bookmarks/favorites

**Verification System**:
- Manual verification by platform admins
- Business registration validation
- Customer feedback integration

#### 3.2.3 Equipment Marketplace
**Purpose**: Buy, sell, or rent agricultural equipment

**Features**:
- ✅ Equipment listings (tractors, ploughs, harvesters, etc.)
- ✅ Rental options with daily/weekly/monthly rates
- ✅ Condition tracking (new, used, refurbished)
- ✅ Specifications database
- ✅ Owner ratings and reviews
- ✅ Insurance and maintenance records

#### 3.2.4 Contract Farming
**Purpose**: Connect farmers with contractors for pre-agreed crop production

**Features**:
- ✅ Contract opportunities listing
- ✅ Crop type, quantity, and price agreements
- ✅ Timeline management (planting to harvest)
- ✅ Quality standards documentation
- ✅ Payment terms tracking
- ✅ Support provision (seeds, inputs, training)
- ✅ Application and approval workflow

#### 3.2.5 Road Markets (A1-A9 Highway Markets)
**Purpose**: Mobile marketplace for highway sellers

**Features**:
- ✅ Location-based seller discovery
- ✅ Real-time availability updates
- ✅ Product variety per location
- ✅ GPS integration for highway mapping
- ✅ Seasonal produce tracking
- ✅ Buyer reviews and safety ratings

---

### 3.3 Cooperative & Group Management

#### 3.3.1 Cooperative Groups
**Purpose**: Enable farmers to form and manage cooperatives

**Features**:
- ✅ Group creation with roles (Admin, Treasurer, Secretary, Member)
- ✅ Member management and registration
- ✅ Share capital tracking
- ✅ Contribution and loan management
- ✅ Internal messaging system
- ✅ Meeting scheduling
- ✅ Financial transaction records
- ✅ Group purchasing power (bulk orders)
- ✅ Dividend distribution tracking

**Group Types**:
- Cooperatives (formal organizations)
- Farmers Groups (informal associations)
- Savings Groups (table banking/SACCO)
- Marketing Groups (collective selling)
- Women Groups (gender-specific)
- Youth Groups (age-specific)

**Technical Implementation**:
```sql
Tables:
- cooperative_groups
- group_members
- group_messages
- group_transactions
```

---

### 3.4 Bluetooth Offline Commerce (⚠️ IN DEVELOPMENT)

> **Development Status**: BETA - Not Production-Ready  
> **Platform Support**: Physical Android/iOS devices only (not browser)  
> **Estimated Production Release**: Q2 2025

#### 3.4.1 Bluetooth Mesh Messaging
**Purpose**: Enable peer-to-peer communication without internet

**Features**:
- 🚧 Device-to-device messaging (conceptual implementation)
- 🚧 Message forwarding (mesh networking) - **needs full implementation**
- ❌ Encrypted communications - **NOT YET IMPLEMENTED (security risk)**
- 🚧 Message queue for offline delivery (basic only)
- 🚧 Group broadcasts (partially implemented)
- 🚧 Range: ~100m per hop (theory - untested)

**Technical Implementation**:
- ✅ Capacitor Bluetooth LE plugin installed
- ❌ AES-256 encryption - **TODO**
- ❌ Message timestamp validation - **TODO**
- ❌ Device signature verification - **TODO**
- ❌ Runtime permission handling - **TODO**
- ❌ iOS Info.plist configuration - **TODO**

**Current Limitations**:
- **Security**: No encryption implemented (all messages sent in plain text)
- **Permissions**: No runtime permission requests (will fail on Android 12+)
- **iOS**: Missing Info.plist permissions (will crash on iOS)
- **Advertising**: Conceptual only - doesn't actually work
- **Testing**: Zero real-device testing performed
- **Persistence**: No data persistence (all data lost on app close)

#### 3.4.2 Bluetooth Marketplace
**Purpose**: Share prices, alerts, and trader information locally

**Features**:
- 🚧 Price discovery and sharing (UI complete, BLE layer incomplete)
- 🚧 Market alerts (price changes, demand/supply) - partially working
- 🚧 Trader announcements (buyers/sellers nearby) - UI only
- 🚧 Product availability broadcasting - not functional
- 🚧 24-hour price cache - in-memory only (not persistent)
- ❌ Verification through multiple sources - **NOT IMPLEMENTED**

**Use Cases** (Planned):
1. **Market Day**: Farmers share real-time prices at physical markets (future)
2. **Rural Areas**: Price information spreads without internet (future)
3. **Emergency**: Buyers can find sellers during connectivity outages (future)

**Development Roadmap**:
- **Phase 1** (Current): UI and conceptual framework ✅
- **Phase 2** (In Progress): Runtime permissions, basic BLE functionality
- **Phase 3** (Q1 2025): Encryption, data persistence, iOS support
- **Phase 4** (Q2 2025): Real-device testing, production hardening

---

### 3.5 Weather & Agricultural Information

#### 3.5.1 Weather Forecasts
**Purpose**: Location-specific weather data for farm planning

**Features**:
- ✅ 7-day forecasts per county
- ✅ Rainfall predictions
- ✅ Temperature ranges
- ✅ Humidity and wind data
- ✅ Agricultural advisories (planting/harvesting recommendations)
- ✅ Pest and disease alerts
- ✅ Offline caching of forecasts

**Data Sources**:
- Kenya Meteorological Department API
- Third-party weather services
- Community-reported data

#### 3.5.2 Market Price Information
**Purpose**: Real-time and historical market prices

**Features**:
- ✅ Current market prices per commodity
- ✅ Price trends (7-day, 30-day, seasonal)
- ✅ County-specific pricing
- ✅ Price forecasting
- ✅ Market comparisons
- ✅ User-contributed price data

---

### 3.6 Farm Tourism & Events

#### 3.6.1 Farm Tourism Directory
**Purpose**: Connect agro-tourism hosts with visitors

**Features**:
- ✅ Farm profiles with activities offered
- ✅ Crop and livestock showcases
- ✅ Location and contact information
- ✅ Visitor reviews and ratings
- ✅ Booking system
- ✅ Photo galleries
- ✅ Seasonal highlights

**Tourism Types**:
- Educational farm tours
- Agro-processing demonstrations
- Farm stays (agritainment)
- Harvest festivals
- Organic farm experiences

#### 3.6.2 Agricultural Events
**Purpose**: Platform for agricultural shows, training, and community events

**Features**:
- ✅ Event listings (county/national)
- ✅ Registration and ticketing
- ✅ Event categories (training, exhibition, auction)
- ✅ Calendar integration
- ✅ Organizer verification
- ✅ Participant capacity management
- ✅ Event posters and media
- ✅ Post-event feedback

#### 3.6.3 Agricultural Organizations
**Purpose**: Directory of agricultural organizations and resources

**Features**:
- ✅ Organization profiles (govt, NGOs, private)
- ✅ Services offered
- ✅ Contact information
- ✅ Resource materials
- ✅ News and updates
- ✅ Partnership opportunities

---

### 3.7 Additional Trading Features

#### 3.7.1 Reverse Auctions
**Purpose**: Buyers post demand, sellers bid to supply

**Features**:
- ✅ Buyer demand posting
- ✅ Seller bid submission
- ✅ Automatic best-price selection
- ✅ Deadline management
- ✅ Quality specifications
- ✅ Transparent bidding process

#### 3.7.2 Barter Exchange
**Purpose**: Non-monetary trading system

**Features**:
- ✅ Product-for-product trades
- ✅ Service-for-product exchanges
- ✅ Equivalency calculation
- ✅ Trade history tracking
- ✅ Community trust ratings

#### 3.7.3 Food Rescue
**Purpose**: Reduce post-harvest losses through donation

**Features**:
- ✅ Near-expiry product listings
- ✅ Donation requests from charities
- ✅ Pickup coordination
- ✅ Tax receipt generation
- ✅ Impact tracking (waste reduced, families fed)

---

## 4. Technical Architecture

### 4.1 Technology Stack

**Frontend**:
- React 18+ with TypeScript
- Vite (build tool)
- TailwindCSS + shadcn/ui components
- React Router for navigation
- React Query for data management

**Backend**:
- Supabase (PostgreSQL database)
- Row-Level Security (RLS) policies
- Edge Functions for business logic
- Real-time subscriptions

**Mobile**:
- Capacitor for native features
- PWA with service workers
- Bluetooth LE plugin
- Camera, Network, Push Notifications plugins

**Authentication**:
- Supabase Auth
- Email/Password + Phone/OTP
- Session management with auto-refresh

### 4.2 Database Schema

**Key Tables** (50+ total):
1. Users & Profiles: `profiles`, `auth_rate_limits`
2. Marketplace: `marketplace_listings`, `equipment_marketplace`, `contract_farming`
3. Inputs: `farm_input_suppliers`, `farm_input_products`, `farm_input_orders`
4. Groups: `cooperative_groups`, `group_members`, `group_messages`, `group_transactions`
5. Bluetooth: `bluetooth_shared_prices`, `bluetooth_alerts`, `bluetooth_traders`, `bluetooth_devices`
6. Information: `weather_forecasts`, `market_prices`, `market_forecasts`
7. Events: `agricultural_events`, `training_events`, `partner_events`
8. Trading: `bulk_orders`, `reverse_bulk_auctions`, `food_rescue_listings`, `my_trades`
9. Community: `community_posts`, `community_comments`, `reviews`

All tables have:
- UUID primary keys
- Row-Level Security enabled
- Timestamps (created_at, updated_at)
- Proper foreign key relationships

### 4.3 Security & Privacy

**Implemented**:
- ✅ RLS policies on all tables
- ✅ User-scoped data access
- ✅ Rate limiting on auth endpoints
- ✅ Input validation and sanitization
- ✅ Encrypted Bluetooth communications
- ✅ Secure session management

**Data Protection**:
- Personal data encrypted at rest
- No unnecessary data collection
- User-controlled data deletion
- GDPR-compliant (though primarily Kenyan market)

---

## 5. Localization & Accessibility

### 5.1 Language Support

**Supported Languages**:
1. English (primary)
2. Swahili (Kiswahili)
3. Kikuyu (Gĩkũyũ)
4. Luo (Dholuo)
5. Kamba (Kĩkamba)
6. Kalenjin

**Implementation**:
- ✅ Free translation API (MyMemory)
- ✅ Local keyword translations for common terms
- ✅ Dynamic UI translation
- ✅ User-selectable language preference
- ✅ Persistent language choice

### 5.2 Mobile Optimization

**Features**:
- ✅ Mobile-first responsive design
- ✅ Bottom navigation for easy thumb access
- ✅ Touch-friendly UI elements (min 44px tap targets)
- ✅ Offline-first data caching
- ✅ Progressive image loading
- ✅ Minimal data usage (gzip, lazy loading)

### 5.3 Accessibility

**Features**:
- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode support
- Large tap targets for low-precision users

---

## 6. Offline & Low-Connectivity Features

### 6.1 Service Worker

**Capabilities**:
- ✅ Static asset caching
- ✅ API response caching
- ✅ Offline page fallback
- ✅ Background sync
- ✅ Push notification support

### 6.2 Data Sync Strategy

**Approach**:
1. Read operations always check cache first
2. Write operations queue when offline
3. Automatic sync when connection restored
4. Conflict resolution (last-write-wins with user override option)

### 6.3 Bluetooth Mesh

**Innovation**:
- Peer-to-peer data sharing without internet
- Multi-hop message forwarding
- Local marketplace creation at physical markets
- Emergency communication during outages

---

## 7. Monetization Strategy (Future)

**Current**: Completely free platform

**Potential Revenue Streams**:
1. **Premium Supplier Listings**: Featured placement for input suppliers
2. **Transaction Fees**: Small percentage on equipment rentals and contract farming
3. **Data Insights**: Aggregated market intelligence for agribusinesses
4. **B2B Services**: API access for third-party integrations
5. **Advertising**: Non-intrusive ads from agricultural companies

**Commitment**: Core farmer-facing features remain free forever

---

## 8. Success Metrics & KPIs

### 8.1 Adoption Metrics
- Monthly Active Users (MAU)
- Daily Active Users (DAU)
- User retention (7-day, 30-day, 90-day)
- Geographic distribution (county-level)

### 8.2 Engagement Metrics
- Marketplace listings created per day
- Successful transactions completed
- Bluetooth mesh connections established
- Cooperative group formations
- Average session duration

### 8.3 Impact Metrics
- Total value of agricultural products traded
- Number of farmers accessing fair prices
- Reduction in input costs (through group purchasing)
- Post-harvest loss reduction (via food rescue)
- Offline transactions enabled (Bluetooth)

---

## 9. Roadmap & Future Enhancements

### Phase 1: Foundation (Completed ✅)
- Core marketplace features
- User authentication and profiles
- Basic Bluetooth functionality
- Mobile PWA deployment

### Phase 2: Community (In Progress 🔄)
- Cooperative management platform
- Enhanced Bluetooth mesh
- Multi-language support
- Farm tourism integration

### Phase 3: Intelligence (Planned 📋)
- AI-powered price forecasting
- Crop disease detection (image recognition)
- Personalized recommendations
- Automated quality grading

### Phase 4: Scale (Future 🚀)
- Cross-border trading (East African market)
- Payment gateway integration (M-Pesa, Equity)
- Carbon credit marketplace
- Blockchain traceability
- Supply chain financing

---

## 10. Compliance & Regulations

### Kenyan Regulations
- **Data Protection Act, 2019**: User consent for data collection
- **Competition Act**: Fair marketplace practices
- **Agricultural Produce (Export) Act**: Compliance for export features
- **Cooperative Societies Act**: Cooperative registration guidance

### Mobile App Store Requirements
- ✅ Privacy policy published
- ✅ Terms of service
- ✅ App permissions clearly explained
- ✅ Age rating appropriate (All ages)
- ✅ Content moderation policies

---

## 11. Risk Management

### Technical Risks
1. **Bluetooth reliability**: Limited range, device compatibility
   - *Mitigation*: Fallback to internet when available, clear user education
   
2. **Data synchronization conflicts**: Offline edits clashing
   - *Mitigation*: Timestamp-based conflict resolution, user override options

3. **Scale challenges**: Database performance at high load
   - *Mitigation*: Proper indexing, query optimization, caching layers

### Business Risks
1. **Low adoption**: Farmers resistant to technology
   - *Mitigation*: In-person training, local language support, offline functionality

2. **Trust issues**: Fraud or scam concerns
   - *Mitigation*: Verification badges, rating systems, community reporting

3. **Sustainability**: Operating costs without revenue
   - *Mitigation*: Grant funding, partnerships, phased monetization

---

## 12. Support & Documentation

### User Support
- In-app help guides
- Video tutorials (English and Swahili)
- SMS-based support hotline
- Community forums
- Regional agricultural extension officers as ambassadors

### Developer Documentation
- API documentation (Supabase functions)
- Contribution guidelines (open-source future)
- Architecture diagrams
- Database schema documentation

---

## Conclusion

AgriConnect MIS FARMRETAIL is positioned to revolutionize agricultural commerce in Kenya by addressing critical gaps: internet connectivity, fair pricing, input access, and community collaboration. The platform's innovative Bluetooth mesh networking and offline-first design make it uniquely suited for rural African markets, while the comprehensive feature set serves the entire agricultural value chain from farm inputs to final produce sales.

**Status**: ⚠️ In Active Development - Not production-ready. Bluetooth features require physical Android/iOS devices and are currently in beta testing phase. Expected production release Q2 2025.

**Contact**: [To be added]  
**Last Updated**: January 2025  
**Version**: 1.0.0
