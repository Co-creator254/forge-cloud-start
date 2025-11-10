import React, { useEffect, useState } from 'react';
import { MainNav } from '@/components/MainNav';
import { MobileNav } from '@/components/MobileNav';
import { BottomNav } from '@/components/BottomNav';
import ForumCommentForm from '@/components/ForumCommentForm';
import ForumCommentList from '@/components/ForumCommentList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  createPost,
  updatePost,
  deletePost,
  listPosts
} from '../services/carbonForumService';
import carbonForumBg from '@/assets/carbon-forum-bg.png';

export const CarbonForumPage: React.FC<{ userId: string }> = ({ userId }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', type: '', event_date: '', org_link: '', success_story: '' });
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    listPosts().then(({ data }) => setPosts(data || []));
  }, []);

  const handleCreatePost = async () => {
    await createPost({ ...newPost, user_id: userId });
    listPosts().then(({ data }) => setPosts(data || []));
    setNewPost({ title: '', content: '', type: '', event_date: '', org_link: '', success_story: '' });
  };

  const handleSelectPost = (post: any) => {
    setSelectedPost(post);
    setEditMode(false);
  };

  const handleUpdatePost = async () => {
    if (selectedPost) {
      await updatePost(selectedPost.id, selectedPost);
      listPosts().then(({ data }) => setPosts(data || []));
      setEditMode(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    await deletePost(id);
    listPosts().then(({ data }) => setPosts(data || []));
    setSelectedPost(null);
  };

  return (
    <div className="flex min-h-screen flex-col pb-20 md:pb-0">
      <header className="sticky top-0 z-30 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <div className="hidden md:block">
            <MainNav />
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Hero Section with Background */}
      <section 
        className="relative bg-gradient-to-br from-green-600 to-green-700 text-white py-16"
        style={{
          backgroundImage: `linear-gradient(rgba(22, 163, 74, 0.85), rgba(21, 128, 61, 0.85)), url(${carbonForumBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Carbon Credits & Circular Economy Forum</h1>
          <p className="text-xl mb-6 max-w-3xl mx-auto">
            Join the conversation on sustainable agriculture, carbon credits, and circular economy practices
          </p>
        </div>
      </section>

      <main className="flex-1 container py-6">
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                type="text" 
                placeholder="Title" 
                value={newPost.title} 
                onChange={e => setNewPost({ ...newPost, title: e.target.value })} 
                className="w-full"
              />
              <Textarea 
                placeholder="Content" 
                value={newPost.content} 
                onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                rows={4}
              />
              <Input 
                type="text" 
                placeholder="Type (event, opportunity, story)" 
                value={newPost.type} 
                onChange={e => setNewPost({ ...newPost, type: e.target.value })} 
              />
              <Input 
                type="date" 
                placeholder="Event Date" 
                value={newPost.event_date} 
                onChange={e => setNewPost({ ...newPost, event_date: e.target.value })} 
              />
              <Input 
                type="text" 
                placeholder="Organization Link" 
                value={newPost.org_link} 
                onChange={e => setNewPost({ ...newPost, org_link: e.target.value })} 
              />
              <Textarea 
                placeholder="Success Story" 
                value={newPost.success_story} 
                onChange={e => setNewPost({ ...newPost, success_story: e.target.value })}
                rows={3}
              />
              <Button onClick={handleCreatePost} className="w-full">Create Post</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-4">Forum Posts</h3>
          <div className="grid gap-4">
            {posts.map(post => (
              <Card key={post.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{post.title} ({post.type})</span>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleSelectPost(post)}>View</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeletePost(post.id)}>Delete</Button>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {selectedPost && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-4">
                  <Input 
                    type="text" 
                    value={selectedPost.title} 
                    onChange={e => setSelectedPost({ ...selectedPost, title: e.target.value })} 
                  />
                  <Textarea 
                    value={selectedPost.content} 
                    onChange={e => setSelectedPost({ ...selectedPost, content: e.target.value })}
                    rows={6}
                  />
                  <Button onClick={handleUpdatePost}>Save</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-xl font-bold">{selectedPost.title}</h4>
                  <p>{selectedPost.content}</p>
                  <Button onClick={() => setEditMode(true)}>Edit</Button>
                </div>
              )}
              
              {/* Forum Comments Section */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4">Comments</h4>
                <ForumCommentForm postId={selectedPost.id} userId={userId} onCommented={() => {}} />
                <ForumCommentList postId={selectedPost.id} userId={userId} />
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
};

export default CarbonForumPage;
