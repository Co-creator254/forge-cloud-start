-- 🏦 SIMPLIFIED SACCO & COOPERATIVE SYSTEM - STANDALONE
-- Farmers can belong to either SACCOs or Cooperatives
-- Simple verification: SACCO/Cooperative verifies members, System Admin approves cooperatives
-- This file can be run independently without conflicts

-- =====================================================
-- SACCO MEMBERSHIP TABLE
-- Farmers add their SACCOs, SACCOs verify members
-- =====================================================

CREATE TABLE IF NOT EXISTS supply_chain_sacco_membership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  sacco_name TEXT NOT NULL,
  sacco_registration_number TEXT,
  membership_number TEXT,
  join_date DATE NOT NULL,
  membership_status TEXT DEFAULT 'pending' CHECK (membership_status IN ('pending', 'verified', 'rejected', 'active', 'suspended')),
  sacco_admin_name TEXT,
  sacco_admin_contact TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_by UUID REFERENCES auth.users, -- SACCO admin who verifies
  verification_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_sacco UNIQUE (user_id, sacco_name)
);

-- =====================================================
-- COOPERATIVE MEMBERSHIP TABLE  
-- Farmers add their cooperatives, cooperatives verify members
-- =====================================================

CREATE TABLE IF NOT EXISTS supply_chain_cooperative_membership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  cooperative_name TEXT NOT NULL,
  cooperative_registration_number TEXT,
  membership_number TEXT,
  join_date DATE NOT NULL,
  membership_status TEXT DEFAULT 'pending' CHECK (membership_status IN ('pending', 'verified', 'rejected', 'active', 'suspended')),
  cooperative_admin_name TEXT,
  cooperative_admin_contact TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_by UUID REFERENCES auth.users, -- Cooperative admin who verifies
  verification_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_cooperative UNIQUE (user_id, cooperative_name)
);

-- =====================================================
-- APPROVED COOPERATIVES TABLE
-- Only System Admin can approve cooperatives
-- =====================================================

CREATE TABLE IF NOT EXISTS supply_chain_approved_cooperatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_name TEXT NOT NULL UNIQUE,
  cooperative_registration_number TEXT UNIQUE,
  cooperative_type TEXT CHECK (cooperative_type IN ('farmers', 'transporters', 'traders', 'mixed', 'women_only', 'youth')),
  registration_date DATE NOT NULL,
  physical_address TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  cooperative_admin_name TEXT,
  cooperative_admin_position TEXT,
  cooperative_admin_contact TEXT,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'suspended')),
  approved_by UUID REFERENCES auth.users, -- System admin who approves
  approval_date TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- COMMUNITY TRUST SCORES TABLE
-- Standalone trust scores for SACCO/Cooperative integration
-- =====================================================

CREATE TABLE IF NOT EXISTS supply_chain_community_trust_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  sacco_membership_count INTEGER DEFAULT 0,
  cooperative_membership_count INTEGER DEFAULT 0,
  sacco_trust_boost INTEGER DEFAULT 0,
  cooperative_trust_boost INTEGER DEFAULT 0,
  community_trust_score DECIMAL(5,2) DEFAULT 0.00,
  total_trust_points INTEGER DEFAULT 0,
  trust_level TEXT DEFAULT 'bronze' CHECK (trust_level IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SIMPLIFIED VIEWS
-- =====================================================

-- User's SACCO and Cooperative memberships
CREATE OR REPLACE VIEW user_community_memberships AS
SELECT 
  u.id as user_id,
  u.email,
  -- SACCO memberships
  COUNT(DISTINCT CASE WHEN sm.verification_status = 'verified' THEN sm.sacco_name END) as verified_sacco_count,
  COUNT(DISTINCT CASE WHEN sm.membership_status = 'active' THEN sm.sacco_name END) as active_sacco_count,
  STRING_AGG(DISTINCT CASE WHEN sm.verification_status = 'verified' THEN sm.sacco_name END, ', ') as sacco_names,
  -- Cooperative memberships
  COUNT(DISTINCT CASE WHEN cm.verification_status = 'verified' THEN cm.cooperative_name END) as verified_cooperative_count,
  COUNT(DISTINCT CASE WHEN cm.membership_status = 'active' THEN cm.cooperative_name END) as active_cooperative_count,
  STRING_AGG(DISTINCT CASE WHEN cm.verification_status = 'verified' THEN cm.cooperative_name END, ', ') as cooperative_names,
  -- Trust impact
  cts.sacco_trust_boost,
  cts.cooperative_trust_boost,
  cts.community_trust_score,
  cts.total_trust_points,
  cts.trust_level
FROM auth.users u
LEFT JOIN supply_chain_community_trust_scores cts ON u.id = cts.user_id
LEFT JOIN supply_chain_sacco_membership sm ON u.id = sm.user_id
LEFT JOIN supply_chain_cooperative_membership cm ON u.id = cm.user_id
GROUP BY u.id, u.email, cts.sacco_trust_boost, cts.cooperative_trust_boost, cts.community_trust_score, cts.total_trust_points, cts.trust_level
ORDER BY u.email;

-- Approved cooperatives list
CREATE OR REPLACE VIEW approved_cooperatives_list AS
SELECT 
  ac.cooperative_name,
  ac.cooperative_type,
  ac.registration_date,
  ac.physical_address,
  ac.contact_phone,
  ac.contact_email,
  ac.cooperative_admin_name,
  ac.cooperative_admin_position,
  ac.approval_status,
  ac.approval_date,
  -- Count of verified members
  COUNT(DISTINCT cm.user_id) as verified_member_count
FROM supply_chain_approved_cooperatives ac
LEFT JOIN supply_chain_cooperative_membership cm ON ac.cooperative_name = cm.cooperative_name AND cm.verification_status = 'verified'
WHERE ac.approval_status = 'approved'
GROUP BY ac.id, ac.cooperative_name, ac.cooperative_type, ac.registration_date, ac.physical_address, ac.contact_phone, ac.contact_email, ac.cooperative_admin_name, ac.cooperative_admin_position, ac.approval_status, ac.approval_date
ORDER BY ac.cooperative_name;

-- =====================================================
-- SIMPLIFIED FUNCTIONS
-- =====================================================

-- Calculate community trust boost
CREATE OR REPLACE FUNCTION calculate_community_trust_boost(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  boost_points INTEGER DEFAULT 0;
  sacco_count INTEGER DEFAULT 0;
  cooperative_count INTEGER DEFAULT 0;
BEGIN
  -- Count verified SACCO memberships
  SELECT COUNT(*) INTO sacco_count
  FROM supply_chain_sacco_membership
  WHERE user_id = p_user_id AND verification_status = 'verified';
  
  -- Count verified cooperative memberships
  SELECT COUNT(*) INTO cooperative_count
  FROM supply_chain_cooperative_membership
  WHERE user_id = p_user_id AND verification_status = 'verified';
  
  -- Calculate boost points
  boost_points := (sacco_count * 10) + (cooperative_count * 15);
  
  RETURN boost_points;
END;
$$ LANGUAGE plpgsql;

-- Update community trust score
CREATE OR REPLACE FUNCTION update_community_trust_score(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  community_boost INTEGER DEFAULT 0;
  sacco_count INTEGER DEFAULT 0;
  cooperative_count INTEGER DEFAULT 0;
  total_points INTEGER DEFAULT 0;
  new_level TEXT DEFAULT 'bronze';
BEGIN
  -- Calculate community trust boost
  community_boost := calculate_community_trust_boost(p_user_id);
  
  -- Count memberships
  SELECT COUNT(*) INTO sacco_count
  FROM supply_chain_sacco_membership
  WHERE user_id = p_user_id AND verification_status = 'verified';
  
  SELECT COUNT(*) INTO cooperative_count
  FROM supply_chain_cooperative_membership
  WHERE user_id = p_user_id AND verification_status = 'verified';
  
  -- Calculate total trust points
  total_points := community_boost;
  
  -- Determine trust level
  new_level := CASE 
    WHEN total_points >= 1000 THEN 'diamond'
    WHEN total_points >= 500 THEN 'platinum'
    WHEN total_points >= 200 THEN 'gold'
    WHEN total_points >= 50 THEN 'silver'
    ELSE 'bronze'
  END;
  
  -- Update or insert community trust score
  INSERT INTO supply_chain_community_trust_scores (
    user_id, sacco_membership_count, cooperative_membership_count,
    sacco_trust_boost, cooperative_trust_boost, community_trust_score,
    total_trust_points, trust_level
  ) VALUES (
    p_user_id, sacco_count, cooperative_count,
    sacco_count * 10, cooperative_count * 15, 
    GREATEST(0, LEAST(100, community_boost)),
    total_points, new_level
  )
  ON CONFLICT (user_id) DO UPDATE SET
    sacco_membership_count = EXCLUDED.sacco_membership_count,
    cooperative_membership_count = EXCLUDED.cooperative_membership_count,
    sacco_trust_boost = EXCLUDED.sacco_trust_boost,
    cooperative_trust_boost = EXCLUDED.cooperative_trust_boost,
    community_trust_score = EXCLUDED.community_trust_score,
    total_trust_points = EXCLUDED.total_trust_points,
    trust_level = EXCLUDED.trust_level,
    last_updated = NOW();
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SIMPLIFIED TRIGGERS
-- =====================================================

-- Auto-update community trust when membership is verified
CREATE OR REPLACE FUNCTION trigger_community_trust_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update trust scores when SACCO or cooperative membership is verified
  IF NEW.verification_status = 'verified' AND OLD.verification_status != 'verified' THEN
    PERFORM update_community_trust_score(NEW.user_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for both SACCO and cooperative membership verification
DROP TRIGGER IF EXISTS sacco_trust_update_trigger ON supply_chain_sacco_membership;
CREATE TRIGGER sacco_trust_update_trigger
  AFTER UPDATE ON supply_chain_sacco_membership
  FOR EACH ROW EXECUTE FUNCTION trigger_community_trust_update();

DROP TRIGGER IF EXISTS cooperative_trust_update_trigger ON supply_chain_cooperative_membership;
CREATE TRIGGER cooperative_trust_update_trigger
  AFTER UPDATE ON supply_chain_cooperative_membership
  FOR EACH ROW EXECUTE FUNCTION trigger_community_trust_update();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_sacco_membership_user ON supply_chain_sacco_membership(user_id, verification_status);
CREATE INDEX IF NOT EXISTS idx_cooperative_membership_user ON supply_chain_cooperative_membership(user_id, verification_status);
CREATE INDEX IF NOT EXISTS idx_approved_cooperatives_status ON supply_chain_approved_cooperatives(approval_status);
CREATE INDEX IF NOT EXISTS idx_community_trust_user ON supply_chain_community_trust_scores(user_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE supply_chain_sacco_membership ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_cooperative_membership ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_approved_cooperatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_community_trust_scores ENABLE ROW LEVEL SECURITY;

-- Users can view their own memberships
CREATE POLICY "Users can view their own SACCO memberships" ON supply_chain_sacco_membership
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own cooperative memberships" ON supply_chain_cooperative_membership
  FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own memberships
CREATE POLICY "Users can manage their own SACCO memberships" ON supply_chain_sacco_membership
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own cooperative memberships" ON supply_chain_cooperative_membership
  FOR ALL USING (auth.uid() = user_id);

-- Only system admins can manage approved cooperatives
CREATE POLICY "Only system admins can manage approved cooperatives" ON supply_chain_approved_cooperatives
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Everyone can view approved cooperatives
CREATE POLICY "Everyone can view approved cooperatives" ON supply_chain_approved_cooperatives
  FOR SELECT USING (approval_status = 'approved');

-- Users can view their own community trust scores
CREATE POLICY "Users can view their own community trust scores" ON supply_chain_community_trust_scores
  FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- SAMPLE DATA REMOVED
-- =====================================================
-- Sample data has been removed to keep the system clean
-- You can add sample data manually after deployment if needed

COMMENT ON TABLE supply_chain_sacco_membership IS 'SACCO membership - farmers add their SACCOs, verification to be handled by application layer';
COMMENT ON TABLE supply_chain_cooperative_membership IS 'Cooperative membership - farmers add their cooperatives, verification to be handled by application layer';
COMMENT ON TABLE supply_chain_approved_cooperatives IS 'System admin approved cooperatives - only admins can approve new cooperatives';
COMMENT ON TABLE supply_chain_community_trust_scores IS 'Standalone community trust scores - no conflicts with existing trust system';

-- This simplified system provides:
-- 1. No table conflicts with existing supply chain schema
-- 2. Easy SACCO/Cooperative membership management
-- 3. Simple verification process handled by application logic
-- 4. Admin approval for cooperatives only
-- 5. Trust boost based on verified memberships
-- 6. Clear separation between SACCOs and cooperatives
-- 7. Minimal complexity while maintaining community trust benefits
-- 8. Can be run independently without RLS conflicts
-- 9. Clean deployment without sample data
-- 10. No complex role-based access that could cause security issues
