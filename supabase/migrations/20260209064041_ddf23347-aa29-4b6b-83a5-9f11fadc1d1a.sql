-- Ad Placements table for admin-managed advertising slots
CREATE TABLE IF NOT EXISTS public.ad_placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_name TEXT NOT NULL UNIQUE,
  slot_label TEXT NOT NULL,
  page_route TEXT NOT NULL,
  position TEXT NOT NULL DEFAULT 'inline',
  max_ads INTEGER NOT NULL DEFAULT 3,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ads assigned to placements
CREATE TABLE IF NOT EXISTS public.ad_slot_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID REFERENCES public.ad_placements(id) ON DELETE CASCADE NOT NULL,
  advertisement_id UUID NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ad_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_slot_assignments ENABLE ROW LEVEL SECURITY;

-- RLS: Everyone can read active ad placements
CREATE POLICY "Anyone can view active ad placements"
  ON public.ad_placements FOR SELECT
  USING (is_active = true);

-- RLS: Only admins can manage ad placements (via service role or admin check)
CREATE POLICY "Admins can manage ad placements"
  ON public.ad_placements FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- RLS: Everyone can read active ad assignments
CREATE POLICY "Anyone can view active ad assignments"
  ON public.ad_slot_assignments FOR SELECT
  USING (is_active = true);

-- RLS: Only admins can manage ad assignments
CREATE POLICY "Admins can manage ad assignments"
  ON public.ad_slot_assignments FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Seed default ad placement slots
INSERT INTO public.ad_placements (slot_name, slot_label, page_route, position, max_ads) VALUES
  ('marketplace_hero', 'Marketplace Hero Banner', '/marketplace', 'hero', 5),
  ('marketplace_between_sections', 'Marketplace Between Sections', '/marketplace', 'inline', 4),
  ('home_hero', 'Home Page Hero', '/', 'hero', 3),
  ('market_prices_sidebar', 'Market Prices Page', '/market-prices', 'sidebar', 3),
  ('f2c_marketplace', 'F2C Marketplace Banner', '/f2c-marketplace', 'banner', 3),
  ('partners_showcase', 'Partners Showcase', '/partners-showcase', 'inline', 4),
  ('equipment_marketplace', 'Equipment Marketplace', '/equipment-marketplace', 'banner', 3)
ON CONFLICT (slot_name) DO NOTHING;

-- Update timestamp trigger
CREATE TRIGGER update_ad_placements_updated_at
  BEFORE UPDATE ON public.ad_placements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ad_slot_assignments_updated_at
  BEFORE UPDATE ON public.ad_slot_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();