import React, { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, ThumbsUp, Calendar, MapPin, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CommunityPost } from '@/types';

const CommunityForums: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('discussions');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isPostingThread, setIsPostingThread] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: "post1",
      title: "Best practices for maize storage",
      content: "I've been struggling with post-harvest losses in my maize. What are the best practices for storage to minimize losses?",
      author: "John Kimani",
      date: "2023-05-15",
      likes: 24,
      comments: 8,
      category: "storage",
      tags: ["maize", "storage", "post-harvest"],
      location: "Nakuru County"
    },
    {
      id: "post2",
      title: "Upcoming Agricultural Fair in Nairobi",
      content: 'There\'s an agricultural fair happening next month in Nairobi. Great opportunity to network and learn about new farming technologies. Who\'s planning to attend?',
      author: "Jane Farmer",
      date: "2024-03-18",
      likes: 24,
      comments: 15,
      category: "event",
      tags: ["event", "networking", "technology"],
      location: "Nairobi County"
    },
    {
      id: "post3",
      title: "Looking for maize suppliers in Western region",
      content: 'Our cooperative is looking to purchase large quantities of maize from farmers in Western Kenya. We offer competitive prices and can arrange transportation.',
      author: "Sarah Cooperative",
      date: "2024-03-19",
      likes: 5,
      comments: 3,
      category: "market",
      tags: ["maize", "bulk-purchase", "western-kenya"],
      location: "Kakamega County"
    }
  ]);
  
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Sign up successful!',
      description: 'Your community account has been created.',
    });
    setIsSigningUp(false);
  };
  
  const handlePostThread = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Post created!',
      description: 'Your discussion thread has been posted to the community.',
    });
    setIsPostingThread(false);
  };
  
  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Community Forums</h1>
            <p className="text-muted-foreground">
              Connect with farmers, traders, and agricultural experts across Kenya
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            {!isSigningUp && (
              <Button onClick={() => setIsSigningUp(true)}>Sign Up</Button>
            )}
            {!isPostingThread && (
              <Button variant="outline" onClick={() => setIsPostingThread(true)}>
                Start Discussion
              </Button>
            )}
          </div>
        </div>
        
        {isSigningUp && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Join the Community</CardTitle>
              <CardDescription>
                Create an account to participate in discussions and connect with other agricultural stakeholders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Your email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+254..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="county">County</Label>
                    <Select>
                      <SelectTrigger id="county">
                        <SelectValue placeholder="Select your county" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nairobi">Nairobi</SelectItem>
                        <SelectItem value="nakuru">Nakuru</SelectItem>
                        <SelectItem value="kiambu">Kiambu</SelectItem>
                        <SelectItem value="mombasa">Mombasa</SelectItem>
                        <SelectItem value="kisumu">Kisumu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">I am a</Label>
                    <Select>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farmer">Farmer</SelectItem>
                        <SelectItem value="trader">Trader</SelectItem>
                        <SelectItem value="transporter">Transporter</SelectItem>
                        <SelectItem value="warehouse">Warehouse Provider</SelectItem>
                        <SelectItem value="cooperative">Cooperative Representative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Create a password" required />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" type="button" onClick={() => setIsSigningUp(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Account</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        
        {isPostingThread && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Start a Discussion</CardTitle>
              <CardDescription>
                Share your question, knowledge, or updates with the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePostThread} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Discussion title" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="question">Question</SelectItem>
                      <SelectItem value="discussion">Discussion</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="market">Market Information</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" placeholder="Share your thoughts, questions, or information..." rows={5} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input id="tags" placeholder="e.g. maize, irrigation, prices" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location (optional)</Label>
                  <Input id="location" placeholder="County or specific location" />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" type="button" onClick={() => setIsPostingThread(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Post Discussion</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="market">Market Info</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discussions" className="mt-6">
            <div className="space-y-4">
              {posts.map(post => (
                <Card key={post.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-lg">{post.title}</h3>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.created).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm font-medium">{post.userName}</div>
                        <p className="mt-2">{post.content}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.tags.map(tag => (
                            <div key={tag} className="bg-secondary/50 rounded-full px-2 py-1 text-xs flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </div>
                          ))}
                        </div>
                        {post.location && (
                          <div className="flex items-center text-xs text-muted-foreground mt-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            {post.location}
                          </div>
                        )}
                        <div className="flex space-x-4 mt-4">
                          <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleLike(post.id)}>
                            <ThumbsUp className="h-4 w-4 mr-1" /> {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            <MessageCircle className="h-4 w-4 mr-1" /> {post.comments}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="questions" className="mt-6">
            <div className="space-y-4">
              {posts.filter(post => post.category === 'question').map(post => (
                <Card key={post.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-lg">{post.title}</h3>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.created).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm font-medium">{post.userName}</div>
                        <p className="mt-2">{post.content}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.tags.map(tag => (
                            <div key={tag} className="bg-secondary/50 rounded-full px-2 py-1 text-xs flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </div>
                          ))}
                        </div>
                        {post.location && (
                          <div className="flex items-center text-xs text-muted-foreground mt-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            {post.location}
                          </div>
                        )}
                        <div className="flex space-x-4 mt-4">
                          <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleLike(post.id)}>
                            <ThumbsUp className="h-4 w-4 mr-1" /> {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            <MessageCircle className="h-4 w-4 mr-1" /> {post.comments}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="market" className="mt-6">
            <div className="space-y-4">
              {posts.filter(post => post.category === 'market').map(post => (
                <Card key={post.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-lg">{post.title}</h3>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.created).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm font-medium">{post.userName}</div>
                        <p className="mt-2">{post.content}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.tags.map(tag => (
                            <div key={tag} className="bg-secondary/50 rounded-full px-2 py-1 text-xs flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </div>
                          ))}
                        </div>
                        {post.location && (
                          <div className="flex items-center text-xs text-muted-foreground mt-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            {post.location}
                          </div>
                        )}
                        <div className="flex space-x-4 mt-4">
                          <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleLike(post.id)}>
                            <ThumbsUp className="h-4 w-4 mr-1" /> {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            <MessageCircle className="h-4 w-4 mr-1" /> {post.comments}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="events" className="mt-6">
            <div className="space-y-4">
              {posts.filter(post => post.category === 'event').map(post => (
                <Card key={post.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-lg">{post.title}</h3>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.created).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm font-medium">{post.userName}</div>
                        <p className="mt-2">{post.content}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.tags.map(tag => (
                            <div key={tag} className="bg-secondary/50 rounded-full px-2 py-1 text-xs flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </div>
                          ))}
                        </div>
                        {post.location && (
                          <div className="flex items-center text-xs text-muted-foreground mt-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            {post.location}
                          </div>
                        )}
                        <div className="flex space-x-4 mt-4">
                          <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleLike(post.id)}>
                            <ThumbsUp className="h-4 w-4 mr-1" /> {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            <MessageCircle className="h-4 w-4 mr-1" /> {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            <Calendar className="h-4 w-4 mr-1" /> Attend
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CommunityForums;
