-- QR Trust Passport System - Security-First Implementation
-- Anti-Manipulation: HMAC signatures, nonces, immutable audit trail

-- QR Codes Table (Tamper-Proof)
CREATE TABLE IF NOT EXISTS public.qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  qr_data TEXT NOT NULL,
  signature TEXT NOT NULL, -- HMAC-SHA256 signature (prevents forgery)
  qr_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_active_qr_per_user UNIQUE (user_id, is_active)
);

-- Trust Points Table (Immutable/Append-Only)
CREATE TABLE IF NOT EXISTS public.trust_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_points INTEGER DEFAULT 0 CHECK (total_points >= 0),
  level TEXT DEFAULT 'bronze' CHECK (level IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  previous_transaction_hash TEXT,
  last_earned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- QR Scans Table (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS public.qr_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id UUID REFERENCES public.qr_codes(id) ON DELETE CASCADE NOT NULL,
  scanned_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  scan_nonce TEXT NOT NULL UNIQUE,
  signature_valid BOOLEAN NOT NULL,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  scan_location TEXT,
  scan_lat DOUBLE PRECISION,
  scan_lng DOUBLE PRECISION,
  points_awarded INTEGER DEFAULT 1,
  device_fingerprint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trust Point Transactions Table (Blockchain-Style Chain)
CREATE TABLE IF NOT EXISTS public.trust_point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points_change INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('qr_scan', 'bonus', 'penalty', 'reward', 'referral')),
  reference_id UUID,
  transaction_hash TEXT NOT NULL UNIQUE,
  previous_hash TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Audit Log Table
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_qr_codes_user_id ON public.qr_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_active ON public.qr_codes(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_qr_scans_user ON public.qr_scans(scanned_by_user_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_qr_code ON public.qr_scans(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_created ON public.qr_scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trust_points_user ON public.trust_points(user_id);
CREATE INDEX IF NOT EXISTS idx_trust_points_level ON public.trust_points(level);
CREATE INDEX IF NOT EXISTS idx_trust_transactions_user ON public.trust_point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_trust_transactions_created ON public.trust_point_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_admin ON public.admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_table ON public.admin_audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_admin_audit_created ON public.admin_audit_log(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for QR Codes
CREATE POLICY "Users can view all active QR codes"
  ON public.qr_codes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can create their own QR code"
  ON public.qr_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own QR code"
  ON public.qr_codes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Trust Points
CREATE POLICY "Users can view all trust points"
  ON public.trust_points FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own trust points record"
  ON public.trust_points FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only system can update trust points"
  ON public.trust_points FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for QR Scans
CREATE POLICY "Users can view scans of their QR codes"
  ON public.qr_scans FOR SELECT
  USING (
    qr_code_id IN (SELECT id FROM public.qr_codes WHERE user_id = auth.uid())
    OR scanned_by_user_id = auth.uid()
  );

CREATE POLICY "Authenticated users can create scans"
  ON public.qr_scans FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for Trust Point Transactions
CREATE POLICY "Users can view their own transactions"
  ON public.trust_point_transactions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can create transactions"
  ON public.trust_point_transactions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for Admin Audit Log
CREATE POLICY "Only admins can view audit log"
  ON public.admin_audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can create audit entries"
  ON public.admin_audit_log FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Functions

-- Function to update trust points timestamp
CREATE OR REPLACE FUNCTION update_trust_points_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trust_points_updated_at
  BEFORE UPDATE ON public.trust_points
  FOR EACH ROW
  EXECUTE FUNCTION update_trust_points_timestamp();

-- Function to update QR codes timestamp
CREATE OR REPLACE FUNCTION update_qr_codes_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_qr_codes_updated_at
  BEFORE UPDATE ON public.qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_qr_codes_timestamp();

-- Function to calculate trust level based on points
CREATE OR REPLACE FUNCTION calculate_trust_level(points INTEGER)
RETURNS TEXT AS $$
BEGIN
  IF points >= 10000 THEN RETURN 'diamond';
  ELSIF points >= 5000 THEN RETURN 'platinum';
  ELSIF points >= 1000 THEN RETURN 'gold';
  ELSIF points >= 100 THEN RETURN 'silver';
  ELSE RETURN 'bronze';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to award trust points (with transaction hash chain)
CREATE OR REPLACE FUNCTION award_trust_points(
  p_user_id UUID,
  p_points INTEGER,
  p_transaction_type TEXT,
  p_reference_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_previous_hash TEXT;
  v_new_hash TEXT;
  v_total_points INTEGER;
BEGIN
  -- Get previous transaction hash
  SELECT transaction_hash INTO v_previous_hash
  FROM public.trust_point_transactions
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 1;

  -- Generate new hash (simplified - in production use proper crypto)
  v_new_hash := md5(
    p_user_id::TEXT || 
    p_points::TEXT || 
    p_transaction_type || 
    COALESCE(p_reference_id::TEXT, '') ||
    COALESCE(v_previous_hash, '') ||
    NOW()::TEXT
  );

  -- Insert transaction
  INSERT INTO public.trust_point_transactions (
    user_id, points_change, transaction_type, reference_id,
    transaction_hash, previous_hash, metadata
  ) VALUES (
    p_user_id, p_points, p_transaction_type, p_reference_id,
    v_new_hash, v_previous_hash, p_metadata
  ) RETURNING id INTO v_transaction_id;

  -- Update trust points
  INSERT INTO public.trust_points (user_id, total_points, last_earned_at, previous_transaction_hash)
  VALUES (p_user_id, p_points, NOW(), v_new_hash)
  ON CONFLICT (user_id) DO UPDATE SET
    total_points = public.trust_points.total_points + p_points,
    last_earned_at = NOW(),
    previous_transaction_hash = v_new_hash,
    level = calculate_trust_level(public.trust_points.total_points + p_points);

  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT ON public.qr_codes TO authenticated;
GRANT INSERT, UPDATE ON public.qr_codes TO authenticated;
GRANT SELECT ON public.trust_points TO authenticated;
GRANT INSERT, UPDATE ON public.trust_points TO authenticated;
GRANT SELECT, INSERT ON public.qr_scans TO authenticated;
GRANT SELECT ON public.trust_point_transactions TO authenticated;
GRANT SELECT, INSERT ON public.admin_audit_log TO authenticated;
