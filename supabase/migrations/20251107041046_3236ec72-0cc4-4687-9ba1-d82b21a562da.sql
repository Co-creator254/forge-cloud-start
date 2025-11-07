-- Create supply chain management tables
CREATE TABLE IF NOT EXISTS public.supply_chain_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  farm_id UUID REFERENCES public.farms,
  crop_id UUID REFERENCES public.crops,
  stage_name TEXT NOT NULL CHECK (stage_name IN ('planting', 'growth', 'harvest', 'storage', 'transport', 'market')),
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'delayed', 'problem')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE,
  end_date DATE,
  issues JSONB DEFAULT '[]'::jsonb,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.supply_chain_financial_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stage_id UUID REFERENCES public.supply_chain_stages ON DELETE CASCADE,
  cost_type TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  currency TEXT DEFAULT 'KES',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create road markets tables
CREATE TABLE IF NOT EXISTS public.road_markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  road TEXT NOT NULL,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  coordinates JSONB,
  active_vendors INTEGER DEFAULT 0,
  market_days TEXT[],
  contact_info TEXT,
  facilities TEXT[],
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.market_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID REFERENCES public.road_markets ON DELETE CASCADE NOT NULL,
  reporter_id UUID,
  reporter_name TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('price', 'condition', 'traffic', 'availability', 'other')),
  details TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create route vendors table
CREATE TABLE IF NOT EXISTS public.route_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name TEXT NOT NULL,
  route TEXT NOT NULL,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  products TEXT[] NOT NULL,
  contact TEXT,
  rating NUMERIC CHECK (rating >= 0 AND rating <= 5),
  verified BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create demand hotspots table
CREATE TABLE IF NOT EXISTS public.demand_hotspots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity TEXT NOT NULL,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  demand_level TEXT NOT NULL CHECK (demand_level IN ('high', 'medium', 'low')),
  buyer_count INTEGER DEFAULT 0,
  avg_price NUMERIC,
  price_trend TEXT CHECK (price_trend IN ('increasing', 'stable', 'decreasing')),
  description TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.supply_chain_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_chain_financial_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.road_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_hotspots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for supply_chain_stages
CREATE POLICY "Users can view their own supply chain stages"
  ON public.supply_chain_stages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own supply chain stages"
  ON public.supply_chain_stages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own supply chain stages"
  ON public.supply_chain_stages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own supply chain stages"
  ON public.supply_chain_stages FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for supply_chain_financial_analysis
CREATE POLICY "Users can view their own financial analysis"
  ON public.supply_chain_financial_analysis FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own financial analysis"
  ON public.supply_chain_financial_analysis FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own financial analysis"
  ON public.supply_chain_financial_analysis FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own financial analysis"
  ON public.supply_chain_financial_analysis FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for road_markets
CREATE POLICY "Anyone can view active road markets"
  ON public.road_markets FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Authenticated users can insert road markets"
  ON public.road_markets FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update road markets"
  ON public.road_markets FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for market_reports
CREATE POLICY "Anyone can view market reports"
  ON public.market_reports FOR SELECT
  USING (TRUE);

CREATE POLICY "Authenticated users can create market reports"
  ON public.market_reports FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for route_vendors
CREATE POLICY "Anyone can view route vendors"
  ON public.route_vendors FOR SELECT
  USING (TRUE);

CREATE POLICY "Authenticated users can insert route vendors"
  ON public.route_vendors FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update route vendors"
  ON public.route_vendors FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for demand_hotspots
CREATE POLICY "Anyone can view demand hotspots"
  ON public.demand_hotspots FOR SELECT
  USING (TRUE);

CREATE POLICY "Authenticated users can insert demand hotspots"
  ON public.demand_hotspots FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update demand hotspots"
  ON public.demand_hotspots FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_supply_chain_stages_user_id ON public.supply_chain_stages(user_id);
CREATE INDEX idx_supply_chain_stages_status ON public.supply_chain_stages(status);
CREATE INDEX idx_supply_chain_financial_stage_id ON public.supply_chain_financial_analysis(stage_id);
CREATE INDEX idx_road_markets_county ON public.road_markets(county);
CREATE INDEX idx_road_markets_active ON public.road_markets(is_active);
CREATE INDEX idx_market_reports_market_id ON public.market_reports(market_id);
CREATE INDEX idx_route_vendors_route ON public.route_vendors(route);
CREATE INDEX idx_demand_hotspots_commodity ON public.demand_hotspots(commodity);
CREATE INDEX idx_demand_hotspots_county ON public.demand_hotspots(county);

-- Create updated_at triggers
CREATE TRIGGER update_supply_chain_stages_updated_at
  BEFORE UPDATE ON public.supply_chain_stages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_supply_chain_financial_analysis_updated_at
  BEFORE UPDATE ON public.supply_chain_financial_analysis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_road_markets_updated_at
  BEFORE UPDATE ON public.road_markets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_route_vendors_updated_at
  BEFORE UPDATE ON public.route_vendors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();