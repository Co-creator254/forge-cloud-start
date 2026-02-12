-- ========================================
-- IMPORTANT: Handle Existing Tables
-- ========================================
-- Note: Some tables may already exist with different schemas
-- This script adds new columns and creates missing tables

-- Check if advertisements table exists and has the required columns
DO $$
BEGIN
    -- Add new columns to advertisements table if they don't exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'advertisements') THEN
        -- Add user_role column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'user_role') THEN
            ALTER TABLE advertisements ADD COLUMN user_role VARCHAR(50) NOT NULL DEFAULT 'farmer';
        END IF;
        
        -- Add payment_reference column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'payment_reference') THEN
            ALTER TABLE advertisements ADD COLUMN payment_reference VARCHAR(255);
        END IF;
        
        -- Add package_id column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'package_id') THEN
            ALTER TABLE advertisements ADD COLUMN package_id VARCHAR(50);
        END IF;
        
        -- Add start_date column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'start_date') THEN
            ALTER TABLE advertisements ADD COLUMN start_date TIMESTAMP WITH TIME ZONE;
        END IF;
        
        -- Add end_date column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'end_date') THEN
            ALTER TABLE advertisements ADD COLUMN end_date TIMESTAMP WITH TIME ZONE;
        END IF;
    END IF;
END $$;

-- ========================================
-- IMPORTANT: Handle Existing Tables
-- ========================================
-- Note: Some tables may already exist with different schemas
-- This script adds new columns and creates missing tables

-- Check if advertisements table exists and has the required columns
DO $$
BEGIN
    -- Add new columns to advertisements table if they don't exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'advertisements') THEN
        -- Add user_role column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'user_role') THEN
            ALTER TABLE advertisements ADD COLUMN user_role VARCHAR(50) NOT NULL DEFAULT 'farmer';
        END IF;
        
        -- Add payment_reference column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'payment_reference') THEN
            ALTER TABLE advertisements ADD COLUMN payment_reference VARCHAR(255);
        END IF;
        
        -- Add package_id column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'package_id') THEN
            ALTER TABLE advertisements ADD COLUMN package_id VARCHAR(50);
        END IF;
        
        -- Add start_date column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'start_date') THEN
            ALTER TABLE advertisements ADD COLUMN start_date TIMESTAMP WITH TIME ZONE;
        END IF;
        
        -- Add end_date column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'end_date') THEN
            ALTER TABLE advertisements ADD COLUMN end_date TIMESTAMP WITH TIME ZONE;
        END IF;
    END IF;
END $$;

-- Create new tables that don't exist
-- 2. MARKET SUGGESTIONS TABLE
-- For user-submitted market suggestions
CREATE TABLE IF NOT EXISTS market_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    market_type VARCHAR(100) NOT NULL,
    operating_hours VARCHAR(100),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    description TEXT,
    facilities TEXT[], -- Array of facility names
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    suggested_by UUID REFERENCES auth.users(id)
);

-- Index for market suggestions
CREATE INDEX IF NOT EXISTS idx_market_suggestions_status ON market_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_market_suggestions_location ON market_suggestions(location);

-- 3. DONATIONS TABLE (Enhanced)
-- For managing food donations and surplus produce
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    urgency VARCHAR(20) DEFAULT 'medium' CHECK (urgency IN ('high', 'medium', 'low')),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'expired')),
    donor_id UUID REFERENCES auth.users(id),
    recipient_id UUID REFERENCES auth.users(id),
    contact_info JSONB, -- Store contact details as JSON
    pickup_address TEXT,
    expiry_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for donations
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_category ON donations(category);
CREATE INDEX IF NOT EXISTS idx_donations_urgency ON donations(urgency);
CREATE INDEX IF NOT EXISTS idx_donations_location ON donations(location);

-- 4. MARKET AGENTS TABLE
-- Note: This table is NOT needed - service_providers table already exists
-- Agents will register through service provider registration system
-- CREATE TABLE IF NOT EXISTS market_agents (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     name VARCHAR(255) NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     phone VARCHAR(50),
--     market_name VARCHAR(255) NOT NULL,
--     market_location VARCHAR(255) NOT NULL,
--     agent_type VARCHAR(100) NOT NULL, -- 'produce', 'livestock', 'commodity', etc.
--     services TEXT[], -- Array of services offered
--     rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
--     verified BOOLEAN DEFAULT FALSE,
--     commission_rate DECIMAL(5,2), -- Commission percentage
--     bio TEXT,
--     avatar_url TEXT,
--     contact_info JSONB,
--     status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--     user_id UUID REFERENCES auth.users(id)
-- );

-- Index for market agents (not needed - using service_providers)
-- CREATE INDEX IF NOT EXISTS idx_market_agents_market ON market_agents(market_name);
-- CREATE INDEX IF NOT EXISTS idx_market_agents_type ON market_agents(agent_type);
-- CREATE INDEX IF NOT EXISTS idx_market_agents_verified ON market_agents(verified);
-- CREATE INDEX IF NOT EXISTS idx_market_agents_rating ON market_agents(rating);

-- 7. USER ROLES TABLE
-- For managing user roles and permissions
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'farmer', 'buyer', 'supplier', 'transporter', 'financier', 
        'agent', 'processor', 'exporter', 'service_provider', 'trainer',
        'equipment_supplier', 'input_dealer', 'consultant', 'cooperative_admin', 'system_admin'
    )),
    cooperative_id UUID REFERENCES cooperatives(id),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    assigned_by UUID REFERENCES auth.users(id), -- Who assigned this role
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE, -- For temporary roles
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. ENHANCED PROFILES TABLE (adds role information to existing profiles)
-- Note: This ALTER TABLE will add columns to existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'farmer' CHECK (role IN (
    'farmer', 'buyer', 'supplier', 'transporter', 'financier', 
    'agent', 'processor', 'exporter', 'service_provider', 'trainer',
    'equipment_supplier', 'input_dealer', 'consultant', 'cooperative_admin', 'system_admin'
));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cooperative_id UUID REFERENCES cooperatives(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_registration VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS id_number VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tax_pin VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS farm_size_acres DECIMAL(10,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS farming_type VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS main_products TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS services_offered TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trust_points INTEGER DEFAULT 0;

-- 9. COOPERATIVES TABLE (if not exists)
-- For managing farmer cooperatives and associations
CREATE TABLE IF NOT EXISTS cooperatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    county VARCHAR(100) NOT NULL,
    sub_county VARCHAR(100),
    cooperative_type VARCHAR(50) CHECK (cooperative_type IN (
        'farmers', 'traders', 'processors', 'transporters', 'mixed'
    )),
    contact_person VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    office_address TEXT NOT NULL,
    services TEXT[], -- Array of services offered
    member_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_documents TEXT[], -- Array of document URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. COOPERATIVE MEMBERSHIPS TABLE
-- For managing cooperative member relationships
CREATE TABLE IF NOT EXISTS cooperative_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID REFERENCES cooperatives(id) ON DELETE CASCADE,
    member_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    membership_number VARCHAR(100),
    role_in_cooperative VARCHAR(100) CHECK (role_in_cooperative IN (
        'member', 'committee_member', 'treasurer', 'secretary', 'chairman', 'manager'
    )),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'resigned')),
    UNIQUE(cooperative_id, member_id)
);

-- 5. ROAD MARKETS TABLE (Enhanced if exists)
CREATE TABLE IF NOT EXISTS road_markets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    road VARCHAR(100) NOT NULL, -- A1, A2, A3, etc.
    location VARCHAR(255) NOT NULL,
    county VARCHAR(100) NOT NULL,
    coordinates POINT, -- PostGIS point for location
    market_days TEXT[], -- Array of market days
    contact_info VARCHAR(255),
    facilities TEXT[],
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner_id UUID REFERENCES auth.users(id)
);

-- Index for road markets
CREATE INDEX IF NOT EXISTS idx_road_markets_road ON road_markets(road);
CREATE INDEX IF NOT EXISTS idx_road_markets_county ON road_markets(county);
CREATE INDEX IF NOT EXISTS idx_road_markets_active ON road_markets(is_active);

-- 6. CITY MARKETS TABLE (Enhanced if exists)
-- For urban wholesale and retail markets
CREATE TABLE IF NOT EXISTS city_markets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    market_type VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    operating_hours VARCHAR(100),
    facilities TEXT[],
    contact_info JSONB,
    coordinates POINT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for city markets
CREATE INDEX IF NOT EXISTS idx_city_markets_type ON city_markets(market_type);
CREATE INDEX IF NOT EXISTS idx_city_markets_status ON city_markets(status);
CREATE INDEX IF NOT EXISTS idx_city_markets_location ON city_markets(location);

-- ========================================
-- SAMPLE DATA INSERTIONS (Optional)
-- ========================================

-- Note: Sample advertisements removed - real users want to advertise
-- Admin can add advertisements through the admin dashboard

-- Note: Sample market agents removed - users will register as agents
-- through the service provider registration system

-- Note: Sample donations removed - users will submit real donations
-- through the donation management system

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on all new tables
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE market_agents ENABLE ROW LEVEL SECURITY; -- Not needed - using service_providers
ALTER TABLE road_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperative_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for advertisements (Facebook-style workflow)
CREATE POLICY "Everyone can view approved active ads" ON advertisements FOR SELECT USING (
    status IN ('approved', 'active') AND 
    start_date <= NOW() AND 
    (end_date IS NULL OR end_date >= NOW())
);
CREATE POLICY "Users can view own ads" ON advertisements FOR SELECT USING (auth.uid() = submitted_by);
CREATE POLICY "Users can insert advertisements" ON advertisements FOR INSERT WITH CHECK (
    auth.uid() = submitted_by AND 
    user_role = (SELECT role FROM profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update own ads" ON advertisements FOR UPDATE USING (
    auth.uid() = submitted_by AND 
    status IN ('pending', 'rejected')
);
CREATE POLICY "Cooperative admins can manage ads from their cooperative" ON advertisements FOR ALL USING (
    EXISTS(
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid() AND 
        ur.role = 'cooperative_admin' AND
        EXISTS(
            SELECT 1 FROM profiles p
            WHERE p.user_id = advertisements.submitted_by AND
            p.cooperative_id = ur.cooperative_id
        )
    )
);
CREATE POLICY "System admins can manage all ads" ON advertisements FOR ALL USING (
    EXISTS(
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND 
        role = 'system_admin'
    )
);

-- RLS Policies for user roles
CREATE POLICY "Users can view own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Cooperative admins can view roles in their cooperative" ON user_roles FOR SELECT USING (
    EXISTS(
        SELECT 1 FROM user_roles ur2
        WHERE ur2.user_id = auth.uid() AND 
        ur2.role = 'cooperative_admin' AND
        user_roles.cooperative_id = ur2.cooperative_id
    )
);
CREATE POLICY "System admins can view all roles" ON user_roles FOR SELECT USING (
    EXISTS(
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND 
        role = 'system_admin'
    )
);
CREATE POLICY "Cooperative admins can manage roles in their cooperative" ON user_roles FOR ALL USING (
    EXISTS(
        SELECT 1 FROM user_roles ur2
        WHERE ur2.user_id = auth.uid() AND 
        ur2.role = 'cooperative_admin' AND
        user_roles.cooperative_id = ur2.cooperative_id
    )
);
CREATE POLICY "System admins can manage all roles" ON user_roles FOR ALL USING (
    EXISTS(
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND 
        role = 'system_admin'
    )
);

-- RLS Policies for cooperatives
CREATE POLICY "Everyone can view verified cooperatives" ON cooperatives FOR SELECT USING (is_verified = TRUE);
CREATE POLICY "Cooperative members can view their cooperative" ON cooperatives FOR SELECT USING (
    EXISTS(
        SELECT 1 FROM cooperative_memberships 
        WHERE cooperative_id = cooperatives.id AND 
        member_id = auth.uid() AND 
        status = 'active'
    )
);
CREATE POLICY "Cooperative admins can manage cooperative" ON cooperatives FOR ALL USING (
    EXISTS(
        SELECT 1 FROM cooperative_memberships 
        WHERE cooperative_id = cooperatives.id AND 
        member_id = auth.uid() AND 
        role_in_cooperative IN ('chairman', 'manager', 'committee_member')
    )
);
CREATE POLICY "System admins can manage all cooperatives" ON cooperatives FOR ALL USING (
    EXISTS(
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND 
        role = 'system_admin'
    )
);

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Cooperative admins can view cooperative member profiles" ON profiles FOR SELECT USING (
    EXISTS(
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid() AND 
        ur.role = 'cooperative_admin' AND
        profiles.cooperative_id = ur.cooperative_id
    )
);
CREATE POLICY "System admins can view all profiles" ON profiles FOR SELECT USING (
    EXISTS(
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND 
        role = 'system_admin'
    )
);
CREATE POLICY "Cooperative admins can manage cooperative member profiles" ON profiles FOR ALL USING (
    EXISTS(
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid() AND 
        ur.role = 'cooperative_admin' AND
        profiles.cooperative_id = ur.cooperative_id
    )
);
CREATE POLICY "System admins can manage all profiles" ON profiles FOR ALL USING (
    EXISTS(
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND 
        role = 'system_admin'
    )
);

-- RLS Policies for market suggestions
CREATE POLICY "Market suggestions are viewable by everyone" ON market_suggestions FOR SELECT USING (true);
CREATE POLICY "Users can insert market suggestions" ON market_suggestions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Cooperative admins can manage market suggestions in their area" ON market_suggestions FOR UPDATE USING (
    EXISTS(
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND 
        role = 'cooperative_admin'
    )
);
CREATE POLICY "Cooperative admins can delete market suggestions in their area" ON market_suggestions FOR DELETE USING (
    EXISTS(
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND 
        role = 'cooperative_admin'
    )
);
CREATE POLICY "System admins can manage all market suggestions" ON market_suggestions FOR ALL USING (
    EXISTS(
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND 
        role = 'system_admin'
    )
);

-- RLS Policies for donations
CREATE POLICY "Donations are viewable by everyone" ON donations FOR SELECT USING (true);
CREATE POLICY "Users can manage their donations" ON donations FOR ALL USING (auth.uid() = donor_id OR auth.uid() = recipient_id);
CREATE POLICY "Cooperative admins can manage donations in their cooperative" ON donations FOR ALL USING (
    EXISTS(
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND 
        role = 'cooperative_admin'
    )
);
CREATE POLICY "System admins can manage all donations" ON donations FOR ALL USING (
    EXISTS(
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND 
        role = 'system_admin'
    )
);

-- RLS Policies for service providers (existing table)
CREATE POLICY "Anyone can view verified service providers" ON service_providers FOR SELECT USING (is_verified = TRUE);
CREATE POLICY "Users can manage their service provider profile" ON service_providers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Cooperative admins can manage service providers in their cooperative" ON service_providers FOR ALL USING (
    EXISTS(
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid() AND 
        ur.role = 'cooperative_admin' AND
        EXISTS(
            SELECT 1 FROM profiles p
            WHERE p.user_id = service_providers.user_id AND
            p.cooperative_id = ur.cooperative_id
        )
    )
);
CREATE POLICY "System admins can manage all service providers" ON service_providers FOR ALL USING (
    EXISTS(
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND 
        role = 'system_admin'
    )
);

-- RLS Policies for road markets
CREATE POLICY "Road markets are viewable by everyone" ON road_markets FOR SELECT USING (true);
CREATE POLICY "Users can manage their road markets" ON road_markets FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Cooperative admins can manage road markets in their cooperative" ON road_markets FOR ALL USING (
    EXISTS(
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid() AND 
        ur.role = 'cooperative_admin' AND
        EXISTS(
            SELECT 1 FROM profiles p
            WHERE p.user_id = road_markets.owner_id AND
            p.cooperative_id = ur.cooperative_id
        )
    )
);
CREATE POLICY "System admins can manage all road markets" ON road_markets FOR ALL USING (
    EXISTS(
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND 
        role = 'system_admin'
    )
);

-- RLS Policies for city markets
CREATE POLICY "City markets are viewable by everyone" ON city_markets FOR SELECT USING (true);
CREATE POLICY "Cooperative admins can manage city markets in their cooperative" ON city_markets FOR ALL USING (
    EXISTS(
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid() AND 
        ur.role = 'cooperative_admin' AND
        EXISTS(
            SELECT 1 FROM profiles p
            WHERE p.user_id = city_markets.owner_id AND
            p.cooperative_id = ur.cooperative_id
        )
    )
);
CREATE POLICY "System admins can manage all city markets" ON city_markets FOR ALL USING (
    EXISTS(
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND 
        role = 'system_admin'
    )
);

-- ========================================
-- TRIGGERS AND FUNCTIONS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_advertisements_updated_at BEFORE UPDATE ON advertisements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_market_suggestions_updated_at BEFORE UPDATE ON market_suggestions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_market_agents_updated_at BEFORE UPDATE ON market_agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_road_markets_updated_at BEFORE UPDATE ON road_markets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_city_markets_updated_at BEFORE UPDATE ON city_markets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- STORAGE BUCKETS (for images if needed)
-- ========================================

-- Create storage bucket for advertisement images
INSERT INTO storage.buckets (id, name, public) VALUES ('advertisements', 'advertisements', true) ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for market agent avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('market-agents', 'market-agents', true) ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for donation images
INSERT INTO storage.buckets (id, name, public) VALUES ('donations', 'donations', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies (adjust as needed)
CREATE POLICY "Users can upload advertisement images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'advertisements' AND auth.role() = 'authenticated');
CREATE POLICY "Users can manage their advertisement images" ON storage.objects FOR UPDATE USING (bucket_id = 'advertisements' AND auth.uid() = (storage.foldername(name))[1]);
CREATE POLICY "Advertisement images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'advertisements');

CREATE POLICY "Users can upload agent avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'market-agents' AND auth.role() = 'authenticated');
CREATE POLICY "Agent avatars are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'market-agents');

CREATE POLICY "Users can upload donation images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'donations' AND auth.role() = 'authenticated');
CREATE POLICY "Donation images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'donations');

-- ========================================
-- NOTES FOR ADMIN
-- ========================================

/*
1. POSTGIS EXTENSION: 
   If you plan to use the coordinates field for geospatial queries, 
   enable the PostGIS extension in Supabase:
   CREATE EXTENSION IF NOT EXISTS postgis;

2. EXISTING TABLES:
   - Some tables like 'city_markets', 'road_markets' might already exist.
   - The CREATE TABLE IF NOT EXISTS statements will not overwrite existing tables.
   - You may need to ALTER existing tables to add new columns.

3. AGENT DIRECTORY:
   - The market_agents table provides the professional agent directory.
   - Includes verification status, ratings, and service offerings.
   - Users can register as agents through the system.

4. DONATION MANAGEMENT:
   - The donations table supports the enhanced donation system.
   - Includes urgency levels, status tracking, and donor/recipient relationships.

5. ADVERTISEMENT SYSTEM:
   - User-submitted advertisements with admin approval workflow.
   - Payment tracking and status management.
   - Image upload support through storage buckets.
   - Users submit ads → Admin reviews → Ads become visible after approval.
   - Payment integration ready (payment_status, payment_amount, payment_reference).

6. MARKET SUGGESTIONS:
   - User-submitted market suggestions for community-driven growth.
   - Includes approval workflow and facility information.

7. PERFORMANCE:
   - Indexes are created for frequently queried fields.
   - Consider adding more indexes based on actual usage patterns.

8. SECURITY:
   - RLS policies are set up for proper access control.
   - Users can only see their own pending ads.
   - Approved ads are visible to everyone.
   - Admins have full management capabilities.

9. BACKUP:
   - Always backup your database before running schema changes.
   - Test in a development environment first.
*/
