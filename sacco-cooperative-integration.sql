-- 🏦 SACCO & COOPERATIVE INTEGRATION
-- Kenyan Financial Communities - Trust Engine Enhancement
-- SACCOs (Savings and Credit Cooperative Organizations) are fundamental to Kenyan agriculture

-- =====================================================
-- SACCO MEMBERSHIP TABLE
-- Tracks SACCO relationships and financial community trust
-- =====================================================

CREATE TABLE supply_chain_sacco_membership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  sacco_name TEXT NOT NULL,
  sacco_registration_number TEXT UNIQUE,
  sacco_type TEXT CHECK (sacco_type IN ('farmers', 'transporters', 'traders', 'mixed', 'women_only', 'youth')),
  membership_number TEXT,
  join_date DATE NOT NULL,
  membership_status TEXT DEFAULT 'active' CHECK (membership_status IN ('active', 'suspended', 'terminated', 'honorary')),
  share_capital NUMERIC DEFAULT 0, -- Amount invested in SACCO
  loan_limit NUMERIC DEFAULT 0, -- Credit limit from SACCO
  current_loan_balance NUMERIC DEFAULT 0,
  contribution_frequency TEXT CHECK (contribution_frequency IN ('daily', 'weekly', 'monthly', 'harvest_time')),
  last_contribution_date DATE,
  sacco_officer_name TEXT,
  sacco_officer_contact TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_documents JSONB, -- membership card, ID, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_sacco UNIQUE (user_id, sacco_name)
);

-- =====================================================
-- COOPERATIVE POOLING RESOURCES
-- Shared resources managed by cooperatives
-- =====================================================

CREATE TABLE supply_chain_cooperative_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id UUID NOT NULL, -- References SACCO or cooperative
  cooperative_name TEXT NOT NULL,
  resource_type TEXT CHECK (resource_type IN ('warehouse', 'transport', 'processing', 'equipment', 'storage', 'market_access')),
  resource_name TEXT NOT NULL,
  total_capacity NUMERIC NOT NULL,
  available_capacity NUMERIC NOT NULL,
  capacity_unit TEXT,
  location TEXT NOT NULL,
  resource_quality TEXT CHECK (resource_quality IN ('premium', 'standard', 'basic')),
  booking_rules JSONB, -- Priority rules for members vs non-members
  member_rate NUMERIC, -- Discounted rate for SACCO members
  non_member_rate NUMERIC, -- Standard rate for outsiders
  utilization_schedule JSONB, -- When resource is typically available
  maintenance_schedule JSONB,
  resource_manager_id UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SACCO FINANCIAL TRANSACTIONS
-- Track all SACCO-related financial activities
-- =====================================================

CREATE TABLE supply_chain_sacco_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  sacco_name TEXT NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('contribution', 'loan_disbursement', 'loan_repayment', 'dividend', 'penalty', 'fee')),
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'KES',
  transaction_date DATE NOT NULL,
  description TEXT,
  reference_number TEXT,
  approval_officer TEXT,
  repayment_schedule JSONB, -- For loans
  interest_rate DECIMAL(5,2), -- For loans
  due_date DATE, -- For repayments
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- COOPERATIVE MARKET ACCESS
-- Markets and opportunities accessed through cooperatives
-- =====================================================

CREATE TABLE supply_chain_cooperative_markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id UUID NOT NULL,
  market_name TEXT NOT NULL,
  market_location TEXT NOT NULL,
  market_day TEXT, -- Monday, Tuesday, etc. or "Daily"
  market_type TEXT CHECK (market_type IN ('produce', 'livestock', 'dairy', 'mixed', 'export', 'institutional')),
  member_benefits JSONB, -- Reduced fees, priority access, etc.
  non_member_terms JSONB, -- Standard terms for outsiders
  average_weekly_volume NUMERIC, -- Typical volume through this market
  quality_standards JSONB, -- Required quality for market access
  transport_arrangements JSONB, -- Group transport options
  storage_facilities JSONB, -- Cold storage, etc.
  market_fees JSONB, -- Structure of fees
  contact_person TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SACCO TRUST ENHANCEMENT
-- Boost trust scores for SACCO members
-- =====================================================

CREATE TABLE supply_chain_sacco_trust_boost (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  sacco_name TEXT NOT NULL,
  trust_boost_type TEXT CHECK (trust_boost_type IN ('membership_longevity', 'financial_responsibility', 'community_contribution', 'leadership_role')),
  boost_points INTEGER NOT NULL,
  boost_reason TEXT,
  verification_required BOOLEAN DEFAULT true,
  verified_by UUID REFERENCES auth.users,
  verification_date TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- Some boosts are temporary
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- COOPERATIVE BULK PURCHASING
-- Group buying power through cooperatives
-- =====================================================

CREATE TABLE supply_chain_cooperative_bulk_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id UUID NOT NULL,
  order_name TEXT NOT NULL,
  product_category TEXT NOT NULL, -- seeds, fertilizer, equipment, etc.
  total_quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  target_price_per_unit NUMERIC,
  current_best_price NUMERIC,
  potential_savings NUMERIC GENERATED ALWAYS AS ((target_price_per_unit - current_best_price) * total_quantity) STORED,
  order_status TEXT DEFAULT 'collecting' CHECK (order_status IN ('collecting', 'negotiating', 'confirmed', 'delivered', 'cancelled')),
  member_commitments JSONB, -- Which members committed how much
  supplier_preferences JSONB, -- Preferred suppliers
  delivery_location TEXT,
  delivery_date DATE,
  payment_terms JSONB,
  quality_requirements JSONB,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ENHANCED TRUST SCORES WITH SACCO INTEGRATION
-- Updated trust scores table to include SACCO factors
-- =====================================================

-- Add SACCO-related columns to existing trust scores
ALTER TABLE supply_chain_trust_scores 
ADD COLUMN sacco_membership_count INTEGER DEFAULT 0,
ADD COLUMN sacco_trust_boost INTEGER DEFAULT 0,
ADD COLUMN cooperative_participation_score DECIMAL(5,2) DEFAULT 0.00,
ADD COLUMN sacco_financial_responsibility DECIMAL(5,2) DEFAULT 0.00,
ADD COLUMN cooperative_badges TEXT[];

-- =====================================================
-- SACCO-CENTRIC VIEWS
-- =====================================================

-- SACCO Trust Leaderboard
CREATE VIEW sacco_trust_leaderboard AS
SELECT 
  u.full_name,
  sm.sacco_name,
  sm.sacco_type,
  ts.trust_points,
  ts.trust_level,
  sm.share_capital,
  sm.loan_limit,
  sm.current_loan_balance,
  ts.sacco_membership_count,
  ts.sacco_trust_boost,
  ts.cooperative_participation_score,
  ts.sacco_financial_responsibility,
  ts.cooperative_badges,
  -- Calculate SACCO-specific trust score
  (ts.reliability_score * 0.4) + 
  (ts.sacco_financial_responsibility * 0.3) + 
  (ts.cooperative_participation_score * 0.2) + 
  (ts.sacco_trust_boost * 0.1) as sacco_composite_score
FROM supply_chain_trust_scores ts
JOIN auth.users u ON ts.entity_id = u.id
JOIN supply_chain_sacco_membership sm ON u.id = sm.user_id AND sm.membership_status = 'active'
WHERE ts.entity_type = 'user'
ORDER BY sacco_composite_score DESC;

-- Cooperative Resource Availability
CREATE VIEW cooperative_resources_available AS
SELECT 
  cr.cooperative_name,
  cr.resource_type,
  cr.resource_name,
  cr.location,
  cr.available_capacity,
  cr.capacity_unit,
  cr.member_rate,
  cr.non_member_rate,
  cr.resource_quality,
  cr.utilization_schedule,
  -- Calculate member discount percentage
  ((cr.non_member_rate - cr.member_rate) / cr.non_member_rate * 100) as member_discount_percentage
FROM supply_chain_cooperative_resources cr
WHERE cr.available_capacity > 0
ORDER BY cr.member_rate ASC;

-- SACCO Financial Health Dashboard
CREATE VIEW sacco_financial_dashboard AS
SELECT 
  sm.sacco_name,
  sm.sacco_type,
  COUNT(DISTINCT sm.user_id) as total_members,
  SUM(sm.share_capital) as total_share_capital,
  SUM(sm.current_loan_balance) as total_outstanding_loans,
  SUM(sm.loan_limit) as total_credit_facility,
  -- Calculate loan-to-share ratio
  (SUM(sm.current_loan_balance) / NULLIF(SUM(sm.share_capital), 0) * 100) as loan_to_share_ratio,
  -- Monthly contributions
  COUNT(CASE WHEN st.transaction_type = 'contribution' AND st.transaction_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as monthly_contributions,
  -- Monthly repayments
  COUNT(CASE WHEN st.transaction_type = 'loan_repayment' AND st.transaction_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as monthly_repayments,
  -- Average contribution amount
  AVG(CASE WHEN st.transaction_type = 'contribution' THEN st.amount END) as avg_contribution_amount
FROM supply_chain_sacco_membership sm
LEFT JOIN supply_chain_sacco_transactions st ON sm.user_id = st.user_id
WHERE sm.membership_status = 'active'
GROUP BY sm.sacco_name, sm.sacco_type
ORDER BY total_members DESC;

-- =====================================================
-- SACCO-ENHANCED FUNCTIONS
-- =====================================================

-- Calculate SACCO trust boost
CREATE OR REPLACE FUNCTION calculate_sacco_trust_boost(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  boost_points INTEGER DEFAULT 0;
BEGIN
  -- Membership longevity boost
  boost_points := boost_points + (
    SELECT CASE 
      WHEN DATEDIFF(years, CURRENT_DATE, join_date) >= 5 THEN 20
      WHEN DATEDIFF(years, CURRENT_DATE, join_date) >= 3 THEN 15
      WHEN DATEDIFF(years, CURRENT_DATE, join_date) >= 1 THEN 10
      ELSE 5
    END
    FROM supply_chain_sacco_membership
    WHERE user_id = p_user_id AND membership_status = 'active'
  );
  
  -- Financial responsibility boost
  boost_points := boost_points + (
    SELECT CASE 
      WHEN current_loan_balance = 0 THEN 15
      WHEN (current_loan_balance / loan_limit) < 0.5 THEN 10
      WHEN (current_loan_balance / loan_limit) < 0.8 THEN 5
      ELSE 0
    END
    FROM supply_chain_sacco_membership
    WHERE user_id = p_user_id AND membership_status = 'active'
  );
  
  -- Community contribution boost
  boost_points := boost_points + (
    SELECT COUNT(*) * 2
    FROM supply_chain_sacco_trust_boost
    WHERE user_id = p_user_id AND verification_required = true
  );
  
  RETURN boost_points;
END;
$$ LANGUAGE plpgsql;

-- Update trust score with SACCO integration
CREATE OR REPLACE FUNCTION update_trust_score_with_sacco(
  p_entity_id UUID, 
  p_entity_type TEXT, 
  p_transaction_success BOOLEAN,
  p_payment_on_time BOOLEAN DEFAULT NULL,
  p_payment_method TEXT DEFAULT NULL,
  p_trust_points_awarded INTEGER DEFAULT 0,
  p_sacco_activity BOOLEAN DEFAULT false
)
RETURNS VOID AS $$
BEGIN
  -- Update base trust score
  PERFORM update_trust_score(
    p_entity_id, p_entity_type, p_transaction_success, 
    p_payment_on_time, p_payment_method, p_trust_points_awarded
  );
  
  -- Add SACCO-specific updates
  IF p_sacco_activity THEN
    UPDATE supply_chain_trust_scores 
    SET 
      sacco_trust_boost = calculate_sacco_trust_boost(p_entity_id),
      sacco_membership_count = (
        SELECT COUNT(*) 
        FROM supply_chain_sacco_membership 
        WHERE user_id = p_entity_id AND membership_status = 'active'
      ),
      sacco_financial_responsibility = (
        SELECT CASE 
          WHEN current_loan_balance = 0 THEN 100
          WHEN (current_loan_balance / NULLIF(loan_limit, 0)) < 0.5 THEN 80
          WHEN (current_loan_balance / NULLIF(loan_limit, 0)) < 0.8 THEN 60
          ELSE 40
        END
        FROM supply_chain_sacco_membership
        WHERE user_id = p_entity_id AND membership_status = 'active'
        ORDER BY join_date DESC
        LIMIT 1
      ),
      cooperative_badges = (
        SELECT ARRAY_AGG(trust_boost_type)
        FROM supply_chain_sacco_trust_boost
        WHERE user_id = p_entity_id AND verification_required = true
      )
    WHERE entity_id = p_entity_id AND entity_type = p_entity_type;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS FOR SACCO INTEGRATION
-- =====================================================

-- Auto-update SACCO trust on financial transactions
CREATE OR REPLACE FUNCTION trigger_sacco_trust_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update financial responsibility when SACCO transaction occurs
  IF NEW.transaction_type IN ('loan_repayment', 'contribution') THEN
    PERFORM update_trust_score_with_sacco(
      NEW.user_id, 'user', true, true, NULL, 0, true
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sacco_trust_update_trigger
  AFTER INSERT ON supply_chain_sacco_transactions
  FOR EACH ROW EXECUTE FUNCTION trigger_sacco_trust_update();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_sacco_membership_user ON supply_chain_sacco_membership(user_id, membership_status);
CREATE INDEX idx_sacco_membership_sacco ON supply_chain_sacco_membership(sacco_name, membership_status);
CREATE INDEX idx_cooperative_resources_type ON supply_chain_cooperative_resources(resource_type, available_capacity);
CREATE INDEX idx_sacco_transactions_user_date ON supply_chain_sacco_transactions(user_id, transaction_date);
CREATE INDEX idx_sacco_trust_boost_user ON supply_chain_sacco_trust_boost(user_id, verification_required);

-- =====================================================
-- SAMPLE KENYAN SACCO DATA
-- =====================================================

-- Sample SACCO memberships
INSERT INTO supply_chain_sacco_membership (user_id, sacco_name, sacco_registration_number, sacco_type, join_date, share_capital, loan_limit, membership_status) VALUES
((SELECT id FROM auth.users LIMIT 1), 'Mwihoko Farmers SACCO', 'SC/2023/001', 'farmers', '2020-01-15', 50000, 200000, 'active'),
((SELECT id FROM auth.users OFFSET 1 LIMIT 1), 'Ushirika Transporters SACCO', 'SC/2022/045', 'transporters', '2021-06-10', 25000, 150000, 'active'),
((SELECT id FROM auth.users OFFSET 2 LIMIT 1), 'Juhudi Women Farmers SACCO', 'SC/2021/089', 'women_only', '2019-03-20', 30000, 100000, 'active');

-- Sample cooperative resources
INSERT INTO supply_chain_cooperative_resources (cooperative_id, cooperative_name, resource_type, resource_name, total_capacity, available_capacity, capacity_unit, location, member_rate, non_member_rate, resource_quality) VALUES
(1, 'Mwihoko Farmers SACCO', 'warehouse', 'Main Storage Facility', 100000, 45000, 'kg', 'Nairobi', 50.00, 75.00, 'premium'),
(1, 'Mwihoko Farmers SACCO', 'transport', 'Collective Truck', 5000, 2000, 'kg', 'Nairobi', 15.00, 25.00, 'standard'),
(2, 'Ushirika Transporters SACCO', 'transport', 'Fleet Pool', 15000, 8000, 'kg', 'Nakuru', 12.00, 20.00, 'standard');

-- Sample SACCO transactions
INSERT INTO supply_chain_sacco_transactions (user_id, sacco_name, transaction_type, amount, transaction_date, description) VALUES
((SELECT id FROM auth.users LIMIT 1), 'Mwihoko Farmers SACCO', 'contribution', 2000, '2024-01-15', 'Monthly contribution'),
((SELECT id FROM auth.users LIMIT 1), 'Mwihoko Farmers SACCO', 'loan_repayment', 15000, '2024-01-20', 'Tractor loan repayment'),
((SELECT id FROM auth.users OFFSET 1 LIMIT 1), 'Ushirika Transporters SACCO', 'contribution', 1500, '2024-01-10', 'Weekly contribution');

COMMENT ON TABLE supply_chain_sacco_membership IS 'SACCO membership - the foundation of Kenyan agricultural finance and trust';
COMMENT ON TABLE supply_chain_cooperative_resources IS 'Cooperative pooled resources - how Kenyans achieve economies of scale';
COMMENT ON TABLE supply_chain_sacco_transactions IS 'SACCO financial activities - tracking community-based financial responsibility';
COMMENT ON TABLE supply_chain_sacco_trust_boost IS 'SACCO-specific trust enhancements - community participation boosts reputation';

-- This integration makes the Trust Engine truly Kenyan by incorporating:
-- 1. SACCO membership as trust foundation
-- 2. Cooperative resource pooling
-- 3. Community-based financial responsibility
-- 4. Group purchasing power
-- 5. Collective market access
-- 6. SACCO-specific trust calculations
