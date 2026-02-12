SET search_path = public;

-- Ensure pgcrypto for gen_random_uuid()
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') THEN
    BEGIN
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not create extension pgcrypto. Ensure gen_random_uuid() exists or replace defaults with uuid_generate_v4().';
    END;
  END IF;
END;
$$;

-- Core tables
CREATE TABLE IF NOT EXISTS public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_info jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
  lot_number text,
  quantity integer DEFAULT 0,
  received_at timestamptz,
  location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL,
  created_by uuid,
  tenant_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quality_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  inspector_id uuid,
  created_by uuid,
  status text NOT NULL CHECK (status IN ('pending','passed','failed','reworked')),
  notes text,
  measured_values jsonb,
  performed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.supply_chain_quality_control (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  batch_id uuid REFERENCES public.batches(id) ON DELETE SET NULL,
  location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL,
  check_id uuid REFERENCES public.quality_checks(id) ON DELETE SET NULL,
  status text NOT NULL CHECK (status IN ('open','investigating','closed')),
  severity text CHECK (severity IN ('low','medium','high')) DEFAULT 'low',
  reported_by uuid,
  assigned_to uuid,
  details jsonb,
  tenant_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE,
  full_name text,
  email text,
  role text DEFAULT 'inspector',
  tenant_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_batches_created_by ON public.batches(created_by);
CREATE INDEX IF NOT EXISTS idx_batches_product ON public.batches(product_id);
CREATE INDEX IF NOT EXISTS idx_batches_tenant_id ON public.batches(tenant_id);
CREATE INDEX IF NOT EXISTS idx_quality_checks_batch ON public.quality_checks(batch_id);
CREATE INDEX IF NOT EXISTS idx_quality_checks_inspector ON public.quality_checks(inspector_id);
CREATE INDEX IF NOT EXISTS idx_scqc_product_batch ON public.supply_chain_quality_control(product_id, batch_id);
CREATE INDEX IF NOT EXISTS idx_scqc_tenant ON public.supply_chain_quality_control(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_user_id ON public.user_profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tenant_id ON public.user_profiles(tenant_id);

-- Enable RLS
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_chain_quality_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION public.get_profile_id() RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT id FROM public.user_profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$;
REVOKE EXECUTE ON FUNCTION public.get_profile_id() FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_user_tenant() RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT tenant_id FROM public.user_profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$;
REVOKE EXECUTE ON FUNCTION public.get_user_tenant() FROM anon, authenticated;

-- Drop specific policies if they exist (one DO block per table)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    WHERE c.relname = 'batches' AND p.polname = 'batches_owner_select'
  ) THEN
    EXECUTE 'DROP POLICY "batches_owner_select" ON public.batches';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    WHERE c.relname = 'batches' AND p.polname = 'batches_owner_all'
  ) THEN
    EXECUTE 'DROP POLICY "batches_owner_all" ON public.batches';
  END IF;
END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    WHERE c.relname = 'quality_checks' AND p.polname = 'qc_inspector_access'
  ) THEN
    EXECUTE 'DROP POLICY "qc_inspector_access" ON public.quality_checks';
  END IF;
END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    WHERE c.relname = 'supply_chain_quality_control' AND p.polname = 'scqc_tenant_access'
  ) THEN
    EXECUTE 'DROP POLICY "scqc_tenant_access" ON public.supply_chain_quality_control';
  END IF;
END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    WHERE c.relname = 'user_profiles' AND p.polname = 'profiles_self'
  ) THEN
    EXECUTE 'DROP POLICY "profiles_self" ON public.user_profiles';
  END IF;
END;
$$;

-- Create policies
CREATE POLICY "batches_owner_select" ON public.batches
  FOR SELECT TO authenticated
  USING ((created_by IS NULL) OR (created_by = auth.uid()));

CREATE POLICY "batches_owner_all" ON public.batches
  FOR ALL TO authenticated
  USING ((created_by IS NULL) OR (created_by = auth.uid()))
  WITH CHECK ((created_by IS NULL) OR (created_by = auth.uid()));

CREATE POLICY "qc_inspector_access" ON public.quality_checks
  FOR ALL TO authenticated
  USING (
    (inspector_id IS NOT NULL AND inspector_id = auth.uid())
    OR (created_by IS NOT NULL AND created_by = auth.uid())
  )
  WITH CHECK (
    (inspector_id IS NOT NULL AND inspector_id = auth.uid())
    OR (created_by IS NOT NULL AND created_by = auth.uid())
  );

CREATE POLICY "scqc_tenant_access" ON public.supply_chain_quality_control
  FOR ALL TO authenticated
  USING (
    reported_by = auth.uid() OR assigned_to = auth.uid()
    OR (tenant_id IS NOT NULL AND tenant_id = get_user_tenant())
    OR EXISTS (
      SELECT 1 FROM public.batches b
      WHERE b.id = supply_chain_quality_control.batch_id
      AND b.tenant_id IS NOT NULL
      AND b.tenant_id = get_user_tenant()
    )
  )
  WITH CHECK (
    reported_by = auth.uid() OR assigned_to = auth.uid()
    OR (tenant_id IS NOT NULL AND tenant_id = get_user_tenant())
    OR EXISTS (
      SELECT 1 FROM public.batches b
      WHERE b.id = supply_chain_quality_control.batch_id
      AND b.tenant_id IS NOT NULL
      AND b.tenant_id = get_user_tenant()
    )
  );

CREATE POLICY "profiles_self" ON public.user_profiles
  FOR ALL TO authenticated
  USING (
    auth_user_id = auth.uid() OR (auth.jwt() ->> 'role') = 'admin'
  )
  WITH CHECK (
    auth_user_id = auth.uid() OR (auth.jwt() ->> 'role') = 'admin'
  );

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.batches TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quality_checks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.supply_chain_quality_control TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.trigger_set_timestamp() FROM anon, authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'batches_set_timestamp' AND c.relname = 'batches'
  ) THEN
    EXECUTE 'CREATE TRIGGER batches_set_timestamp BEFORE UPDATE ON public.batches FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp()';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'quality_checks_set_timestamp' AND c.relname = 'quality_checks'
  ) THEN
    EXECUTE 'CREATE TRIGGER quality_checks_set_timestamp BEFORE UPDATE ON public.quality_checks FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp()';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'scqc_set_timestamp' AND c.relname = 'supply_chain_quality_control'
  ) THEN
    EXECUTE 'CREATE TRIGGER scqc_set_timestamp BEFORE UPDATE ON public.supply_chain_quality_control FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp()';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'profiles_set_timestamp' AND c.relname = 'user_profiles'
  ) THEN
    EXECUTE 'CREATE TRIGGER profiles_set_timestamp BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp()';
  END IF;
END;
$$;

-- View
CREATE OR REPLACE VIEW public.v_batch_qc_summary AS
SELECT
  b.id AS batch_id,
  b.lot_number,
  b.product_id,
  p.name AS product_name,
  COUNT(q.id) FILTER (WHERE q.status = 'passed') AS passed_checks,
  COUNT(q.id) FILTER (WHERE q.status = 'failed') AS failed_checks,
  MAX(q.performed_at) AS last_check_at
FROM public.batches b
LEFT JOIN public.products p ON p.id = b.product_id
LEFT JOIN public.quality_checks q ON q.batch_id = b.id
GROUP BY b.id, b.lot_number, b.product_id, p.name;

COMMENT ON TABLE public.supply_chain_quality_control IS 'Consolidated QC issues across batches/products/locations (created/updated by auth users).';
COMMENT ON TABLE public.quality_checks IS 'Inspector QC entries linked to batches.';