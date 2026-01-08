import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Heart, MessageCircle, Share2, MoreHorizontal, MapPin, Calendar, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import SocialShare from '@/components/common/SocialShare';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface PollData {
  id: string;
  question: string;
  options: Array<{
    text: string;
    votes: number;
  }>;
  totalVotes: number;
  userVote?: number;
}

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    author: {
      id?: string;
      name: string;
      avatar?: string;
      isVerified?: boolean;
    };
    category: string;
    tags: string[];
    location?: string;
    likes: number;
    comments: number;
    createdAt: string;
    poll?: PollData;
  };
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onVote?: (pollId: string, optionIndex: number) => void;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  onVote,
  onUpdate,
  onDelete
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes);

  const isOwner = user?.id === post.author.id;

  const handleLike = async () => {
    if (!user) {
      toast({ title: 'Please login', description: 'You must be logged in to like posts', variant: 'destructive' });
      return;
    }

    try {
      if (isLiked) {
        // Unlike
        await (supabase as any).from('community_post_likes').delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);
        setLocalLikes(prev => prev - 1);
      } else {
        // Like
        await (supabase as any).from('community_post_likes').insert({
          post_id: post.id,
          user_id: user.id
        });
        setLocalLikes(prev => prev + 1);
      }
      setIsLiked(!isLiked);
      onLike?.(post.id);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    setIsSubmitting(true);
    try {
      const { error } = await (supabase as any)
        .from('community_posts')
        .update({ title: editTitle, content: editContent, updated_at: new Date().toISOString() })
        .eq('id', post.id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Post updated successfully' });
      setShowEditDialog(false);
      onUpdate?.();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update post', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await (supabase as any)
        .from('community_posts')
        .update({ status: 'deleted' })
        .eq('id', post.id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Post deleted successfully' });
      setShowDeleteDialog(false);
      onDelete?.();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete post', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;
    setIsSubmitting(true);
    try {
      const { error } = await (supabase as any)
        .from('community_comments')
        .insert({
          post_id: post.id,
          author_id: user.id,
          content: newComment
        });

      if (error) throw error;

      toast({ title: 'Success', description: 'Comment added' });
      setNewComment('');
      setShowCommentDialog(false);
      onComment?.(post.id);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add comment', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = (optionIndex: number) => {
    if (post.poll && post.poll.userVote === undefined) {
      onVote?.(post.poll.id, optionIndex);
    }
  };

  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? (votes / total) * 100 : 0;
  };

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
    onShare?.(post.id);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>
                  {post.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-medium truncate">{post.author.name}</h4>
                  {post.author.isVerified && (
                    <Badge variant="secondary" className="text-xs">Verified</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                  {post.location && (
                    <span className="flex items-center gap-1">
                      <span>•</span>
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{post.location}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwner && (
                  <>
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Post
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{post.content}</p>
          </div>

          {post.poll && (
            <Card className="p-4 bg-muted/20">
              <h4 className="font-medium mb-3">{post.poll.question}</h4>
              <div className="space-y-2">
                {post.poll.options.map((option, index) => {
                  const percentage = getVotePercentage(option.votes, post.poll!.totalVotes);
                  const hasVoted = post.poll!.userVote !== undefined;
                  const isUserChoice = post.poll!.userVote === index;
                  
                  return (
                    <div key={index} className="space-y-1">
                      <Button
                        variant={isUserChoice ? "default" : "outline"}
                        className="w-full justify-start relative overflow-hidden"
                        onClick={() => handleVote(index)}
                        disabled={hasVoted}
                      >
                        {hasVoted && (
                          <div 
                            className="absolute left-0 top-0 h-full bg-primary/20 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        )}
                        <span className="relative z-10">{option.text}</span>
                        {hasVoted && (
                          <span className="relative z-10 ml-auto text-sm">
                            {option.votes} ({percentage.toFixed(1)}%)
                          </span>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {post.poll.totalVotes} total votes
              </p>
            </Card>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{post.category}</Badge>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">#{tag}</Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLike}
                className={isLiked ? "text-red-500" : ""}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                {localLikes}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowCommentDialog(true)}>
                <MessageCircle className="h-4 w-4 mr-1" />
                {post.comments}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showShareOptions && (
            <div className="pt-2 border-t">
              <SocialShare
                title={`${post.title} by ${post.author.name}`}
                text={`${post.content}\n\nShared from SokoConnect Community Forum`}
                size="sm"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Post title"
            />
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Post content"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
          </DialogHeader>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommentDialog(false)}>Cancel</Button>
            <Button onClick={handleAddComment} disabled={isSubmitting || !newComment.trim()}>
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostCard;