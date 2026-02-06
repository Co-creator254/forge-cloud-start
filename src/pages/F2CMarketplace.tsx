import { useState, useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, MapPin, Calendar, Package, DollarSign, Plus, Search, Truck, Leaf, CheckCircle2, Star, Heart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MarketplaceImage } from "@/components/MarketplaceImage";
import { MarketplaceDisclaimer } from "@/components/MarketplaceDisclaimer";
import { initializePaystackPayment, redirectToPaystack, F2C_SUPPLIER_FEE, PLATFORM_DISCLAIMER } from "@/services/paystackService";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import f2cHeroBg from "@/assets/f2c-hero-bg.png";

interface SubscriptionBox {
  id: string;
  farmer_id: string;
  box_name: string;
  description: string;
  box_type: string;
  price: number;
  currency: string;
  contents: any;
  farm_location: string;
  county: string;
  delivery_areas: string[];
  max_subscriptions?: number;
  current_subscriptions: number;
  is_active: boolean;
  images: string[];
  created_at: string;
}

const F2CMarketplace = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [boxes, setBoxes] = useState<SubscriptionBox[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCounty, setFilterCounty] = useState("all");
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [subscribingBoxId, setSubscribingBoxId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionBoxes();
  }, []);

  const fetchSubscriptionBoxes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('subscription_boxes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBoxes(data || []);
    } catch (error) {
      console.error('Error fetching subscription boxes:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription boxes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (box: SubscriptionBox) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to subscribe to this box.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setSubscribingBoxId(box.id);

    try {
      // Initialize Paystack payment
      const response = await initializePaystackPayment({
        email: user.email || '',
        amount: box.price,
        plan_id: `f2c-${box.box_type}`,
        plan_type: 'f2c',
        metadata: {
          user_id: user.id,
          box_id: box.id,
          box_name: box.box_name,
          subscription_type: box.box_type,
          delivery_county: box.county
        }
      });

      if (response.success && response.authorization_url) {
        toast({
          title: "Redirecting to Payment",
          description: "You'll be redirected to Paystack to complete payment.",
        });
        redirectToPaystack(response.authorization_url);
      } else {
        toast({
          title: "Payment Error",
          description: response.error || "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubscribingBoxId(null);
    }
  };

  const counties = Array.from(new Set(boxes.map(b => b.county)));

  const filteredBoxes = boxes.filter(box => {
    const matchesSearch = searchTerm === "" || 
      box.box_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      box.farm_location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || box.box_type === filterType;
    const matchesCounty = filterCounty === "all" || box.county === filterCounty;
    
    return matchesSearch && matchesType && matchesCounty;
  });

  const getBoxTypeLabel = (type: string) => {
    switch(type) {
      case 'weekly': return 'Weekly';
      case 'bi-weekly': return 'Bi-Weekly';
      case 'monthly': return 'Monthly';
      default: return type;
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

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <MarketplaceDisclaimer
          marketplaceType="agricultural"
          onAccept={() => setShowDisclaimer(false)}
        />
      )}

      <main className="flex-1">
        {/* Enhanced Hero Section with Background Image */}
        <section 
          className="relative py-20 md:py-28"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${f2cHeroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
                <Leaf className="h-3 w-3 mr-1" />
                Farm Fresh Direct
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Farm-to-Consumer<br />Subscription Boxes
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
                Fresh, organic produce delivered directly from Kenyan farms to your doorstep. 
                Support local farmers while enjoying the freshest ingredients.
              </p>
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <span>100% Organic</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Truck className="h-5 w-5 text-green-400" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Heart className="h-5 w-5 text-green-400" />
                  <span>Support Farmers</span>
                </div>
              </div>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg">
                <Plus className="h-5 w-5 mr-2" />
                Create Your Subscription Box
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-primary/5 py-8 border-b">
          <div className="container px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Active Farmers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">47</div>
                <div className="text-sm text-muted-foreground">Counties Covered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">2,000+</div>
                <div className="text-sm text-muted-foreground">Happy Subscribers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">24hrs</div>
                <div className="text-sm text-muted-foreground">Farm to Door</div>
              </div>
            </div>
          </div>
        </section>

        <div className="container px-4 py-12">
          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Package className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="font-bold text-xl mb-2">Farm Fresh Produce</h3>
                <p className="text-muted-foreground">Harvested and delivered within 24-48 hours for maximum freshness</p>
              </CardContent>
            </Card>
            <Card className="text-center border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Truck className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="font-bold text-xl mb-2">Doorstep Delivery</h3>
                <p className="text-muted-foreground">Convenient scheduled delivery right to your home or office</p>
              </CardContent>
            </Card>
            <Card className="text-center border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="h-10 w-10 text-amber-600" />
                </div>
                <h3 className="font-bold text-xl mb-2">Fair Trade Prices</h3>
                <p className="text-muted-foreground">No middlemen - farmers get fair pay, you get better prices</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subscription boxes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCounty} onValueChange={setFilterCounty}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Counties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                {counties.map(county => (
                  <SelectItem key={county} value={county}>{county}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subscription Boxes */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Card key={n} className="animate-pulse">
                  <div className="h-48 bg-muted"></div>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : filteredBoxes.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No subscription boxes found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or check back later.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBoxes.map((box) => {
                const availableSlots = box.max_subscriptions 
                  ? box.max_subscriptions - box.current_subscriptions 
                  : null;
                const isSubscribing = subscribingBoxId === box.id;
                
                return (
                  <Card key={box.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="h-48 bg-gray-200">
                      <MarketplaceImage 
                        src={box.images && box.images.length > 0 ? box.images[0] : undefined}
                        alt={box.box_name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg flex-1">{box.box_name}</CardTitle>
                        <Badge>{getBoxTypeLabel(box.box_type)}</Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {box.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{box.farm_location}, {box.county}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-semibold text-lg">
                          {box.currency} {box.price.toLocaleString()}/{getBoxTypeLabel(box.box_type).toLowerCase()}
                        </span>
                      </div>
                      
                      {box.delivery_areas.length > 0 && (
                        <div className="flex items-start gap-2 text-sm">
                          <Truck className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">
                            Delivers to: {box.delivery_areas.slice(0, 3).join(', ')}
                            {box.delivery_areas.length > 3 && ` +${box.delivery_areas.length - 3} more`}
                          </span>
                        </div>
                      )}
                      
                      {availableSlots !== null && (
                        <div className="text-sm text-muted-foreground">
                          {availableSlots > 0 ? (
                            <span>{availableSlots} slots available</span>
                          ) : (
                            <Badge variant="destructive">Fully Subscribed</Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        disabled={(availableSlots !== null && availableSlots <= 0) || isSubscribing}
                        onClick={() => handleSubscribe(box)}
                      >
                        {isSubscribing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Subscribe Now'
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default F2CMarketplace;
