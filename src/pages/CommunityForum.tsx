import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, MessageSquare, TrendingUp, CheckCircle2, Shield, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CreatePostForm from '@/components/community/CreatePostForm';
import PostCard from '@/components/community/PostCard';
import CommunityFilters from '@/components/community/CommunityFilters';
import communityHeroBg from '@/assets/community-hero-bg.png';

const CommunityForum: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchPosts();
  }, [category, sortBy]);

  const fetchPosts = async () => {
    try {
      let query = (supabase as any)
        .from('community_posts')
        .select(`
          *,
          profiles:author_id (
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'active');

      if (category !== 'all') {
        query = query.eq('category', category);
      }

      switch (sortBy) {
        case 'popular':
          query = query.order('upvotes', { ascending: false });
          break;
        case 'commented':
          query = query.order('downvotes', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load community posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a post",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: post, error: postError } = await (supabase as any)
        .from('community_posts')
        .insert({
          author_id: user.id,
          title: postData.title,
          content: postData.content,
          category: postData.category,
          tags: postData.tags
        })
        .select()
        .single();

      if (postError) throw postError;

      toast({
        title: "Success",
        description: "Your post has been created successfully!"
      });

      setShowCreateForm(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    }
  };

  const filteredPosts = posts.filter(post => 
    searchTerm === '' || 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section with Background Image */}
      <section 
        className="relative py-20 md:py-28"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${communityHeroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
              <Users className="h-3 w-3 mr-1" />
              SokoConnect Community
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Community Forum
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Connect with fellow farmers, share knowledge, and grow together. 
              Join Kenya's largest agricultural community.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>Expert Advice</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Shield className="h-5 w-5 text-green-400" />
                <span>Verified Members</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Zap className="h-5 w-5 text-green-400" />
                <span>Real-time Updates</span>
              </div>
            </div>
            {user ? (
              <Button 
                size="lg" 
                onClick={() => setShowCreateForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Start a Discussion
              </Button>
            ) : (
              <Button 
                size="lg" 
                variant="secondary"
                className="px-8 py-6 text-lg"
              >
                Sign In to Participate
              </Button>
            )}
          </div>
        </div>
      </section>

      <main className="container mx-auto py-8 px-4">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5" />
                Active Discussions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts.length}</div>
              <p className="text-sm text-muted-foreground">Posts this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Community Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,500+</div>
              <p className="text-sm text-muted-foreground">Active farmers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5" />
                Popular Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <div>#maize-farming</div>
                <div>#weather-alerts</div>
                <div>#market-prices</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowCreateForm(true)} 
                className="w-full"
                disabled={!user}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </CardContent>
          </Card>
        </div>

        {showCreateForm && (
          <div className="mb-8">
            <CreatePostForm
              onSubmit={createPost}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        <CommunityFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          category={category}
          onCategoryChange={setCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Be the first to start a discussion!'}
                </p>
                {!showCreateForm && user && (
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Post
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  id: post.id,
                  title: post.title,
                  content: post.content,
                  author: {
                    name: post.profiles?.full_name || 'Anonymous',
                    avatar: post.profiles?.avatar_url,
                    isVerified: false,
                  },
                  category: post.category,
                  tags: post.tags || [],
                  location: post.location,
                  likes: post.upvotes || 0,
                  comments: post.downvotes || 0,
                  createdAt: post.created_at,
                }}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default CommunityForum;
