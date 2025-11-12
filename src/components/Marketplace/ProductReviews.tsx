import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, MessageSquare, ThumbsUp, Flag, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_KEY || ''
);

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  verified_purchase: boolean;
  helpful_count: number;
  unhelpful_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    avatar_url?: string;
  };
}

export interface ProductReviewsProps {
  productId: string;
  marketplace?: string;
  onReviewAdded?: (review: Review) => void;
}

export interface ReviewStats {
  avg_rating: number;
  total_reviews: number;
  distribution: {
    five_star: number;
    four_star: number;
    three_star: number;
    two_star: number;
    one_star: number;
  };
  verified_percentage: number;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  marketplace = 'farm-inputs',
  onReviewAdded,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Form state
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchReviewsAndStats();
  }, [productId]);

  const fetchReviewsAndStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch reviews
      let query = supabase
        .from('product_reviews')
        .select('*, user:users(name, avatar_url)')
        .eq('product_id', productId);

      if (verifiedOnly) {
        query = query.eq('verified_purchase', true);
      }

      const { data: reviewsData, error: reviewsError } = await query;

      if (reviewsError) throw reviewsError;

      // Sort reviews
      let sortedReviews = reviewsData || [];
      if (sortBy === 'helpful') {
        sortedReviews.sort((a, b) => b.helpful_count - a.helpful_count);
      } else if (sortBy === 'rating') {
        sortedReviews.sort((a, b) => b.rating - a.rating);
      } else {
        sortedReviews.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }

      // Filter by rating
      if (filterRating !== 'all') {
        sortedReviews = sortedReviews.filter(
          (r) => r.rating === parseInt(filterRating)
        );
      }

      setReviews(sortedReviews);

      // Calculate stats
      if (reviewsData && reviewsData.length > 0) {
        const avgRating =
          reviewsData.reduce((sum, r) => sum + r.rating, 0) /
          reviewsData.length;
        const distribution = {
          five_star: reviewsData.filter((r) => r.rating === 5).length,
          four_star: reviewsData.filter((r) => r.rating === 4).length,
          three_star: reviewsData.filter((r) => r.rating === 3).length,
          two_star: reviewsData.filter((r) => r.rating === 2).length,
          one_star: reviewsData.filter((r) => r.rating === 1).length,
        };
        const verifiedCount = reviewsData.filter(
          (r) => r.verified_purchase
        ).length;

        setStats({
          avg_rating: Math.round(avgRating * 10) / 10,
          total_reviews: reviewsData.length,
          distribution,
          verified_percentage: Math.round(
            (verifiedCount / reviewsData.length) * 100
          ),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    try {
      if (!newReview.title.trim() || !newReview.comment.trim()) {
        toast.error('Please fill in title and comment');
        return;
      }

      setSubmittingReview(true);

      const { data, error } = await supabase
        .from('product_reviews')
        .insert([
          {
            product_id: productId,
            user_id: 'current-user-id', // Replace with actual user ID
            rating: newReview.rating,
            title: newReview.title,
            comment: newReview.comment,
            verified_purchase: false,
            helpful_count: 0,
            unhelpful_count: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Review submitted successfully');
      setNewReview({ rating: 5, title: '', comment: '' });
      setOpenDialog(false);

      if (onReviewAdded && data) {
        onReviewAdded(data);
      }

      fetchReviewsAndStats();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    try {
      const review = reviews.find((r) => r.id === reviewId);
      if (!review) return;

      const { error } = await supabase
        .from('product_reviews')
        .update({ helpful_count: review.helpful_count + 1 })
        .eq('id', reviewId);

      if (error) throw error;

      fetchReviewsAndStats();
      toast.success('Marked as helpful');
    } catch (err) {
      toast.error('Failed to mark as helpful');
    }
  };

  const handleReport = async (reviewId: string) => {
    try {
      const { error } = await supabase.from('review_reports').insert([
        {
          review_id: reviewId,
          reporter_id: 'current-user-id',
          reason: 'inappropriate-content',
          marketplace: marketplace,
        },
      ]);

      if (error) throw error;

      toast.success('Review reported successfully');
    } catch (err) {
      toast.error('Failed to report review');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">Loading reviews...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center text-red-700">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>
              {stats.total_reviews} reviews from verified buyers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start justify-between gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold">
                    {stats.avg_rating.toFixed(1)}
                  </span>
                  <div className="space-y-1">
                    {renderStars(Math.round(stats.avg_rating))}
                    <p className="text-xs text-gray-500">
                      {stats.total_reviews} reviews
                    </p>
                  </div>
                </div>
                <p className="text-sm text-green-600">
                  ✓ {stats.verified_percentage}% verified purchase
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2 flex-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-12">{rating} star</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{
                          width: `${
                            stats.distribution[
                              `${rating}_star` as keyof typeof stats.distribution
                            ] / stats.total_reviews * 100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8">
                      {
                        stats.distribution[
                          `${rating}_star` as keyof typeof stats.distribution
                        ]
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Review Button */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="w-full">Write a Review</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Write Your Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Rating *</label>
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() =>
                            setNewReview({ ...newReview, rating: star })
                          }
                          className="p-1"
                        >
                          <Star
                            size={32}
                            className={
                              star <= newReview.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-300'
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Review Title *</label>
                    <Input
                      placeholder="Summarize your experience"
                      value={newReview.title}
                      onChange={(e) =>
                        setNewReview({ ...newReview, title: e.target.value })
                      }
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Your Review *</label>
                    <Textarea
                      placeholder="Share your experience with this product..."
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview({ ...newReview, comment: e.target.value })
                      }
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <Button
                    onClick={handleSubmitReview}
                    disabled={submittingReview}
                    className="w-full"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* Filters and Sort */}
      <div className="flex gap-4 items-center flex-wrap">
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
            <SelectItem value="rating">Highest Rating</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={verifiedOnly ? 'default' : 'outline'}
          onClick={() => setVerifiedOnly(!verifiedOnly)}
        >
          Verified Only
        </Button>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">No reviews yet</div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        {review.verified_purchase && (
                          <Badge variant="secondary">Verified</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold">{review.title}</h3>
                      <p className="text-sm text-gray-500">
                        by {review.user?.name || 'Anonymous'} •{' '}
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700">{review.comment}</p>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleHelpful(review.id)}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
                    >
                      <ThumbsUp size={16} />
                      Helpful ({review.helpful_count})
                    </button>
                    <button
                      onClick={() => handleReport(review.id)}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600"
                    >
                      <Flag size={16} />
                      Report
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
