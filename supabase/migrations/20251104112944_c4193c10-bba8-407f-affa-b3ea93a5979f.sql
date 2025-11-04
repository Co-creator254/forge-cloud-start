-- ============================================
-- FARMER PORTAL COMPLETE DATABASE SCHEMA
-- ============================================

-- 1. Land Parcels Table
CREATE TABLE IF NOT EXISTS public.land_parcels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  size NUMERIC NOT NULL CHECK (size > 0),
  unit TEXT NOT NULL DEFAULT 'acres',
  crop TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'fallow')),
  last_harvest DATE,
  next_harvest_date DATE,
  latitude NUMERIC,
  longitude NUMERIC,
  soil_type TEXT,
  irrigation_type TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.land_parcels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own land parcels"
ON public.land_parcels FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own land parcels"
ON public.land_parcels FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own land parcels"
ON public.land_parcels FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own land parcels"
ON public.land_parcels FOR DELETE
USING (auth.uid() = user_id);

-- 2. Crops Table
CREATE TABLE IF NOT EXISTS public.crops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parcel_id UUID REFERENCES public.land_parcels(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  variety TEXT,
  planting_date DATE,
  expected_harvest_date DATE,
  actual_harvest_date DATE,
  area NUMERIC NOT NULL CHECK (area > 0),
  area_unit TEXT NOT NULL DEFAULT 'm²',
  current_yield NUMERIC,
  previous_yield NUMERIC,
  yield_unit TEXT DEFAULT 'kg',
  quality TEXT CHECK (quality IN ('Excellent', 'Good', 'Average', 'Poor')),
  status TEXT NOT NULL DEFAULT 'growing' CHECK (status IN ('planning', 'growing', 'harvesting', 'harvested', 'failed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own crops"
ON public.crops FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own crops"
ON public.crops FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crops"
ON public.crops FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crops"
ON public.crops FOR DELETE
USING (auth.uid() = user_id);

-- 3. Farm Inventory Table
CREATE TABLE IF NOT EXISTS public.farm_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Seeds', 'Fertilizers', 'Pesticides', 'Tools', 'Equipment', 'Fuel', 'Lubricants', 'Planting Material', 'Other')),
  quantity NUMERIC NOT NULL CHECK (quantity >= 0),
  unit TEXT NOT NULL,
  unit_price NUMERIC CHECK (unit_price >= 0),
  total_value NUMERIC GENERATED ALWAYS AS (quantity * unit_price) STORED,
  minimum_quantity NUMERIC DEFAULT 0 CHECK (minimum_quantity >= 0),
  supplier TEXT,
  purchase_date DATE,
  expiry_date DATE,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.farm_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own inventory"
ON public.farm_inventory FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inventory"
ON public.farm_inventory FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory"
ON public.farm_inventory FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory"
ON public.farm_inventory FOR DELETE
USING (auth.uid() = user_id);

-- 4. Farm Budgets Table
CREATE TABLE IF NOT EXISTS public.farm_budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Seeds', 'Fertilizers', 'Pesticides', 'Labor', 'Equipment', 'Irrigation', 'Transport', 'Marketing', 'Other')),
  subcategory TEXT,
  planned_amount NUMERIC NOT NULL CHECK (planned_amount >= 0),
  actual_amount NUMERIC CHECK (actual_amount >= 0),
  variance NUMERIC GENERATED ALWAYS AS (actual_amount - planned_amount) STORED,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.farm_budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own budgets"
ON public.farm_budgets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budgets"
ON public.farm_budgets FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets"
ON public.farm_budgets FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets"
ON public.farm_budgets FOR DELETE
USING (auth.uid() = user_id);

-- 5. Farm Transactions Table (Revenue & Expenses)
CREATE TABLE IF NOT EXISTS public.farm_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  type TEXT NOT NULL CHECK (type IN ('revenue', 'expense')),
  category TEXT NOT NULL,
  subcategory TEXT,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'KES',
  payment_method TEXT CHECK (payment_method IN ('cash', 'mpesa', 'bank', 'credit', 'other')),
  description TEXT,
  reference_number TEXT,
  parcel_id UUID REFERENCES public.land_parcels(id) ON DELETE SET NULL,
  crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.farm_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
ON public.farm_transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
ON public.farm_transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
ON public.farm_transactions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
ON public.farm_transactions FOR DELETE
USING (auth.uid() = user_id);

-- 6. Farm Statistics Table (Aggregated Data)
CREATE TABLE IF NOT EXISTS public.farm_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_revenue NUMERIC DEFAULT 0,
  total_expenses NUMERIC DEFAULT 0,
  total_profit NUMERIC GENERATED ALWAYS AS (total_revenue - total_expenses) STORED,
  total_land_area NUMERIC DEFAULT 0,
  active_parcels INTEGER DEFAULT 0,
  total_crops INTEGER DEFAULT 0,
  last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.farm_statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own statistics"
ON public.farm_statistics FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own statistics"
ON public.farm_statistics FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own statistics"
ON public.farm_statistics FOR UPDATE
USING (auth.uid() = user_id);

-- 7. Payment Transactions Table (For orders and sales)
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('sale', 'purchase', 'payment', 'refund')),
  amount NUMERIC NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'KES',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  payment_reference TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment transactions"
ON public.payment_transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment transactions"
ON public.payment_transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment transactions"
ON public.payment_transactions FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_land_parcels_updated_at
BEFORE UPDATE ON public.land_parcels
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crops_updated_at
BEFORE UPDATE ON public.crops
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farm_inventory_updated_at
BEFORE UPDATE ON public.farm_inventory
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farm_budgets_updated_at
BEFORE UPDATE ON public.farm_budgets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farm_transactions_updated_at
BEFORE UPDATE ON public.farm_transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farm_statistics_updated_at
BEFORE UPDATE ON public.farm_statistics
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
BEFORE UPDATE ON public.payment_transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_land_parcels_user_id ON public.land_parcels(user_id);
CREATE INDEX idx_crops_user_id ON public.crops(user_id);
CREATE INDEX idx_crops_parcel_id ON public.crops(parcel_id);
CREATE INDEX idx_farm_inventory_user_id ON public.farm_inventory(user_id);
CREATE INDEX idx_farm_budgets_user_id ON public.farm_budgets(user_id);
CREATE INDEX idx_farm_transactions_user_id ON public.farm_transactions(user_id);
CREATE INDEX idx_farm_transactions_date ON public.farm_transactions(transaction_date DESC);
CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);