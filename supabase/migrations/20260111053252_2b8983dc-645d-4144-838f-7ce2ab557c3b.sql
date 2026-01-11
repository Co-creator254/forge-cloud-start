-- Create f2c_subscriptions table for F2C subscription tracking
CREATE TABLE public.f2c_subscriptions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users,
    box_id UUID NOT NULL REFERENCES public.subscription_boxes(id),
    subscription_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    delivery_address TEXT,
    delivery_county TEXT,
    delivery_phone TEXT,
    payment_status TEXT DEFAULT 'pending',
    payment_reference TEXT,
    amount_paid NUMERIC,
    start_date DATE DEFAULT CURRENT_DATE,
    next_delivery_date DATE,
    delivery_frequency TEXT DEFAULT 'weekly',
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.f2c_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own subscriptions" 
ON public.f2c_subscriptions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create subscriptions" 
ON public.f2c_subscriptions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their subscriptions" 
ON public.f2c_subscriptions FOR UPDATE 
USING (auth.uid() = user_id);

-- Farmers can view subscriptions to their boxes
CREATE POLICY "Farmers can view box subscriptions" 
ON public.f2c_subscriptions FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.subscription_boxes 
        WHERE id = box_id AND farmer_id = auth.uid()
    )
);

-- Update trigger
CREATE TRIGGER update_f2c_subscriptions_updated_at
BEFORE UPDATE ON public.f2c_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();