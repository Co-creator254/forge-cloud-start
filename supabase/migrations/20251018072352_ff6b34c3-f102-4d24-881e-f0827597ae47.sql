-- CRITICAL FIX 4 (CORRECTED): Fix group_members infinite recursion

-- Step 1: Create security definer function for group membership check (no status column)
CREATE OR REPLACE FUNCTION public.is_group_member(
  _group_id uuid,
  _user_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_id = _group_id 
    AND user_id = _user_id
  )
$$;

-- Step 2: Drop existing problematic policies on group_members
DROP POLICY IF EXISTS "Group members can view members" ON public.group_members;
DROP POLICY IF EXISTS "Members can view group members" ON public.group_members;
DROP POLICY IF EXISTS "Users view their own memberships" ON public.group_members;
DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can update their memberships" ON public.group_members;

-- Step 3: Create non-recursive policies for group_members
CREATE POLICY "Users view their own memberships"
ON public.group_members
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can join groups"
ON public.group_members
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their memberships"
ON public.group_members
FOR UPDATE
USING (auth.uid() = user_id);

-- Step 4: Fix group_messages policies to use security definer function
DROP POLICY IF EXISTS "Group members can view messages" ON public.group_messages;
DROP POLICY IF EXISTS "Group members can send messages" ON public.group_messages;

CREATE POLICY "Group members can view messages"
ON public.group_messages
FOR SELECT
USING (public.is_group_member(group_id, auth.uid()));

CREATE POLICY "Group members can send messages"
ON public.group_messages
FOR INSERT
WITH CHECK (
  public.is_group_member(group_id, auth.uid()) 
  AND auth.uid() = sender_id
);