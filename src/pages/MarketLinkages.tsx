
import { useState, useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Users, Link, CheckCheck } from "lucide-react";
import { MarketLinkage } from "@/types";
import { fetchMarketLinkages } from "@/services/serviceProvidersAPI";
import { useToast } from "@/hooks/use-toast";

const MarketLinkages = () => {
  const { toast } = useToast();
  const [linkages, setLinkages] = useState<MarketLinkage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"vertical" | "horizontal" | "all">("all");
  
  useEffect(() => {
    const loadLinkages = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMarketLinkages();
        setLinkages(data);
      } catch (error) {
        console.error("Error fetching market linkages:", error);
        toast({
          title: "Error",
          description: "Failed to load market linkages. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLinkages();
  }, [toast]);

  const filteredLinkages = linkages.filter(linkage => {
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      linkage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      linkage.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      linkage.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      linkage.crops.some(crop => crop.toLowerCase().includes(searchTerm.toLowerCase())) ||
      linkage.markets.some(market => market.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by tab
    if (activeTab === "vertical") {
      return matchesSearch && linkage.type === "vertical";
    } else if (activeTab === "horizontal") {
      return matchesSearch && linkage.type === "horizontal";
    }
    
    return matchesSearch;
  });

  return (
    <div className="flex min-h-screen flex-col">
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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Market Linkages</h1>
            <p className="text-muted-foreground mt-2">
              Connect with vertical and horizontal market linkage opportunities
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>Register New Market Linkage</Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Understanding Market Linkages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <div className="mt-0.5">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Vertical Linkages</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect farmers to buyers further up the value chain such as processors, exporters, and retailers.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="mt-0.5">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Horizontal Linkages</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect farmers to other farmers or farmer groups for collective action, shared resources, and increased bargaining power.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as "vertical" | "horizontal" | "all")} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Linkages</TabsTrigger>
            <TabsTrigger value="vertical">Vertical Linkages</TabsTrigger>
            <TabsTrigger value="horizontal">Horizontal Linkages</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mb-8">
          <Input
            placeholder="Search by name, crops, markets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-2/3 lg:w-1/2"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <Card key={n} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-5 bg-muted rounded w-1/4"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredLinkages.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Link className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No market linkages found</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              No market linkages match your search criteria. Try different keywords or view all linkages.
            </p>
            {activeTab !== "all" && (
              <Button variant="outline" onClick={() => setActiveTab("all")}>
                View All Linkages
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLinkages.map((linkage) => (
              <Card key={linkage.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{linkage.name}</CardTitle>
                      <CardDescription>{linkage.providerName}</CardDescription>
                    </div>
                    <Badge variant={linkage.type === "vertical" ? "default" : "secondary"}>
                      {linkage.type === "vertical" ? "Vertical" : "Horizontal"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{linkage.description}</p>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Markets:</h4>
                    <div className="flex flex-wrap gap-1">
                      {linkage.markets.map(market => (
                        <Badge key={market} variant="outline">{market}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Crops:</h4>
                    <div className="flex flex-wrap gap-1">
                      {linkage.crops.map(crop => (
                        <Badge key={crop} variant="outline">{crop}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Requirements:</h4>
                    <p className="text-sm text-muted-foreground">{linkage.requirements}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Benefits:</h4>
                    <p className="text-sm text-muted-foreground">{linkage.benefits}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Contact: {linkage.contactInfo}
                  </div>
                  <Button size="sm">
                    <Link className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">From Individual Farmer to Export Group</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "As a small-scale avocado farmer, I struggled to access export markets due to volume requirements. 
                  After joining the Avocado Export Cooperative, I now sell my produce at premium prices and have 
                  received training on GlobalGAP certification."
                </p>
                <div className="flex mt-4">
                  <Badge variant="outline">30% higher income</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm">- John Mwangi, Muranga County</div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Collective Input Purchasing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "By joining the Meru Potato Farmers Association, our group of 15 small-scale farmers now purchases 
                  inputs in bulk. We've reduced our costs by 20% and gained access to certified seeds that were 
                  previously unavailable to us individually."
                </p>
                <div className="flex mt-4">
                  <Badge variant="outline">20% cost reduction</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm">- Mary Nkatha, Meru County</div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Supermarket Direct Supply Chain</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  "Through the Fresh Produce Vertical Linkage program, our cooperative now supplies vegetables directly 
                  to three major supermarket chains. We've eliminated middlemen and increased our profits while 
                  ensuring consistent market access."
                </p>
                <div className="flex mt-4">
                  <Badge variant="outline">Stable pricing</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm">- David Ochieng, Kisumu County</div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketLinkages;
