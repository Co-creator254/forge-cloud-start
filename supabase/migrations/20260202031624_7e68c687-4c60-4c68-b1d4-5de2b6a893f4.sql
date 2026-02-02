-- Create harvests table for harvest tracking forms
CREATE TABLE public.harvests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  crop_id UUID REFERENCES public.crops(id) ON DELETE CASCADE,
  harvest_date DATE NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  quality_grade TEXT,
  storage_location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.harvests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own harvests" ON public.harvests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own harvests" ON public.harvests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own harvests" ON public.harvests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own harvests" ON public.harvests FOR DELETE USING (auth.uid() = user_id);

-- Create pricing_reports table for market price submissions
CREATE TABLE public.pricing_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  commodity TEXT NOT NULL,
  price NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  market_name TEXT NOT NULL,
  county TEXT NOT NULL,
  location TEXT,
  quality_grade TEXT,
  notes TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pricing_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pricing reports" ON public.pricing_reports FOR SELECT USING (true);
CREATE POLICY "Users can create pricing reports" ON public.pricing_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pricing reports" ON public.pricing_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pricing reports" ON public.pricing_reports FOR DELETE USING (auth.uid() = user_id);

-- Create feature_requests table for user feedback/suggestions
CREATE TABLE public.feature_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view feature requests" ON public.feature_requests FOR SELECT USING (true);
CREATE POLICY "Users can create feature requests" ON public.feature_requests FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update their own feature requests" ON public.feature_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own feature requests" ON public.feature_requests FOR DELETE USING (auth.uid() = user_id);

-- Create event_registrations table for agricultural event signups
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_id UUID REFERENCES public.agricultural_events(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  organization TEXT,
  dietary_requirements TEXT,
  special_needs TEXT,
  status TEXT DEFAULT 'registered',
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own registrations" ON public.event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own registrations" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own registrations" ON public.event_registrations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own registrations" ON public.event_registrations FOR DELETE USING (auth.uid() = user_id);

-- Create market_sentiments table for market mood/trend submissions
CREATE TABLE public.market_sentiments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  commodity TEXT NOT NULL,
  county TEXT NOT NULL,
  sentiment TEXT NOT NULL CHECK (sentiment IN ('bullish', 'bearish', 'neutral')),
  price_expectation TEXT CHECK (price_expectation IN ('increase', 'decrease', 'stable')),
  reasoning TEXT,
  confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.market_sentiments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view market sentiments" ON public.market_sentiments FOR SELECT USING (true);
CREATE POLICY "Users can create market sentiments" ON public.market_sentiments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sentiments" ON public.market_sentiments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sentiments" ON public.market_sentiments FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_harvests_user_id ON public.harvests(user_id);
CREATE INDEX idx_harvests_crop_id ON public.harvests(crop_id);
CREATE INDEX idx_pricing_reports_commodity ON public.pricing_reports(commodity);
CREATE INDEX idx_pricing_reports_county ON public.pricing_reports(county);
CREATE INDEX idx_feature_requests_status ON public.feature_requests(status);
CREATE INDEX idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON public.event_registrations(user_id);
CREATE INDEX idx_market_sentiments_commodity ON public.market_sentiments(commodity);
CREATE INDEX idx_market_sentiments_county ON public.market_sentiments(county);

-- Add triggers for updated_at
CREATE TRIGGER update_harvests_updated_at BEFORE UPDATE ON public.harvests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pricing_reports_updated_at BEFORE UPDATE ON public.pricing_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_feature_requests_updated_at BEFORE UPDATE ON public.feature_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_event_registrations_updated_at BEFORE UPDATE ON public.event_registrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_market_sentiments_updated_at BEFORE UPDATE ON public.market_sentiments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();