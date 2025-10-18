-- FIX 5: Add search_path to database functions (prevents search path manipulation attacks)

-- Fix update_buy_requests_updated_at
CREATE OR REPLACE FUNCTION public.update_buy_requests_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix cleanup_old_training_events
CREATE OR REPLACE FUNCTION public.cleanup_old_training_events()
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  UPDATE public.training_events
  SET is_active = false
  WHERE end_date < (CURRENT_DATE - INTERVAL '3 days')
  AND is_active = true;
END;
$function$;

-- Fix cleanup_expired_bluetooth_data
CREATE OR REPLACE FUNCTION public.cleanup_expired_bluetooth_data()
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  DELETE FROM public.bluetooth_shared_prices WHERE expires_at < now();
  DELETE FROM public.bluetooth_alerts WHERE expires_at < now();
  DELETE FROM public.bluetooth_devices WHERE last_seen < now() - INTERVAL '30 days';
  DELETE FROM public.bluetooth_traders WHERE last_announced < now() - INTERVAL '7 days';
END;
$function$;

-- Fix update_updated_at_column (used by multiple triggers)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;