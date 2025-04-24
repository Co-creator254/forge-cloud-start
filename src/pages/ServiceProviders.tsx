
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ServiceProvider, ServiceProviderType } from "@/types";
import { fetchServiceProviders } from "@/services/serviceProvidersAPI";
import { useToast } from "@/hooks/use-toast";
import { ProviderHeader } from "@/components/service-providers/ProviderHeader";
import { ProviderFilters } from "@/components/service-providers/ProviderFilters";
import { ProviderCard } from "@/components/service-providers/ProviderCard";
import { ProviderTabs } from "@/components/service-providers/ProviderTabs";
import { TrainingEventsSection } from "@/components/service-providers/TrainingEventsSection";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";

const ServiceProviders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ServiceProviderType | "all">("all");
  const [selectedCounty, setSelectedCounty] = useState<string>("all");
  
  const typeFilter = searchParams.get("type") as ServiceProviderType | null;
  const activeTab = (typeFilter || "all") as ServiceProviderType | "all";

  const providerTypes: Array<{ value: ServiceProviderType | "all"; label: string }> = [
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
    
    if (selectedType !== "all") {
      filtered = filtered.filter(provider => provider.businessType === selectedType);
    }
    
    if (selectedCounty !== "all") {
      filtered = filtered.filter(provider => provider.location.county.toLowerCase() === selectedCounty.toLowerCase());
    }
    
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
        <ProviderHeader />

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="mb-8">
          <ProviderTabs 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            providerTypes={providerTypes}
          />
        </Tabs>

        <ProviderFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedCounty={selectedCounty}
          setSelectedCounty={setSelectedCounty}
          filteredCount={filteredProviders.length}
          counties={counties}
          providerTypes={providerTypes}
        />

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
            <Button onClick={() => navigate("/service-provider-registration")}>
              Register as a Provider
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <ProviderCard 
                key={provider.id} 
                provider={provider}
                providerTypes={providerTypes}
              />
            ))}
          </div>
        )}

        <TrainingEventsSection />
      </main>
    </div>
  );
};

export default ServiceProviders;
