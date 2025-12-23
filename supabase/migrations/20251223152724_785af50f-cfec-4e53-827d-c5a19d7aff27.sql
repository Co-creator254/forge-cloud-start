-- Fix policies with unique names
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;

-- RLS Policies for notifications with unique names
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System creates notifications" ON public.notifications FOR INSERT WITH CHECK (true);