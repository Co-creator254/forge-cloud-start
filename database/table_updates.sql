-- ========================================
-- SOKOCONNECT - TABLE UPDATES FOR ADVERTISEMENT SYSTEM
-- ========================================
-- This script handles existing tables and adds new functionality
-- Run this in your Supabase SQL editor

-- Step 1: Add new columns to existing advertisements table if they don't exist
DO $$
BEGIN
    -- Only proceed if advertisements table exists
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
        
        -- Add package_name column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'package_name') THEN
            ALTER TABLE advertisements ADD COLUMN package_name VARCHAR(100);
        END IF;
        
        -- Add package_duration_days column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'package_duration_days') THEN
            ALTER TABLE advertisements ADD COLUMN package_duration_days INTEGER;
        END IF;
        
        -- Add approved_by column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'approved_by') THEN
            ALTER TABLE advertisements ADD COLUMN approved_by UUID REFERENCES auth.users(id);
        END IF;
        
        -- Add approved_at column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'approved_at') THEN
            ALTER TABLE advertisements ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;
        END IF;
        
        -- Add rejection_reason column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'rejection_reason') THEN
            ALTER TABLE advertisements ADD COLUMN rejection_reason TEXT;
        END IF;
        
        -- Add admin_notes column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'admin_notes') THEN
            ALTER TABLE advertisements ADD COLUMN admin_notes TEXT;
        END IF;
        
        -- Add payment_method column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'payment_method') THEN
            ALTER TABLE advertisements ADD COLUMN payment_method VARCHAR(50);
        END IF;
        
        -- Add payment_amount column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'payment_amount') THEN
            ALTER TABLE advertisements ADD COLUMN payment_amount DECIMAL(10,2);
        END IF;
        
        -- Add views column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'views') THEN
            ALTER TABLE advertisements ADD COLUMN views INTEGER DEFAULT 0;
        END IF;
        
        -- Add clicks column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'clicks') THEN
            ALTER TABLE advertisements ADD COLUMN clicks INTEGER DEFAULT 0;
        END IF;
        
        -- Add inquiries column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advertisements' AND column_name = 'inquiries') THEN
            ALTER TABLE advertisements ADD COLUMN inquiries INTEGER DEFAULT 0;
        END IF;
    END IF;
END $$;

-- Step 2: Create new tables if they don't exist
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

CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    urgency VARCHAR(20) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'collected', 'expired')),
    donor_id UUID REFERENCES auth.users(id),
    recipient_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_market_suggestions_status ON market_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_market_suggestions_location ON market_suggestions(location);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_category ON donations(category);
CREATE INDEX IF NOT EXISTS idx_donations_urgency ON donations(urgency);
CREATE INDEX IF NOT EXISTS idx_donations_location ON donations(location);

-- Step 4: Create new user roles table if it doesn't exist
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
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Add columns to existing profiles table if they don't exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        -- Add role column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
            ALTER TABLE profiles ADD COLUMN role VARCHAR(50) DEFAULT 'farmer' CHECK (role IN (
                'farmer', 'buyer', 'supplier', 'transporter', 'financier', 
                'agent', 'processor', 'exporter', 'service_provider', 'trainer',
                'equipment_supplier', 'input_dealer', 'consultant', 'cooperative_admin', 'system_admin'
            ));
        END IF;
        
        -- Add cooperative_id column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'cooperative_id') THEN
            ALTER TABLE profiles ADD COLUMN cooperative_id UUID REFERENCES cooperatives(id);
        END IF;
        
        -- Add is_verified column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_verified') THEN
            ALTER TABLE profiles ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
        END IF;
        
        -- Add verification_status column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verification_status') THEN
            ALTER TABLE profiles ADD COLUMN verification_status VARCHAR(50) DEFAULT 'pending';
        END IF;
    END IF;
END $$;

-- ========================================
-- SUCCESS: Tables updated/created successfully
-- ========================================
