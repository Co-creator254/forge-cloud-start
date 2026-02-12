
-- =============================================
-- 1. Fix SECURITY DEFINER views → SECURITY INVOKER
-- =============================================

DROP VIEW IF EXISTS public.equipment_listings_public;
CREATE VIEW public.equipment_listings_public
WITH (security_invoker = on) AS
SELECT id, equipment_name, equipment_type, description, condition, price, currency,
       county, location, brand, model, year_manufactured, rental_option,
       rental_price_per_day, availability_status, images, tags, view_count,
       is_featured, created_at
FROM public.equipment_marketplace;

DROP VIEW IF EXISTS public.user_directory;
CREATE VIEW public.user_directory
WITH (security_invoker = on) AS
SELECT user_id, full_name, county, location, farm_type, specialization,
       profile_image_url, created_at
FROM public.profiles;

-- =============================================
-- 2. Fix function search_path issues
-- =============================================

CREATE OR REPLACE FUNCTION public.update_trust_points_timestamp()
RETURNS trigger LANGUAGE plpgsql SET search_path = 'public' AS $function$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$function$;

CREATE OR REPLACE FUNCTION public.update_qr_codes_timestamp()
RETURNS trigger LANGUAGE plpgsql SET search_path = 'public' AS $function$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_trust_level(points integer)
RETURNS text LANGUAGE plpgsql IMMUTABLE SET search_path = 'public' AS $function$
BEGIN
  IF points >= 10000 THEN RETURN 'diamond';
  ELSIF points >= 5000 THEN RETURN 'platinum';
  ELSIF points >= 1000 THEN RETURN 'gold';
  ELSIF points >= 100 THEN RETURN 'silver';
  ELSE RETURN 'bronze';
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.award_trust_points(p_user_id uuid, p_points integer, p_transaction_type text, p_reference_id uuid DEFAULT NULL::uuid, p_metadata jsonb DEFAULT NULL::jsonb)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $function$
DECLARE
  v_transaction_id UUID; v_previous_hash TEXT; v_new_hash TEXT;
BEGIN
  SELECT transaction_hash INTO v_previous_hash FROM public.trust_point_transactions WHERE user_id = p_user_id ORDER BY created_at DESC LIMIT 1;
  v_new_hash := md5(p_user_id::TEXT || p_points::TEXT || p_transaction_type || COALESCE(p_reference_id::TEXT, '') || COALESCE(v_previous_hash, '') || NOW()::TEXT);
  INSERT INTO public.trust_point_transactions (user_id, points_change, transaction_type, reference_id, transaction_hash, previous_hash, metadata)
  VALUES (p_user_id, p_points, p_transaction_type, p_reference_id, v_new_hash, v_previous_hash, p_metadata) RETURNING id INTO v_transaction_id;
  INSERT INTO public.trust_points (user_id, total_points, last_earned_at, previous_transaction_hash)
  VALUES (p_user_id, p_points, NOW(), v_new_hash)
  ON CONFLICT (user_id) DO UPDATE SET total_points = public.trust_points.total_points + p_points, last_earned_at = NOW(), previous_transaction_hash = v_new_hash, level = calculate_trust_level(public.trust_points.total_points + p_points);
  RETURN v_transaction_id;
END;
$function$;

-- =============================================
-- 3. Fix overly permissive RLS policies
-- =============================================

DROP POLICY IF EXISTS "System can manage rate limits" ON public.auth_rate_limits;
CREATE POLICY "Service role manages rate limits" ON public.auth_rate_limits FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Recipients can create donation requests" ON public.donation_requests;
CREATE POLICY "Authenticated users create donation requests" ON public.donation_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "System can create order items" ON public.farm_input_order_items;
CREATE POLICY "Buyers can create order items" ON public.farm_input_order_items FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.farm_input_orders WHERE id = order_id AND buyer_id = auth.uid()));

DROP POLICY IF EXISTS "System can create rescue matches" ON public.food_rescue_matches;
CREATE POLICY "Authenticated create rescue matches" ON public.food_rescue_matches FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "System creates notifications" ON public.notifications;
CREATE POLICY "Authenticated receive notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "System can log security events" ON public.security_audit_log;
CREATE POLICY "Service role logs security events" ON public.security_audit_log FOR INSERT TO service_role WITH CHECK (true);

DROP POLICY IF EXISTS "System can create deliveries" ON public.subscription_box_deliveries;
CREATE POLICY "Authenticated create deliveries" ON public.subscription_box_deliveries FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "System can manage weather forecasts" ON public.weather_forecasts;
CREATE POLICY "Anyone reads weather forecasts" ON public.weather_forecasts FOR SELECT USING (true);
CREATE POLICY "Service role manages weather" ON public.weather_forecasts FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role updates weather" ON public.weather_forecasts FOR UPDATE TO service_role USING (true);
CREATE POLICY "Service role deletes weather" ON public.weather_forecasts FOR DELETE TO service_role USING (true);
