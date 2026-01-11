-- 1. Calculate farm statistics for a user
CREATE OR REPLACE FUNCTION public.calculate_farm_statistics(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSON;
  v_total_land NUMERIC := 0;
  v_total_crops INTEGER := 0;
  v_total_revenue NUMERIC := 0;
  v_total_expenses NUMERIC := 0;
  v_active_parcels INTEGER := 0;
BEGIN
  -- Calculate total land area
  SELECT COALESCE(SUM(area_size), 0), COUNT(*) 
  INTO v_total_land, v_active_parcels
  FROM land_parcels 
  WHERE user_id = p_user_id AND status = 'active';
  
  -- Count crops
  SELECT COUNT(*) INTO v_total_crops 
  FROM crops 
  WHERE user_id = p_user_id AND status IN ('planted', 'growing');
  
  -- Calculate revenue from sold products
  SELECT COALESCE(SUM(mt.total_amount), 0) INTO v_total_revenue
  FROM marketplace_transactions mt
  WHERE mt.seller_id = p_user_id AND mt.status = 'completed';
  
  -- Calculate expenses
  SELECT COALESCE(SUM(fb.actual_amount), 0) INTO v_total_expenses
  FROM farm_budgets fb
  WHERE fb.user_id = p_user_id AND fb.category = 'expenses';
  
  -- Update or insert farm statistics
  INSERT INTO farm_statistics (user_id, total_land_area, total_crops, total_revenue, total_expenses, active_parcels, total_profit, last_calculated)
  VALUES (p_user_id, v_total_land, v_total_crops, v_total_revenue, v_total_expenses, v_active_parcels, v_total_revenue - v_total_expenses, NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_land_area = v_total_land,
    total_crops = v_total_crops,
    total_revenue = v_total_revenue,
    total_expenses = v_total_expenses,
    active_parcels = v_active_parcels,
    total_profit = v_total_revenue - v_total_expenses,
    last_calculated = NOW(),
    updated_at = NOW();
  
  result := json_build_object(
    'total_land_area', v_total_land,
    'total_crops', v_total_crops,
    'total_revenue', v_total_revenue,
    'total_expenses', v_total_expenses,
    'active_parcels', v_active_parcels,
    'profit', v_total_revenue - v_total_expenses
  );
  
  RETURN result;
END;
$$;

-- 2. Calculate crop yields
CREATE OR REPLACE FUNCTION public.calculate_crop_yields(p_crop_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSON;
  v_current_yield NUMERIC;
  v_previous_yield NUMERIC;
  v_yield_change NUMERIC;
  v_yield_per_area NUMERIC;
  v_crop RECORD;
BEGIN
  SELECT * INTO v_crop FROM crops WHERE id = p_crop_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Crop not found');
  END IF;
  
  v_current_yield := COALESCE(v_crop.current_yield, 0);
  v_previous_yield := COALESCE(v_crop.previous_yield, 0);
  
  -- Calculate yield change percentage
  IF v_previous_yield > 0 THEN
    v_yield_change := ((v_current_yield - v_previous_yield) / v_previous_yield) * 100;
  ELSE
    v_yield_change := 0;
  END IF;
  
  -- Calculate yield per area
  IF v_crop.area > 0 THEN
    v_yield_per_area := v_current_yield / v_crop.area;
  ELSE
    v_yield_per_area := 0;
  END IF;
  
  result := json_build_object(
    'crop_id', p_crop_id,
    'crop_name', v_crop.name,
    'current_yield', v_current_yield,
    'previous_yield', v_previous_yield,
    'yield_change_percent', ROUND(v_yield_change, 2),
    'yield_per_area', ROUND(v_yield_per_area, 2),
    'area', v_crop.area,
    'area_unit', v_crop.area_unit
  );
  
  RETURN result;
END;
$$;

-- 3. Calculate cooperative dividends
CREATE OR REPLACE FUNCTION public.calculate_cooperative_dividends(p_group_id UUID, p_total_profit NUMERIC, p_financial_year TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSON;
  v_total_shares NUMERIC;
  v_dividend_per_share NUMERIC;
  v_group RECORD;
BEGIN
  SELECT * INTO v_group FROM cooperative_groups WHERE id = p_group_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Group not found');
  END IF;
  
  v_total_shares := COALESCE(v_group.total_shares, 0);
  
  IF v_total_shares > 0 THEN
    v_dividend_per_share := p_total_profit / v_total_shares;
  ELSE
    v_dividend_per_share := 0;
  END IF;
  
  -- Insert dividend record
  INSERT INTO cooperative_dividends (group_id, financial_year, total_profit, dividend_per_share, declaration_date, status)
  VALUES (p_group_id, p_financial_year, p_total_profit, v_dividend_per_share, NOW(), 'declared');
  
  result := json_build_object(
    'group_id', p_group_id,
    'group_name', v_group.name,
    'total_profit', p_total_profit,
    'total_shares', v_total_shares,
    'dividend_per_share', ROUND(v_dividend_per_share, 2),
    'financial_year', p_financial_year
  );
  
  RETURN result;
END;
$$;

-- 4. Calculate loan interest
CREATE OR REPLACE FUNCTION public.calculate_loan_interest(p_loan_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSON;
  v_loan RECORD;
  v_monthly_rate NUMERIC;
  v_total_interest NUMERIC;
  v_monthly_payment NUMERIC;
  v_total_payment NUMERIC;
BEGIN
  SELECT * INTO v_loan FROM cooperative_loans WHERE id = p_loan_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Loan not found');
  END IF;
  
  -- Convert annual rate to monthly
  v_monthly_rate := v_loan.interest_rate / 12 / 100;
  
  -- Calculate total interest (simple interest for now)
  v_total_interest := v_loan.loan_amount * (v_loan.interest_rate / 100) * (COALESCE(v_loan.repayment_period, 12) / 12.0);
  
  -- Calculate monthly payment
  IF COALESCE(v_loan.repayment_period, 12) > 0 THEN
    v_monthly_payment := (v_loan.loan_amount + v_total_interest) / COALESCE(v_loan.repayment_period, 12);
  ELSE
    v_monthly_payment := 0;
  END IF;
  
  v_total_payment := v_loan.loan_amount + v_total_interest;
  
  result := json_build_object(
    'loan_id', p_loan_id,
    'principal', v_loan.loan_amount,
    'interest_rate', v_loan.interest_rate,
    'repayment_period_months', COALESCE(v_loan.repayment_period, 12),
    'total_interest', ROUND(v_total_interest, 2),
    'monthly_payment', ROUND(v_monthly_payment, 2),
    'total_payment', ROUND(v_total_payment, 2)
  );
  
  RETURN result;
END;
$$;

-- 5. Update market price trends
CREATE OR REPLACE FUNCTION public.update_market_price_trends()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSON;
  v_updated_count INTEGER := 0;
  commodity_rec RECORD;
  v_avg_price NUMERIC;
  v_prev_avg NUMERIC;
  v_trend TEXT;
BEGIN
  FOR commodity_rec IN 
    SELECT DISTINCT commodity FROM market_prices WHERE created_at > NOW() - INTERVAL '30 days'
  LOOP
    -- Current week average
    SELECT AVG(price) INTO v_avg_price
    FROM market_prices
    WHERE commodity = commodity_rec.commodity 
    AND created_at > NOW() - INTERVAL '7 days';
    
    -- Previous week average
    SELECT AVG(price) INTO v_prev_avg
    FROM market_prices
    WHERE commodity = commodity_rec.commodity 
    AND created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days';
    
    -- Determine trend
    IF v_prev_avg IS NULL OR v_prev_avg = 0 THEN
      v_trend := 'stable';
    ELSIF v_avg_price > v_prev_avg * 1.05 THEN
      v_trend := 'rising';
    ELSIF v_avg_price < v_prev_avg * 0.95 THEN
      v_trend := 'falling';
    ELSE
      v_trend := 'stable';
    END IF;
    
    -- Update demand hotspots with trend
    UPDATE demand_hotspots
    SET price_trend = v_trend, avg_price = v_avg_price, last_updated = NOW()
    WHERE commodity = commodity_rec.commodity;
    
    v_updated_count := v_updated_count + 1;
  END LOOP;
  
  result := json_build_object(
    'commodities_updated', v_updated_count,
    'last_run', NOW()
  );
  
  RETURN result;
END;
$$;

-- 6. Match farmers with exporters
CREATE OR REPLACE FUNCTION public.match_farmers_exporters(p_farmer_collaboration_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSON;
  v_farmer RECORD;
  v_matches JSON[];
  exporter_rec RECORD;
  v_score INTEGER;
BEGIN
  SELECT * INTO v_farmer FROM farmer_exporter_collaborations WHERE id = p_farmer_collaboration_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Collaboration not found');
  END IF;
  
  v_matches := ARRAY[]::JSON[];
  
  FOR exporter_rec IN 
    SELECT * FROM exporter_profiles WHERE status = 'active' AND is_verified = true
  LOOP
    v_score := 0;
    
    -- Check commodity match
    IF exporter_rec.commodities_exported IS NOT NULL AND 
       v_farmer.commodity_name = ANY(exporter_rec.commodities_exported) THEN
      v_score := v_score + 40;
    END IF;
    
    -- Check target market match
    IF exporter_rec.target_markets IS NOT NULL AND v_farmer.target_markets IS NOT NULL THEN
      IF exporter_rec.target_markets && v_farmer.target_markets THEN
        v_score := v_score + 30;
      END IF;
    END IF;
    
    -- Check county proximity
    IF exporter_rec.county = v_farmer.farmer_county THEN
      v_score := v_score + 20;
    END IF;
    
    -- Check certifications match
    IF exporter_rec.certifications IS NOT NULL AND v_farmer.farmer_certifications IS NOT NULL THEN
      IF exporter_rec.certifications && v_farmer.farmer_certifications THEN
        v_score := v_score + 10;
      END IF;
    END IF;
    
    IF v_score >= 30 THEN
      v_matches := array_append(v_matches, json_build_object(
        'exporter_id', exporter_rec.id,
        'company_name', exporter_rec.company_name,
        'match_score', v_score,
        'contact_person', exporter_rec.contact_person,
        'contact_phone', exporter_rec.contact_phone
      ));
    END IF;
  END LOOP;
  
  result := json_build_object(
    'farmer_collaboration_id', p_farmer_collaboration_id,
    'commodity', v_farmer.commodity_name,
    'matches_found', array_length(v_matches, 1),
    'matches', v_matches
  );
  
  RETURN result;
END;
$$;

-- 7. Calculate carbon footprint
CREATE OR REPLACE FUNCTION public.calculate_carbon_footprint(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSON;
  v_fuel_emissions NUMERIC := 0;
  v_fertilizer_emissions NUMERIC := 0;
  v_electricity_emissions NUMERIC := 0;
  v_total_emissions NUMERIC := 0;
  v_emission_record RECORD;
BEGIN
  -- Get latest emission record
  SELECT * INTO v_emission_record 
  FROM carbon_emissions 
  WHERE user_id = p_user_id 
  ORDER BY calculation_date DESC 
  LIMIT 1;
  
  IF FOUND THEN
    -- Emission factors (kg CO2 per unit)
    v_fuel_emissions := COALESCE(v_emission_record.fuel_consumption, 0) * 2.68; -- liters diesel
    v_fertilizer_emissions := COALESCE(v_emission_record.fertilizer_usage, 0) * 1.3; -- kg nitrogen
    v_electricity_emissions := COALESCE(v_emission_record.electricity_usage, 0) * 0.5; -- kWh
    
    v_total_emissions := v_fuel_emissions + v_fertilizer_emissions + v_electricity_emissions;
    
    -- Update the record
    UPDATE carbon_emissions
    SET total_emissions = v_total_emissions, updated_at = NOW()
    WHERE id = v_emission_record.id;
  ELSE
    v_total_emissions := 0;
  END IF;
  
  result := json_build_object(
    'user_id', p_user_id,
    'fuel_emissions_kg_co2', ROUND(v_fuel_emissions, 2),
    'fertilizer_emissions_kg_co2', ROUND(v_fertilizer_emissions, 2),
    'electricity_emissions_kg_co2', ROUND(v_electricity_emissions, 2),
    'total_emissions_kg_co2', ROUND(v_total_emissions, 2),
    'calculation_date', NOW()
  );
  
  RETURN result;
END;
$$;

-- 8. Generate batch number
CREATE OR REPLACE FUNCTION public.generate_batch_number(p_farmer_id UUID, p_product_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_batch_number TEXT;
  v_date_part TEXT;
  v_sequence INTEGER;
  v_product_code TEXT;
BEGIN
  -- Format: YYYY-MM-DD-PROD-XXXX
  v_date_part := TO_CHAR(NOW(), 'YYYYMMDD');
  
  -- Get product code (first 3 letters uppercase)
  v_product_code := UPPER(LEFT(REGEXP_REPLACE(p_product_name, '[^a-zA-Z]', '', 'g'), 3));
  
  -- Get next sequence for today
  SELECT COALESCE(MAX(CAST(SUBSTRING(batch_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
  INTO v_sequence
  FROM batch_tracking
  WHERE batch_number LIKE v_date_part || '-' || v_product_code || '-%'
  AND farmer_id = p_farmer_id;
  
  v_batch_number := v_date_part || '-' || v_product_code || '-' || LPAD(v_sequence::TEXT, 4, '0');
  
  RETURN v_batch_number;
END;
$$;

-- 9. Calculate inventory alerts
CREATE OR REPLACE FUNCTION public.calculate_inventory_alerts(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSON;
  v_low_stock JSON[];
  v_expiring JSON[];
  v_out_of_stock JSON[];
  item_rec RECORD;
BEGIN
  v_low_stock := ARRAY[]::JSON[];
  v_expiring := ARRAY[]::JSON[];
  v_out_of_stock := ARRAY[]::JSON[];
  
  FOR item_rec IN 
    SELECT * FROM farm_inventory WHERE user_id = p_user_id
  LOOP
    -- Check out of stock
    IF item_rec.quantity <= 0 THEN
      v_out_of_stock := array_append(v_out_of_stock, json_build_object(
        'id', item_rec.id,
        'item_name', item_rec.item_name,
        'category', item_rec.category
      ));
    -- Check low stock
    ELSIF item_rec.minimum_quantity IS NOT NULL AND item_rec.quantity <= item_rec.minimum_quantity THEN
      v_low_stock := array_append(v_low_stock, json_build_object(
        'id', item_rec.id,
        'item_name', item_rec.item_name,
        'quantity', item_rec.quantity,
        'minimum_quantity', item_rec.minimum_quantity,
        'category', item_rec.category
      ));
    END IF;
    
    -- Check expiring soon (within 30 days)
    IF item_rec.expiry_date IS NOT NULL AND item_rec.expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN
      v_expiring := array_append(v_expiring, json_build_object(
        'id', item_rec.id,
        'item_name', item_rec.item_name,
        'expiry_date', item_rec.expiry_date,
        'days_until_expiry', item_rec.expiry_date - CURRENT_DATE,
        'category', item_rec.category
      ));
    END IF;
  END LOOP;
  
  result := json_build_object(
    'user_id', p_user_id,
    'low_stock_items', array_length(v_low_stock, 1),
    'low_stock', v_low_stock,
    'expiring_items', array_length(v_expiring, 1),
    'expiring_soon', v_expiring,
    'out_of_stock_items', array_length(v_out_of_stock, 1),
    'out_of_stock', v_out_of_stock,
    'checked_at', NOW()
  );
  
  RETURN result;
END;
$$;

-- 10. Update farmer ratings aggregation
CREATE OR REPLACE FUNCTION public.update_farmer_ratings(p_farmer_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSON;
  v_avg_rating NUMERIC;
  v_total_reviews INTEGER;
  v_marketplace_avg NUMERIC;
  v_marketplace_count INTEGER;
BEGIN
  -- Calculate from marketplace transactions
  SELECT AVG(buyer_rating), COUNT(*)
  INTO v_marketplace_avg, v_marketplace_count
  FROM marketplace_transactions
  WHERE seller_id = p_farmer_id AND buyer_rating IS NOT NULL;
  
  v_avg_rating := COALESCE(v_marketplace_avg, 0);
  v_total_reviews := COALESCE(v_marketplace_count, 0);
  
  -- Update profile
  UPDATE profiles
  SET 
    rating = ROUND(v_avg_rating, 2),
    total_reviews = v_total_reviews,
    updated_at = NOW()
  WHERE user_id = p_farmer_id;
  
  result := json_build_object(
    'farmer_id', p_farmer_id,
    'average_rating', ROUND(v_avg_rating, 2),
    'total_reviews', v_total_reviews,
    'updated_at', NOW()
  );
  
  RETURN result;
END;
$$;