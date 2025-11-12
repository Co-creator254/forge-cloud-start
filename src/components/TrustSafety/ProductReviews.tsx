import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageSquare, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductReview {
  id: string;
  reviewer_id: string;
  reviewer_name: string;
  rating: number;
  review_title: string;
  review_text: string;
  photo_urls?: string[];
  is_verified_purchase: boolean;
  helpful_count: number;
  unhelpful_count: number;
  seller_response?: string;
  created_at: string;
}

interface ProductReviewsProps {
  product_id: string;
  product_type: 'equipment' | 'farm_input' | 'subscription_box' | 'agricultural_product';
  seller_id?: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  product_id,
  product_type,
  seller_id
}) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', product_id)
        .eq('product_type', product_type)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reviews',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewTitle || !reviewText) {
      toast({
        title: 'Incomplete Review',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase.from('product_reviews').insert([
        {
          product_id,
          product_type,
          reviewer_id: (await supabase.auth.getUser()).data.user?.id,
          rating,
          review_title: reviewTitle,
          review_text: reviewText,
          is_verified_purchase: true
        }
      ]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Your review has been submitted'
      });

      setShowReviewForm(false);
      setReviewTitle('');
      setReviewText('');
      setRating(5);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive'
      });
    }
  };

  const handleHelpful = async (reviewId: string, isHelpful: boolean) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (!review) return;

      const updateField = isHelpful ? 'helpful_count' : 'unhelpful_count';
      const newCount = isHelpful ? review.helpful_count + 1 : review.unhelpful_count + 1;

      const { error } = await supabase
        .from('product_reviews')
        .update({ [updateField]: newCount })
        .eq('id', reviewId);

      if (error) throw error;
      fetchReviews();
    } catch (error) {
      console.error('Error updating helpful count:', error);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
          <CardDescription>
            {reviews.length} reviews • Average rating: {averageRating}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating Summary */}
          <div className="flex items-start gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold">{averageRating}</div>
              <div className="flex gap-1 justify-center mt-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(Number(averageRating))
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">Based on {reviews.length} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map(stars => {
                const count = reviews.filter(r => r.rating === stars).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="w-12 text-sm text-gray-600">{stars} ⭐</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm text-gray-600">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="w-full"
          >
            Write a Review
          </Button>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">Share Your Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Rating */}
            <div>
              <label className="text-sm font-semibold block mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-semibold block mb-2">Review Title</label>
              <Input
                placeholder="Summarize your experience"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
              />
            </div>

            {/* Review Text */}
            <div>
              <label className="text-sm font-semibold block mb-2">Your Review</label>
              <Textarea
                placeholder="Share details about your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmitReview} className="flex-1">
                Submit Review
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map(review => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              {/* Reviewer Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <h4 className="font-semibold">{review.review_title}</h4>
                  {review.is_verified_purchase && (
                    <Badge className="mt-1">Verified Purchase</Badge>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-4">{review.review_text}</p>

              {/* Helpful */}
              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => handleHelpful(review.id, true)}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Helpful ({review.helpful_count})
                </button>
                <button
                  onClick={() => handleHelpful(review.id, false)}
                  className="flex items-center gap-1 text-gray-600 hover:text-red-600"
                >
                  <ThumbsDown className="h-4 w-4" />
                  Not Helpful ({review.unhelpful_count})
                </button>
              </div>

              {/* Seller Response */}
              {review.seller_response && (
                <div className="mt-4 p-3 bg-gray-100 rounded border-l-4 border-blue-500">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Seller Response:</p>
                  <p className="text-sm text-gray-700">{review.seller_response}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
