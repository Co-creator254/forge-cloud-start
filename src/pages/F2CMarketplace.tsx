import { useState, useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, MapPin, Calendar, Package, DollarSign, Plus, Search, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [boxes, setBoxes] = useState<SubscriptionBox[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCounty, setFilterCounty] = useState("all");

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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Farm-to-Consumer Marketplace</h1>
              <p className="text-xl mb-8">
                Subscribe to fresh, organic produce delivered directly from local farms to your doorstep
              </p>
              <Button size="lg" variant="secondary">
                <Plus className="h-4 w-4 mr-2" />
                Create Subscription Box
              </Button>
            </div>
          </div>
        </section>

        <div className="container px-4 py-12">
          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Fresh Produce</h3>
                <p className="text-muted-foreground">Harvested and delivered within 24-48 hours</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Home Delivery</h3>
                <p className="text-muted-foreground">Convenient doorstep delivery on schedule</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Fair Prices</h3>
                <p className="text-muted-foreground">Direct from farm, no middlemen markup</p>
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
                
                return (
                  <Card key={box.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Package className="h-20 w-20 text-primary/40" />
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
                        disabled={availableSlots !== null && availableSlots <= 0}
                      >
                        Subscribe Now
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