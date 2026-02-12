-- Enhanced Supply Chain Database Schema
-- Adding overlooked aspects for comprehensive supply chain management

-- Existing tables (for reference)
/*
CREATE TABLE supply_chain_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  farm_id UUID REFERENCES farms,
  stage_name TEXT NOT NULL, -- planting, growth, harvest, storage, transport, market
  status TEXT NOT NULL, -- active, completed, delayed, problem
  progress INTEGER DEFAULT 0, -- 0-100
  start_date DATE,
  end_date DATE,
  issues JSONB,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE supply_chain_financial_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stage_id UUID REFERENCES supply_chain_stages,
  cost_type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'KES',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
*/

-- 1. QUALITY CONTROL & COMPLIANCE
CREATE TABLE supply_chain_quality_control (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stage_id UUID REFERENCES supply_chain_stages,
  batch_id TEXT,
  quality_grade TEXT CHECK (quality_grade IN ('A', 'B', 'C', 'D', 'REJECTED')),
  inspection_date TIMESTAMPTZ DEFAULT NOW(),
  inspector_id UUID REFERENCES auth.users,
  inspection_type TEXT NOT NULL, -- pre_harvest, post_harvest, pre_transport, market_ready
  parameters JSONB, -- moisture_content, size, weight, color, defects, etc.
  certifications JSONB, -- organic, fair_trade, global_gap, etc.
  compliance_status TEXT DEFAULT 'pending', -- compliant, non_compliant, pending
  corrective_actions TEXT[],
  next_inspection_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SUPPLIER & VENDOR MANAGEMENT
CREATE TABLE supply_chain_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  supplier_name TEXT NOT NULL,
  supplier_type TEXT NOT NULL, -- seed, fertilizer, equipment, transport, storage, buyer
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  location TEXT,
  services_offered JSONB,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_transactions INTEGER DEFAULT 0,
  reliability_score DECIMAL(3,2) DEFAULT 0.00,
  certification_details JSONB,
  payment_terms TEXT,
  lead_time_days INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INVENTORY & WAREHOUSE MANAGEMENT
CREATE TABLE supply_chain_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stage_id UUID REFERENCES supply_chain_stages,
  product_name TEXT NOT NULL,
  variety TEXT,
  batch_number TEXT,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL, -- kg, tonnes, bags, crates
  storage_location TEXT,
  warehouse_id UUID,
  entry_date TIMESTAMPTZ DEFAULT NOW(),
  expiry_date DATE,
  quality_grade TEXT,
  storage_conditions JSONB, -- temperature, humidity, ventilation
  handling_instructions TEXT,
  current_status TEXT DEFAULT 'in_storage', -- in_storage, allocated, shipped, sold
  cost_per_unit NUMERIC,
  total_value NUMERIC GENERATED ALWAYS AS (quantity * cost_per_unit) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TRANSPORTATION & LOGISTICS
CREATE TABLE supply_chain_transportation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stage_id UUID REFERENCES supply_chain_stages,
  shipment_id TEXT UNIQUE NOT NULL,
  transport_type TEXT NOT NULL, -- truck, pickup, motorcycle, rail, air, ship
  vehicle_number TEXT,
  driver_name TEXT,
  driver_phone TEXT,
  origin_location TEXT NOT NULL,
  destination_location TEXT NOT NULL,
  departure_time TIMESTAMPTZ,
  estimated_arrival TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  distance_km NUMERIC,
  fuel_cost NUMERIC,
  driver_fee NUMERIC,
  other_transport_costs NUMERIC,
  cargo_details JSONB, -- products, quantities, weights
  tracking_number TEXT,
  gps_tracking_url TEXT,
  transport_status TEXT DEFAULT 'pending', -- pending, in_transit, delivered, delayed
  delay_reasons TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MARKET & SALES MANAGEMENT
CREATE TABLE supply_chain_market_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stage_id UUID REFERENCES supply_chain_stages,
  market_name TEXT NOT NULL,
  market_type TEXT, -- wholesale, retail, export, local, online
  location TEXT,
  buyer_name TEXT,
  buyer_contact TEXT,
  product_requirements JSONB, -- quality, quantity, packaging, certification
  offered_price_per_unit NUMERIC,
  total_potential_value NUMERIC,
  negotiation_status TEXT DEFAULT 'initial', -- initial, negotiating, confirmed, lost
  order_date DATE,
  delivery_date DATE,
  payment_terms TEXT,
  competition_analysis JSONB,
  risk_factors TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RISK MANAGEMENT & MITIGATION
CREATE TABLE supply_chain_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stage_id UUID REFERENCES supply_chain_stages,
  risk_category TEXT NOT NULL, -- weather, pest_disease, market, financial, operational, regulatory
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  risk_description TEXT NOT NULL,
  probability_score INTEGER CHECK (probability_score BETWEEN 1 AND 5),
  impact_score INTEGER CHECK (impact_score BETWEEN 1 AND 5),
  risk_score NUMERIC GENERATED ALWAYS AS (probability_score * impact_score) STORED,
  mitigation_strategies TEXT[],
  responsible_party TEXT,
  monitoring_frequency TEXT, -- daily, weekly, monthly
  status TEXT DEFAULT 'active', -- active, mitigated, accepted
  last_reviewed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SUSTAINABILITY & ENVIRONMENTAL IMPACT
CREATE TABLE supply_chain_sustainability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stage_id UUID REFERENCES supply_chain_stages,
  carbon_footprint_kg NUMERIC DEFAULT 0,
  water_usage_liters NUMERIC DEFAULT 0,
  energy_usage_kwh NUMERIC DEFAULT 0,
  waste_generated_kg NUMERIC DEFAULT 0,
  waste_recycled_kg NUMERIC DEFAULT 0,
  sustainable_practices JSONB, -- conservation methods, renewable energy, etc.
  environmental_certifications JSONB,
  biodiversity_impact TEXT,
  soil_health_metrics JSONB,
  sustainability_score DECIMAL(5,2) GENERATED ALWAYS AS (
    (CASE 
      WHEN carbon_footprint_kg = 0 THEN 100
      ELSE GREATEST(0, 100 - (carbon_footprint_kg / 10))
    END)
  ) STORED,
  reporting_period_start DATE,
  reporting_period_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. WORKFORCE & LABOR MANAGEMENT
CREATE TABLE supply_chain_labor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stage_id UUID REFERENCES supply_chain_stages,
  worker_name TEXT NOT NULL,
  worker_type TEXT, -- permanent, temporary, seasonal, contractor
  role TEXT NOT NULL, -- planter, harvester, packer, driver, supervisor
  skills JSONB,
  daily_wage NUMERIC,
  hours_worked NUMERIC,
  productivity_metrics JSONB, -- tasks_completed, efficiency_rate
  safety_training_completed BOOLEAN DEFAULT false,
  safety_incidents INTEGER DEFAULT 0,
  performance_rating DECIMAL(3,2),
  employment_start_date DATE,
  employment_end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TECHNOLOGY & AUTOMATION
CREATE TABLE supply_chain_technology (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stage_id UUID REFERENCES supply_chain_stages,
  technology_name TEXT NOT NULL,
  technology_type TEXT, -- iot_sensor, drone, automation_software, mobile_app, machinery
  purpose TEXT,
  implementation_date DATE,
  cost NUMERIC,
  efficiency_improvement DECIMAL(5,2), -- percentage
  data_collected JSONB,
  maintenance_schedule JSONB,
  roi_calculated BOOLEAN DEFAULT false,
  roi_percentage DECIMAL(5,2),
  user_satisfaction_rating INTEGER CHECK (user_satisfaction_rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. DOCUMENTATION & COMPLIANCE
CREATE TABLE supply_chain_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stage_id UUID REFERENCES supply_chain_stages,
  document_type TEXT NOT NULL, -- contract, certificate, permit, invoice, receipt, report
  document_title TEXT NOT NULL,
  document_number TEXT,
  issue_date DATE,
  expiry_date DATE,
  issuing_authority TEXT,
  file_url TEXT,
  file_size NUMERIC,
  file_type TEXT,
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMPTZ,
  reminder_date DATE, -- for expiry notifications
  access_level TEXT DEFAULT 'private', -- public, internal, private
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. PERFORMANCE ANALYTICS
CREATE TABLE supply_chain_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stage_id UUID REFERENCES supply_chain_stages,
  metric_category TEXT NOT NULL, -- efficiency, quality, cost, time, sustainability
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  target_value NUMERIC,
  unit TEXT,
  measurement_date DATE,
  benchmark_comparison NUMERIC,
  trend_direction TEXT, -- improving, declining, stable
  factors_influencing JSONB,
  improvement_actions TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. NOTIFICATIONS & ALERTS
CREATE TABLE supply_chain_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stage_id UUID REFERENCES supply_chain_stages,
  notification_type TEXT NOT NULL, -- deadline, quality_issue, delay, cost_overrun, opportunity
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  is_read BOOLEAN DEFAULT false,
  action_required BOOLEAN DEFAULT false,
  action_deadline TIMESTAMPTZ,
  related_entity_type TEXT, -- stage, inventory, transport, quality
  related_entity_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- Indexes for performance optimization
CREATE INDEX idx_supply_chain_quality_control_user_stage ON supply_chain_quality_control(user_id, stage_id);
CREATE INDEX idx_supply_chain_suppliers_user_active ON supply_chain_suppliers(user_id, is_active);
CREATE INDEX idx_supply_chain_inventory_user_status ON supply_chain_inventory(user_id, current_status);
CREATE INDEX idx_supply_chain_transportation_user_status ON supply_chain_transportation(user_id, transport_status);
CREATE INDEX idx_supply_chain_market_opportunities_user_status ON supply_chain_market_opportunities(user_id, negotiation_status);
CREATE INDEX idx_supply_chain_risks_user_level ON supply_chain_risks(user_id, risk_level);
CREATE INDEX idx_supply_chain_sustainability_user_period ON supply_chain_sustainability(user_id, reporting_period_start);
CREATE INDEX idx_supply_chain_labor_user_stage ON supply_chain_labor(user_id, stage_id);
CREATE INDEX idx_supply_chain_notifications_user_read ON supply_chain_notifications(user_id, is_read);

-- Row Level Security (RLS) Policies
ALTER TABLE supply_chain_quality_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_transportation ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_market_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_sustainability ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_labor ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_technology ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for each table
CREATE POLICY "Users can view their own quality control data" ON supply_chain_quality_control
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quality control data" ON supply_chain_quality_control
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quality control data" ON supply_chain_quality_control
  FOR UPDATE USING (auth.uid() = user_id);

-- Similar policies for other tables...
CREATE POLICY "Users can view their own suppliers" ON supply_chain_suppliers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own suppliers" ON supply_chain_suppliers
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own inventory" ON supply_chain_inventory
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own inventory" ON supply_chain_inventory
  FOR ALL USING (auth.uid() = user_id);

-- Continue similar policies for remaining tables...

-- Functions for automated calculations
CREATE OR REPLACE FUNCTION calculate_supply_chain_efficiency(p_user_id UUID, p_stage_id UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  efficiency_score DECIMAL(5,2);
  total_time INTERVAL;
  expected_time INTERVAL;
BEGIN
  -- Calculate efficiency based on actual vs expected time for stage completion
  SELECT (end_date - start_date) INTO total_time
  FROM supply_chain_stages
  WHERE id = p_stage_id AND user_id = p_user_id;
  
  -- Define expected time based on stage type (this could be configurable)
  CASE 
    WHEN (SELECT stage_name FROM supply_chain_stages WHERE id = p_stage_id) = 'planting' THEN
      expected_time := INTERVAL '7 days';
    WHEN (SELECT stage_name FROM supply_chain_stages WHERE id = p_stage_id) = 'growth' THEN
      expected_time := INTERVAL '90 days';
    WHEN (SELECT stage_name FROM supply_chain_stages WHERE id = p_stage_id) = 'harvest' THEN
      expected_time := INTERVAL '14 days';
    ELSE
      expected_time := INTERVAL '7 days';
  END CASE;
  
  efficiency_score := (EXTRACT(EPOCH FROM expected_time) / EXTRACT(EPOCH FROM total_time)) * 100;
  
  RETURN LEAST(100, GREATEST(0, efficiency_score));
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic notifications
CREATE OR REPLACE FUNCTION trigger_supply_chain_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for stage completion
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO supply_chain_notifications (
      user_id, stage_id, notification_type, title, message, priority
    ) VALUES (
      NEW.user_id, 
      NEW.id, 
      'stage_completion', 
      'Stage Completed', 
      format('%s stage has been completed successfully', NEW.stage_name),
      'medium'
    );
  END IF;
  
  -- Insert notification for delays
  IF NEW.status = 'delayed' AND OLD.status != 'delayed' THEN
    INSERT INTO supply_chain_notifications (
      user_id, stage_id, notification_type, title, message, priority, action_required
    ) VALUES (
      NEW.user_id, 
      NEW.id, 
      'delay', 
      'Stage Delayed', 
      format('%s stage is experiencing delays', NEW.stage_name),
      'high',
      true
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER supply_chain_stages_notifications
  AFTER UPDATE ON supply_chain_stages
  FOR EACH ROW EXECUTE FUNCTION trigger_supply_chain_notifications();
