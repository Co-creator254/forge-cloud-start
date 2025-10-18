-- CRITICAL FIX 3 (FINAL): Create Role-Based Access Control (RBAC) System

-- Step 1: Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'agent', 'user');

-- Step 2: Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    granted_at timestamp with time zone DEFAULT now(),
    granted_by uuid REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create security definer function to check roles (prevents recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Step 4: Create function to get all user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS SETOF app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
$$;

-- Step 5: RLS Policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Step 6: Protect admin-only tables with RBAC
-- Farm Input Categories - Admin only
DROP POLICY IF EXISTS "Authenticated users can insert farm input categories" ON public.farm_input_categories;
DROP POLICY IF EXISTS "Users can view all farm input categories" ON public.farm_input_categories;
DROP POLICY IF EXISTS "Anyone can view categories" ON public.farm_input_categories;
DROP POLICY IF EXISTS "Authenticated users can create categories" ON public.farm_input_categories;

CREATE POLICY "Anyone can view categories"
ON public.farm_input_categories
FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert categories"
ON public.farm_input_categories
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update categories"
ON public.farm_input_categories
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete categories"
ON public.farm_input_categories
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Farm Input Suppliers - Admin only
DROP POLICY IF EXISTS "Authenticated users can insert farm input suppliers" ON public.farm_input_suppliers;
DROP POLICY IF EXISTS "Anyone can view suppliers" ON public.farm_input_suppliers;

CREATE POLICY "Anyone can view suppliers"
ON public.farm_input_suppliers
FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert suppliers"
ON public.farm_input_suppliers
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update suppliers"
ON public.farm_input_suppliers
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete suppliers"
ON public.farm_input_suppliers
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Farm Input Products - Admin only
DROP POLICY IF EXISTS "Authenticated users can insert farm input products" ON public.farm_input_products;
DROP POLICY IF EXISTS "Anyone can view products" ON public.farm_input_products;

CREATE POLICY "Anyone can view products"
ON public.farm_input_products
FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert products"
ON public.farm_input_products
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update products"
ON public.farm_input_products
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete products"
ON public.farm_input_products
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));