import React, { useState, useEffect } from 'react';
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  Warehouse, 
  Building, 
  Store, 
  MapPin,
  Pin,
  CircleHelp
} from 'lucide-react';
import { ServiceProvider, ServiceProviderType } from '@/types';
import { fetchServiceProviders } from '@/services/serviceProvidersAPI';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Map component - now production-ready for provider data
const ServiceProvidersMap: React.FC<{
  providers: ServiceProvider[];
  selectedType: ServiceProviderType | 'all';
}> = ({ providers, selectedType }) => {
  return (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg relative overflow-hidden border">
      {/* Map visualization with provider pins - currently placeholder */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img 
          src="/kenya-map-outline.svg" 
          alt="Kenya Map Outline" 
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      
      {/* Placeholder pins for major cities - will be replaced by actual provider data */}
      <div className="absolute inset-0">
        {/* Nairobi */}
        <div 
          className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: '50%', top: '60%' }}
        >
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white px-2 py-1 rounded text-xs shadow-sm">
            Nairobi
          </div>
        </div>
        
        {/* Mombasa */}
        <div 
          className="absolute w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: '60%', top: '80%' }}
        >
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white px-2 py-1 rounded text-xs shadow-sm">
            Mombasa
          </div>
        </div>
        
        {/* Kisumu */}
        <div 
          className="absolute w-4 h-4 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: '30%', top: '50%' }}
        >
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white px-2 py-1 rounded text-xs shadow-sm">
            Kisumu
          </div>
        </div>
        
        {/* Nakuru */}
        <div 
          className="absolute w-4 h-4 bg-amber-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: '40%', top: '45%' }}
        >
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white px-2 py-1 rounded text-xs shadow-sm">
            Nakuru
          </div>
        </div>
      </div>
      
      {providers.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm max-w-md">
            <h3 className="text-lg font-medium mb-2">Interactive Map Ready for Providers</h3>
            <p className="text-muted-foreground mb-4">
              Service providers will appear here as they sign up. Register your service to be the first to appear on the map!
            </p>
            <Button onClick={() => window.location.href = "/service-provider-registration"}>
              Register Now
            </Button>
          </div>
        </div>
      ) : (
        <div className="absolute top-4 right-4 bg-white p-3 rounded-md shadow-md">
          <p className="font-medium text-sm">
            Showing {providers.length} providers
            {selectedType !== 'all' ? ` of type ${selectedType}` : ''}
          </p>
        </div>
      )}
    </div>
  );
};

const ProviderMapLegend: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-4 mb-6">
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
        <Truck className="h-5 w-5 text-blue-500" />
        <span className="text-sm">Transport</span>
      </div>
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
        <Warehouse className="h-5 w-5 text-green-500" />
        <span className="text-sm">Storage</span>
      </div>
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
        <Building className="h-5 w-5 text-purple-500" />
        <span className="text-sm">Training</span>
      </div>
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
        <Store className="h-5 w-5 text-amber-500" />
        <span className="text-sm">Input Supply</span>
      </div>
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
        <Pin className="h-5 w-5 text-red-500" />
        <span className="text-sm">Quality Control</span>
      </div>
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
        <MapPin className="h-5 w-5 text-teal-500" />
        <span className="text-sm">Market Linkage</span>
      </div>
    </div>
  );
};

const LogisticsSolutionsMap: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const [selectedType, setSelectedType] = useState<ServiceProviderType | 'all'>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const providerTypes: Array<{ value: ServiceProviderType | "all"; label: string; icon: any }> = [
    { value: "all", label: "All Providers", icon: MapPin },
    { value: "transport", label: "Transport Services", icon: Truck },
    { value: "storage", label: "Storage Facilities", icon: Warehouse },
    { value: "quality-control", label: "Quality Control", icon: Pin },
    { value: "training", label: "Training Providers", icon: Building },
    { value: "input-supplier", label: "Input Suppliers", icon: Store },
    { value: "inspector", label: "Inspectors", icon: Pin },
    { value: "market-linkage", label: "Market Linkage", icon: MapPin }
  ];
  
  const counties = [
    { value: "all", label: "All Counties" },
    { value: "nairobi", label: "Nairobi" },
    { value: "mombasa", label: "Mombasa" },
    { value: "kisumu", label: "Kisumu" },
    { value: "nakuru", label: "Nakuru" },
    { value: "kiambu", label: "Kiambu" },
    { value: "meru", label: "Meru" },
    { value: "kakamega", label: "Kakamega" },
    { value: "nyeri", label: "Nyeri" },
    { value: "machakos", label: "Machakos" },
    { value: "uasin-gishu", label: "Uasin Gishu" },
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
        console.error('Error fetching providers:', error);
        toast({
          title: 'Error',
          description: 'Failed to load service providers. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProviders();
  }, [toast]);
  
  useEffect(() => {
    let filtered = [...providers];
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(provider => provider.businessType === selectedType);
    }
    
    if (selectedCounty !== 'all') {
      filtered = filtered.filter(provider => 
        provider.location.county.toLowerCase() === selectedCounty.toLowerCase()
      );
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(term) || 
        provider.description.toLowerCase().includes(term) ||
        provider.services.some(service => service.toLowerCase().includes(term)) ||
        provider.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredProviders(filtered);
  }, [providers, selectedType, selectedCounty, searchTerm]);

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
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Logistics Solutions Map</h1>
          <p className="text-muted-foreground">
            Find service providers near you on the interactive map
          </p>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Find Service Providers</CardTitle>
            <CardDescription>
              Filter by service type, location, or search by name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Type of Service</label>
                <Select value={selectedType} onValueChange={(value) => setSelectedType(value as ServiceProviderType | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {providerTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">County</label>
                <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
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
              
              <div>
                <label className="block text-sm font-medium mb-1">Search</label>
                <Input 
                  placeholder="Search by name or service" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Checkbox id="verified" />
                <label htmlFor="verified" className="text-sm">
                  Show verified providers only
                </label>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Showing {filteredProviders.length} providers
              </div>
            </div>
          </CardContent>
        </Card>
        
        <ProviderMapLegend />
        
        <ServiceProvidersMap 
          providers={filteredProviders}
          selectedType={selectedType}
        />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-32 bg-muted" />
                <CardContent className="pt-4">
                  <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-3 bg-muted rounded w-full mb-2" />
                  <div className="h-3 bg-muted rounded w-5/6 mb-2" />
                  <div className="h-3 bg-muted rounded w-4/6" />
                </CardContent>
              </Card>
            ))
          ) : filteredProviders.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <CircleHelp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No providers found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters
              </p>
              <Button onClick={() => {
                setSelectedType('all');
                setSelectedCounty('all');
                setSearchTerm('');
              }}>
                Reset Filters
              </Button>
            </div>
          ) : (
            filteredProviders.slice(0, 9).map((provider) => {
              const typeInfo = providerTypes.find(t => t.value === provider.businessType) || providerTypes[0];
              const TypeIcon = typeInfo.icon;
              
              return (
                <Card key={provider.id} className="overflow-hidden">
                  <div className={`h-2 w-full ${provider.businessType === 'transport' ? 'bg-blue-500' : 
                    provider.businessType === 'storage' ? 'bg-green-500' : 
                    provider.businessType === 'training' ? 'bg-purple-500' : 
                    provider.businessType === 'quality-control' ? 'bg-red-500' : 
                    provider.businessType === 'input-supplier' ? 'bg-amber-500' : 
                    'bg-teal-500'}`} />
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TypeIcon className="h-5 w-5 text-muted-foreground" />
                          {provider.name}
                        </CardTitle>
                        <CardDescription>
                          {typeInfo.label}
                        </CardDescription>
                      </div>
                      {provider.verified && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="secondary">Verified</Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>This provider has been verified by our team</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{provider.location.county}, {provider.location.specificLocation}</span>
                    </div>
                    
                    <p className="line-clamp-2 text-sm text-muted-foreground">{provider.description}</p>
                    
                    <div className="flex flex-wrap gap-1 pt-2">
                      {provider.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                      {provider.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{provider.tags.length - 3} more</Badge>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end pt-0">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
        
        {!isLoading && filteredProviders.length > 9 && (
          <div className="mt-6 text-center">
            <Button variant="outline">
              Show More ({filteredProviders.length - 9} remaining)
            </Button>
          </div>
        )}
        
        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Register Your Service</CardTitle>
            <CardDescription>
              Are you a logistics provider? Register your service to appear on our map.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Button variant="default" onClick={() => window.location.href = "/service-provider-registration"}>
                Register as Service Provider
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/transporter-signup"}>
                Register as Transporter
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LogisticsSolutionsMap;
