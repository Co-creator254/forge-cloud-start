-- Create carbon_forum_posts table
CREATE TABLE IF NOT EXISTS public.carbon_forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('discussion', 'question', 'article', 'update')),
  tags TEXT[] DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create carbon_forum_comments table
CREATE TABLE IF NOT EXISTS public.carbon_forum_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.carbon_forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_carbon_forum_posts_author ON public.carbon_forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_carbon_forum_posts_created ON public.carbon_forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_carbon_forum_comments_post ON public.carbon_forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_carbon_forum_comments_user ON public.carbon_forum_comments(user_id);

-- Add update trigger for carbon_forum_posts
CREATE TRIGGER update_carbon_forum_posts_updated_at
  BEFORE UPDATE ON public.carbon_forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add update trigger for carbon_forum_comments
CREATE TRIGGER update_carbon_forum_comments_updated_at
  BEFORE UPDATE ON public.carbon_forum_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.carbon_forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_forum_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for carbon_forum_posts
CREATE POLICY "Anyone can view carbon forum posts"
  ON public.carbon_forum_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create carbon forum posts"
  ON public.carbon_forum_posts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = author_id);

CREATE POLICY "Authors can update their carbon forum posts"
  ON public.carbon_forum_posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their carbon forum posts"
  ON public.carbon_forum_posts FOR DELETE
  USING (auth.uid() = author_id);

-- RLS Policies for carbon_forum_comments
CREATE POLICY "Anyone can view carbon forum comments"
  ON public.carbon_forum_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create carbon forum comments"
  ON public.carbon_forum_comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Authors can update their carbon forum comments"
  ON public.carbon_forum_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Authors can delete their carbon forum comments"
  ON public.carbon_forum_comments FOR DELETE
  USING (auth.uid() = user_id);