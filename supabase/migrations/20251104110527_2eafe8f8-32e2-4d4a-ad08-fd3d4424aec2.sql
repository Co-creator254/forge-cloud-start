-- Create missing feature tables with proper RLS policies

-- Export Opportunities Table
CREATE TABLE IF NOT EXISTS public.export_opportunities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    commodity text NOT NULL,
    target_country text NOT NULL,
    target_region text,
    quantity_required numeric NOT NULL,
    unit text NOT NULL,
    price_per_unit numeric NOT NULL,
    currency text DEFAULT 'USD'::text,
    quality_requirements text,
    certifications_required text[],
    delivery_terms text,
    payment_terms text,
    deadline date NOT NULL,
    status text DEFAULT 'open'::text CHECK (status IN ('open', 'closed', 'awarded')),
    contact_email text,
    contact_phone text,
    company_name text,
    description text
);

ALTER TABLE public.export_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view open export opportunities"
ON public.export_opportunities FOR SELECT
USING (status = 'open' OR created_by = auth.uid());

CREATE POLICY "Authenticated users can create export opportunities"
ON public.export_opportunities FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their export opportunities"
ON public.export_opportunities FOR UPDATE
USING (auth.uid() = created_by);

-- Export Opportunity Applications
CREATE TABLE IF NOT EXISTS public.export_opportunity_applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id uuid REFERENCES public.export_opportunities(id) ON DELETE CASCADE NOT NULL,
    applicant_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    quantity_offered numeric NOT NULL,
    price_per_unit numeric NOT NULL,
    delivery_timeline text,
    certifications text[],
    status text DEFAULT 'pending'::text CHECK (status IN ('pending', 'accepted', 'rejected')),
    notes text,
    UNIQUE(opportunity_id, applicant_id)
);

ALTER TABLE public.export_opportunity_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view applications for their opportunities or their own applications"
ON public.export_opportunity_applications FOR SELECT
USING (
    applicant_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM export_opportunities 
        WHERE id = opportunity_id AND created_by = auth.uid()
    )
);

CREATE POLICY "Users can create applications"
ON public.export_opportunity_applications FOR INSERT
WITH CHECK (auth.uid() = applicant_id);

-- Batch Tracking Table
CREATE TABLE IF NOT EXISTS public.batch_tracking (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_number text NOT NULL UNIQUE,
    farmer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_name text NOT NULL,
    quantity numeric NOT NULL,
    unit text NOT NULL,
    harvest_date date NOT NULL,
    current_location text,
    current_status text DEFAULT 'harvested'::text,
    quality_grade text,
    certifications text[],
    storage_conditions jsonb,
    transport_history jsonb,
    quality_checks jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.batch_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can manage their batches"
ON public.batch_tracking FOR ALL
USING (auth.uid() = farmer_id);

CREATE POLICY "Public can view batch info by batch number"
ON public.batch_tracking FOR SELECT
USING (true);

-- Carbon Emissions Table
CREATE TABLE IF NOT EXISTS public.carbon_emissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    calculation_date date DEFAULT CURRENT_DATE NOT NULL,
    farm_size numeric,
    crop_type text,
    fertilizer_usage numeric,
    fuel_consumption numeric,
    electricity_usage numeric,
    total_emissions numeric,
    emission_unit text DEFAULT 'kg CO2e'::text,
    reduction_actions text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.carbon_emissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their carbon emissions"
ON public.carbon_emissions FOR ALL
USING (auth.uid() = user_id);

-- Carbon Offset Projects
CREATE TABLE IF NOT EXISTS public.carbon_offset_projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name text NOT NULL,
    description text,
    project_type text NOT NULL,
    location text,
    organizer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    carbon_offset_potential numeric,
    cost_per_tonne numeric,
    start_date date,
    end_date date,
    status text DEFAULT 'active'::text CHECK (status IN ('active', 'completed', 'cancelled')),
    participants_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.carbon_offset_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active projects"
ON public.carbon_offset_projects FOR SELECT
USING (status = 'active' OR organizer_id = auth.uid());

CREATE POLICY "Organizers can manage their projects"
ON public.carbon_offset_projects FOR ALL
USING (auth.uid() = organizer_id);

-- Cooperative Activities
CREATE TABLE IF NOT EXISTS public.cooperative_activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id uuid REFERENCES public.cooperative_groups(id) ON DELETE CASCADE NOT NULL,
    activity_type text NOT NULL,
    activity_date date NOT NULL,
    description text,
    participants uuid[],
    outcome text,
    financial_impact numeric,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.cooperative_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view activities"
ON public.cooperative_activities FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM cooperative_groups 
        WHERE id = group_id AND (group_leader_id = auth.uid() OR auth.uid() = ANY(participants))
    )
);

CREATE POLICY "Group leaders can manage activities"
ON public.cooperative_activities FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM cooperative_groups 
        WHERE id = group_id AND group_leader_id = auth.uid()
    )
);

-- Cooperative Votes
CREATE TABLE IF NOT EXISTS public.cooperative_votes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id uuid REFERENCES public.cooperative_groups(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    vote_type text NOT NULL,
    options jsonb NOT NULL,
    start_date timestamp with time zone DEFAULT now() NOT NULL,
    end_date timestamp with time zone NOT NULL,
    results jsonb,
    status text DEFAULT 'active'::text CHECK (status IN ('active', 'closed')),
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.cooperative_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view and participate in votes"
ON public.cooperative_votes FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM cooperative_groups 
        WHERE id = group_id AND group_leader_id = auth.uid()
    )
);

-- Cooperative Dividends
CREATE TABLE IF NOT EXISTS public.cooperative_dividends (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id uuid REFERENCES public.cooperative_groups(id) ON DELETE CASCADE NOT NULL,
    financial_year text NOT NULL,
    total_profit numeric NOT NULL,
    dividend_per_share numeric NOT NULL,
    declaration_date date NOT NULL,
    payment_date date,
    status text DEFAULT 'declared'::text CHECK (status IN ('declared', 'paid')),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.cooperative_dividends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view dividends"
ON public.cooperative_dividends FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM cooperative_groups 
        WHERE id = group_id AND group_leader_id = auth.uid()
    )
);

-- Member Dividend Payments
CREATE TABLE IF NOT EXISTS public.member_dividend_payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dividend_id uuid REFERENCES public.cooperative_dividends(id) ON DELETE CASCADE NOT NULL,
    member_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    shares_held integer NOT NULL,
    amount numeric NOT NULL,
    payment_method text,
    payment_reference text,
    paid_at timestamp with time zone,
    status text DEFAULT 'pending'::text CHECK (status IN ('pending', 'paid')),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.member_dividend_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their dividend payments"
ON public.member_dividend_payments FOR SELECT
USING (auth.uid() = member_id);

-- Cooperative Loans
CREATE TABLE IF NOT EXISTS public.cooperative_loans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id uuid REFERENCES public.cooperative_groups(id) ON DELETE CASCADE NOT NULL,
    borrower_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    loan_amount numeric NOT NULL,
    interest_rate numeric NOT NULL,
    loan_purpose text,
    approval_date date,
    disbursement_date date,
    repayment_period integer,
    repayment_schedule text,
    outstanding_balance numeric,
    status text DEFAULT 'pending'::text CHECK (status IN ('pending', 'approved', 'disbursed', 'repaid', 'defaulted')),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.cooperative_loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Borrowers and group leaders can view loans"
ON public.cooperative_loans FOR SELECT
USING (
    auth.uid() = borrower_id OR
    EXISTS (
        SELECT 1 FROM cooperative_groups 
        WHERE id = group_id AND group_leader_id = auth.uid()
    )
);

CREATE POLICY "Members can apply for loans"
ON public.cooperative_loans FOR INSERT
WITH CHECK (auth.uid() = borrower_id);

-- Loan Repayments
CREATE TABLE IF NOT EXISTS public.loan_repayments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id uuid REFERENCES public.cooperative_loans(id) ON DELETE CASCADE NOT NULL,
    amount numeric NOT NULL,
    payment_date date NOT NULL,
    payment_method text,
    payment_reference text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.loan_repayments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Borrowers can manage their loan repayments"
ON public.loan_repayments FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM cooperative_loans 
        WHERE id = loan_id AND borrower_id = auth.uid()
    )
);

-- Create update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_export_opportunities_updated_at
    BEFORE UPDATE ON public.export_opportunities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_batch_tracking_updated_at
    BEFORE UPDATE ON public.batch_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carbon_emissions_updated_at
    BEFORE UPDATE ON public.carbon_emissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carbon_offset_projects_updated_at
    BEFORE UPDATE ON public.carbon_offset_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cooperative_activities_updated_at
    BEFORE UPDATE ON public.cooperative_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cooperative_loans_updated_at
    BEFORE UPDATE ON public.cooperative_loans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();