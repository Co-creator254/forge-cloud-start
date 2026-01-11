-- Create exporter_profiles table
CREATE TABLE public.exporter_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    business_registration TEXT,
    export_license_number TEXT,
    county TEXT,
    location TEXT,
    target_markets TEXT[] DEFAULT '{}',
    commodities_exported TEXT[] DEFAULT '{}',
    certifications TEXT[] DEFAULT '{}',
    years_experience INTEGER DEFAULT 0,
    annual_volume_capacity TEXT,
    payment_terms TEXT,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    rating NUMERIC(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create farmer_exporter_collaborations table
CREATE TABLE public.farmer_exporter_collaborations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    farmer_id UUID REFERENCES auth.users,
    exporter_id UUID REFERENCES public.exporter_profiles(id),
    farmer_name TEXT NOT NULL,
    farmer_phone TEXT NOT NULL,
    farmer_email TEXT,
    farmer_location TEXT,
    farmer_county TEXT,
    farm_size_acres NUMERIC,
    commodity_name TEXT NOT NULL,
    commodity_variety TEXT,
    estimated_quantity NUMERIC NOT NULL,
    unit TEXT DEFAULT 'kg',
    quality_grade TEXT,
    harvest_date DATE,
    availability_period TEXT,
    farmer_experience_years INTEGER,
    has_export_documentation BOOLEAN DEFAULT false,
    documentation_needs TEXT[] DEFAULT '{}',
    farmer_profile_description TEXT,
    collaboration_type TEXT DEFAULT 'supply_partnership',
    target_markets TEXT[] DEFAULT '{}',
    pricing_expectations TEXT,
    special_requirements TEXT[] DEFAULT '{}',
    farmer_certifications TEXT[] DEFAULT '{}',
    collaboration_status TEXT DEFAULT 'seeking_exporter',
    is_active BOOLEAN DEFAULT true,
    matched_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exporter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_exporter_collaborations ENABLE ROW LEVEL SECURITY;

-- Exporter profiles policies
CREATE POLICY "Anyone can view verified exporters" 
ON public.exporter_profiles FOR SELECT 
USING (status = 'active');

CREATE POLICY "Users can create exporter profiles" 
ON public.exporter_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their exporter profiles" 
ON public.exporter_profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Farmer-exporter collaborations policies
CREATE POLICY "Anyone can view active collaborations" 
ON public.farmer_exporter_collaborations FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can create collaboration requests" 
ON public.farmer_exporter_collaborations FOR INSERT 
WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their collaborations" 
ON public.farmer_exporter_collaborations FOR UPDATE 
USING (auth.uid() = farmer_id);

-- Add update triggers
CREATE TRIGGER update_exporter_profiles_updated_at
BEFORE UPDATE ON public.exporter_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farmer_exporter_collaborations_updated_at
BEFORE UPDATE ON public.farmer_exporter_collaborations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();