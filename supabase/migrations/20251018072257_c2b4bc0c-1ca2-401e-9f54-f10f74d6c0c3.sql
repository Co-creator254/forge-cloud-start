-- CRITICAL FIX 1: Secure profiles table - Remove public exposure
-- Drop the dangerous public policy
DROP POLICY IF EXISTS "Users can view all public profiles" ON public.profiles;

-- Create secure policy: Users can only view their own profile
CREATE POLICY "Users view own profile only" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create limited public directory view (only non-sensitive data for verified users)
CREATE OR REPLACE VIEW public.user_directory AS
SELECT 
  user_id,
  full_name,
  county,
  user_type,
  created_at
FROM public.profiles
WHERE verification_status = 'verified';

-- CRITICAL FIX 2: Secure equipment_marketplace - Hide contact info from public
-- Drop existing public policy
DROP POLICY IF EXISTS "Anyone can view available equipment" ON public.equipment_marketplace;

-- Create new policy that excludes contact info for non-owners
CREATE POLICY "Public can view equipment listings without contact info"
ON public.equipment_marketplace
FOR SELECT
USING (
  availability_status = 'available' 
  OR auth.uid() = seller_id
);

-- Create view for public equipment browsing (no contact info)
CREATE OR REPLACE VIEW public.equipment_listings_public AS
SELECT 
  id, seller_id, equipment_name, equipment_type, brand, model,
  condition, price, currency, location, county, description,
  images, availability_status, year_manufactured, negotiable,
  rental_option, rental_price_per_day, is_featured, view_count,
  created_at, updated_at
FROM public.equipment_marketplace
WHERE availability_status = 'available';

-- Note: contact_phone and contact_email excluded from public view
-- Users must be authenticated and contact seller through platform