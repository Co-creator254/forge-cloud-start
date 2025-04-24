import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Star, ExternalLink, Calendar, Users, Tag } from "lucide-react";
import { ServiceProvider, ServiceProviderType } from "@/types";
import { fetchServiceProviders } from "@/services/serviceProvidersAPI";
import { useToast } from "@/hooks/use-toast";

const ServiceProviders = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ServiceProviderType | "all">("all");
  const [selectedCounty, setSelectedCounty] = useState<string>("all");
  
  const typeFilter = searchParams.get("type") as ServiceProviderType | null;
  const activeTab = (typeFilter || "all") as ServiceProviderType | "all";

  const providerTypes: { value: ServiceProviderType | "all"; label: string }[] = [
    { value: "all", label: "All Providers" },
    { value: "storage", label: "Storage Facilities" },
    { value: "transport", label: "Transport Services" },
    { value: "quality-control", label: "Quality Control" },
    { value: "training", label: "Training Providers" },
    { value: "input-supplier", label: "Input Suppliers" },
    { value: "inspector", label: "Inspectors" },
    { value: "market-linkage", label: "Market Linkage" }
  ];

  const counties = [
    { value: "all", label: "All Counties" },
    { value: "nairobi", label: "Nairobi" },
    { value: "mombasa", label: "Mombasa" },
    { value: "kisumu", label: "Kisumu" },
    { value: "nakuru", label: "Nakuru" },
    { value: "kiambu", label: "Kiambu" },
    { value: "machakos", label: "Machakos" },
    { value: "meru", label: "Meru" },
    { value: "kakamega", label: "Kakamega" },
    { value: "uasin-gishu", label: "Uasin Gishu" },
    { value: "nyeri", label: "Nyeri" },
    { value: "kilifi", label: "Kilifi" }
  ];

  useEffect(() => {
    const loadProviders = async () => {
      try {
        setIsLoading(true);
        const data = await fetchServiceProviders();
        setProviders(data);
        setFilteredProviders(data);
      } catch (error) {
        console.error("Error fetching service providers:", error);
        toast({
          title: "Error",
          description: "Failed to load service providers. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProviders();
  }, [toast]);

  useEffect(() => {
    let filtered = [...providers];
    
    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(provider => provider.businessType === selectedType);
    }
    
    // Filter by county
    if (selectedCounty !== "all") {
      filtered = filtered.filter(provider => provider.location.county.toLowerCase() === selectedCounty.toLowerCase());
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        provider => 
          provider.name.toLowerCase().includes(term) || 
          provider.description.toLowerCase().includes(term) ||
          provider.services.some(service => service.toLowerCase().includes(term)) ||
          provider.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredProviders(filtered);
  }, [providers, selectedType, selectedCounty, searchTerm]);

  const handleTabChange = (value: string) => {
    if (value === "all") {
      searchParams.delete("type");
    } else {
      searchParams.set("type", value);
    }
    setSearchParams(searchParams);
    setSelectedType(value as ServiceProviderType | "all");
  };

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
            <h1 className="text-3xl font-bold tracking-tight">Service Providers Directory</h1>
            <p className="text-muted-foreground mt-2">
              Find and connect with agricultural service providers across Kenya
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => navigate("/service-provider-registration")}>Register as a Provider</Button>
          </div>
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="mb-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 h-auto">
            {providerTypes.map((type) => (
              <TabsTrigger key={type.value} value={type.value} className="text-xs md:text-sm">
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="relative">
            <Input
              placeholder="Search by name, service or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Select
              value={selectedCounty}
              onValueChange={(value) => setSelectedCounty(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by county" />
              </SelectTrigger>
              <SelectContent>
                {counties.map((county) => (
                  <SelectItem key={county.value} value={county.value}>
                    {county.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-end">
            <span className="text-sm text-muted-foreground mr-2">
              {filteredProviders.length} providers found
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card key={n} className="animate-pulse">
                <CardHeader className="h-32 bg-muted"></CardHeader>
                <CardContent className="pt-4">
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted rounded w-5/6 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-4/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Tag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No providers found</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Try adjusting your search or filters, or register as a new provider.
            </p>
            <Button onClick={() => navigate("/service-provider-registration")}>Register as a Provider</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <Card key={provider.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                      <CardDescription>
                        {providerTypes.find(t => t.value === provider.businessType)?.label}
                      </CardDescription>
                    </div>
                    {provider.verified && (
                      <Badge variant="secondary">Verified</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="line-clamp-2 text-sm text-muted-foreground">{provider.description}</p>
                  
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{provider.location.county}, {provider.location.specificLocation}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="line-clamp-1">{provider.contactInfo}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                      <span className="ml-1 mr-1 font-medium">{provider.rating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">({provider.reviewCount})</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {provider.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  {provider.website && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={provider.website} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Website
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Recent Training Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <Card key={n}>
                <CardHeader>
                  <CardTitle className="text-lg">Advanced Potato Farming Techniques</CardTitle>
                  <CardDescription>AgriTrain Kenya</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">Learn advanced techniques for potato cultivation including disease management and optimal fertilization</p>
                  
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>May 15, 2025</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Meru Agricultural Training Center</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>18/30 registered</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Badge>KSh 2,500</Badge>
                  <Button size="sm" onClick={() => navigate("/training-events")}>Register</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => navigate("/training-events")}>View All Events</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceProviders;
