import { useState, useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Package, TrendingUp, Award, Calendar, MapPin, DollarSign, FileText, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ExportOpportunity {
  id: string;
  buyer_company: string;
  buyer_country: string;
  commodity: string;
  variety?: string;
  quantity: number;
  unit: string;
  target_price?: number;
  currency: string;
  delivery_terms: string;
  payment_terms: string;
  required_certifications: string[];
  quality_standards: string;
  delivery_deadline: string;
  application_deadline: string;
  port_of_destination: string;
  description?: string;
  status: string;
  view_count: number;
  application_count: number;
  created_at: string;
}

const ExportOpportunitiesNew = () => {
  const { toast } = useToast();
  const [opportunities, setOpportunities] = useState<ExportOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterCommodity, setFilterCommodity] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('export_opportunities')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching export opportunities:', error);
      toast({
        title: "Error",
        description: "Failed to load export opportunities.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const countries = Array.from(new Set(opportunities.map(o => o.buyer_country)));
  const commodities = Array.from(new Set(opportunities.map(o => o.commodity)));

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = searchTerm === "" || 
      opp.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.buyer_company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = filterCountry === "all" || opp.buyer_country === filterCountry;
    const matchesCommodity = filterCommodity === "all" || opp.commodity === filterCommodity;
    
    return matchesSearch && matchesCountry && matchesCommodity;
  });

  const getDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
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
              <Globe className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Export Opportunities</h1>
              <p className="text-xl mb-8">
                Connect with international buyers and export your produce globally
              </p>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Export Opportunity
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Post Export Opportunity</DialogTitle>
                    <DialogDescription>
                      Create a new export opportunity for farmers to apply
                    </DialogDescription>
                  </DialogHeader>
                  <div className="text-muted-foreground py-8 text-center">
                    <p>Form component would go here with all export opportunity fields</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        <div className="container px-4 py-12">
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">{opportunities.length}</div>
                <p className="text-sm text-muted-foreground">Active Opportunities</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">{countries.length}</div>
                <p className="text-sm text-muted-foreground">Countries</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">{commodities.length}</div>
                <p className="text-sm text-muted-foreground">Commodities</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">$2.5M+</div>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCountry} onValueChange={setFilterCountry}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCommodity} onValueChange={setFilterCommodity}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Commodities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Commodities</SelectItem>
                {commodities.map(commodity => (
                  <SelectItem key={commodity} value={commodity}>{commodity}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Opportunities List */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Card key={n} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No opportunities found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or check back later for new opportunities.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opp) => {
                const appDaysLeft = getDaysRemaining(opp.application_deadline);
                
                return (
                  <Card key={opp.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-1">{opp.commodity}</CardTitle>
                          {opp.variety && (
                            <p className="text-sm text-muted-foreground">{opp.variety}</p>
                          )}
                        </div>
                        <Badge variant={appDaysLeft > 7 ? "secondary" : "destructive"}>
                          {appDaysLeft}d left
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-1">
                        {opp.buyer_company}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{opp.buyer_country}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{opp.quantity.toLocaleString()} {opp.unit}</span>
                      </div>
                      
                      {opp.target_price && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate font-semibold">
                            {opp.currency} {opp.target_price.toLocaleString()}/{opp.unit}
                          </span>
                        </div>
                      )}
                      
                      {opp.required_certifications.length > 0 && (
                        <div className="flex items-start gap-2 text-sm">
                          <Award className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div className="flex flex-wrap gap-1">
                            {opp.required_certifications.slice(0, 2).map((cert, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                            {opp.required_certifications.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{opp.required_certifications.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">Apply by: {new Date(opp.application_deadline).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1">
                        Apply Now
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}

          {/* How It Works */}
          <section className="mt-16 bg-muted/30 rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">How Export Opportunities Work</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Simple steps to access global markets
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Browse Opportunities</h3>
                <p className="text-muted-foreground text-sm">Find export opportunities matching your produce</p>
              </div>
              <div className="text-center">
                <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Submit Application</h3>
                <p className="text-muted-foreground text-sm">Apply with your production details and certifications</p>
              </div>
              <div className="text-center">
                <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Get Selected</h3>
                <p className="text-muted-foreground text-sm">Buyer reviews and selects suppliers</p>
              </div>
              <div className="text-center">
                <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Export & Earn</h3>
                <p className="text-muted-foreground text-sm">Fulfill order and receive payment</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default ExportOpportunitiesNew;