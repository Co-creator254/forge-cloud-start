import React, { useEffect, useState } from 'react';
import { MainNav } from '@/components/MainNav';
import { MobileNav } from '@/components/MobileNav';
import { BottomNav } from '@/components/BottomNav';
import { createInputPricing, getInputPricing, reviewSupplier, getSupplierReviews } from '@/services/inputPricingService';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, AlertCircle, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InputPricingVerification: React.FC = () => {
  const { toast } = useToast();
  const [productId, setProductId] = useState('');
  const [price, setPrice] = useState('');
  const [prices, setPrices] = useState<any[]>([]);
  const [supplierId, setSupplierId] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPrices();
  }, [productId, supplierId]);

  const loadPrices = async () => {
    try {
      const filter: any = {};
      if (productId) filter.product_id = productId;
      if (supplierId) filter.supplier_id = supplierId;
      
      const { data } = await getInputPricing(filter);
      setPrices(data || []);
    } catch (error) {
      console.error('Error loading prices:', error);
    }
  };

  const loadReviews = async () => {
    if (!supplierId) return;
    try {
      const { data } = await getSupplierReviews(supplierId);
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [supplierId]);

  const handleReportPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !supplierId || !price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await createInputPricing({ 
        product_id: productId, 
        supplier_id: supplierId, 
        price: parseFloat(price) 
      });
      
      toast({
        title: "Success",
        description: "Price reported successfully"
      });
      
      setPrice('');
      loadPrices();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to report price",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || !rating) {
      toast({
        title: "Missing Information",
        description: "Please provide supplier ID and rating",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await reviewSupplier({ 
        supplier_id: supplierId, 
        rating, 
        review 
      });
      
      toast({
        title: "Success",
        description: "Review submitted successfully"
      });
      
      setReview('');
      setRating(0);
      loadReviews();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

      <main className="flex-1 container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Input Pricing & Supplier Verification</h1>
          <p className="text-muted-foreground">
            Crowdsource and verify input prices from suppliers. Help farmers make informed purchasing decisions 
            by reporting prices you've seen or received. Review suppliers to build trust in the marketplace.
          </p>
          
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">How It Works:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Report input prices you've encountered from various suppliers</li>
              <li>Search and compare prices across suppliers to find the best deals</li>
              <li>View verification status - prices confirmed by multiple users are marked as verified</li>
              <li>Review suppliers based on your experience with product quality and service</li>
              <li>Check supplier ratings and reviews before making purchase decisions</li>
              <li>Community-driven data helps everyone access fair pricing</li>
            </ol>
          </div>
        </div>

        <Tabs defaultValue="pricing" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pricing">Price Reporting</TabsTrigger>
            <TabsTrigger value="reviews">Supplier Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Input Price</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReportPrice} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productId">Product/Input ID *</Label>
                      <Input 
                        id="productId"
                        type="text" 
                        placeholder="e.g., seed-maize-001" 
                        value={productId} 
                        onChange={e => setProductId(e.target.value)} 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplierId">Supplier ID *</Label>
                      <Input 
                        id="supplierId"
                        type="text" 
                        placeholder="e.g., supplier-123" 
                        value={supplierId} 
                        onChange={e => setSupplierId(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (KES) *</Label>
                    <Input 
                      id="price"
                      type="number" 
                      step="0.01"
                      placeholder="e.g., 2500" 
                      value={price} 
                      onChange={e => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Submitting...' : 'Report Price'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reported Prices</CardTitle>
              </CardHeader>
              <CardContent>
                {prices.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No prices reported yet. Be the first to report!</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product ID</TableHead>
                        <TableHead>Supplier ID</TableHead>
                        <TableHead>Price (KES)</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prices.map(p => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.product_id}</TableCell>
                          <TableCell>{p.supplier_id}</TableCell>
                          <TableCell>KES {p.price?.toLocaleString()}</TableCell>
                          <TableCell>
                            {p.verified ? (
                              <Badge variant="default" className="flex items-center gap-1 w-fit">
                                <CheckCircle className="h-3 w-3" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                                <AlertCircle className="h-3 w-3" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Supplier</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReviewSupplier} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reviewSupplierId">Supplier ID *</Label>
                    <Input 
                      id="reviewSupplierId"
                      type="text" 
                      placeholder="e.g., supplier-123" 
                      value={supplierId} 
                      onChange={e => setSupplierId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rating * (1-5 stars)</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-2 rounded transition-colors ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          <Star className="h-6 w-6" fill={rating >= star ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                      <span className="ml-2 self-center text-sm text-muted-foreground">
                        {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reviewText">Review (optional)</Label>
                    <Textarea 
                      id="reviewText"
                      placeholder="Share your experience with this supplier..." 
                      value={review} 
                      onChange={e => setReview(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button type="submit" disabled={loading || rating === 0} className="w-full">
                    {loading ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supplier Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map(r => (
                      <Card key={r.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">Supplier: {r.supplier_id}</p>
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className="h-4 w-4 text-yellow-500" 
                                    fill={i < r.rating ? 'currentColor' : 'none'} 
                                  />
                                ))}
                                <span className="ml-1 text-sm text-muted-foreground">
                                  {r.rating} stars
                                </span>
                              </div>
                            </div>
                            {r.verified && (
                              <Badge variant="default">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          {r.review && (
                            <p className="text-sm text-muted-foreground mt-2">{r.review}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default InputPricingVerification;
