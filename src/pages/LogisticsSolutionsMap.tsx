import React, { useState, useEffect, Suspense, lazy } from 'react';
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ServiceProvider, ServiceProviderType } from '@/types';
import { fetchServiceProviders } from '@/services/serviceProvidersAPI';
import { Loader2 } from 'lucide-react';

// Lazy load the map component to avoid SSR issues with Leaflet
const ServiceProvidersMap = lazy(() => import('@/components/logistics/ServiceProvidersMap'));

// Import other components normally
import MapLegend from '@/components/logistics/MapLegend';
import ProviderFilters from '@/components/logistics/ProviderFilters';
import ProvidersList from '@/components/logistics/ProvidersList';
import RegistrationPrompt from '@/components/logistics/RegistrationPrompt';

// Simple error boundary for the map
class MapErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Map Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-[400px] rounded-lg border bg-muted flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-muted-foreground mb-2">Unable to load map</p>
            <Button 
              variant="outline" 
              onClick={() => this.setState({ hasError: false })}
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const LogisticsSolutionsMap: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const [selectedType, setSelectedType] = useState<ServiceProviderType | 'all'>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
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

  const resetFilters = () => {
    setSelectedType('all');
    setSelectedCounty('all');
    setSearchTerm('');
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
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Logistics Solutions Map</h1>
          <p className="text-muted-foreground">
            Find service providers near you on the interactive map
          </p>
        </div>
        
        <ProviderFilters 
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedCounty={selectedCounty}
          setSelectedCounty={setSelectedCounty}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredProvidersCount={filteredProviders.length}
        />
        
        <MapLegend />
        
        <MapErrorBoundary>
          <Suspense fallback={
            <div className="w-full h-[500px] rounded-lg border bg-muted flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          }>
            <ServiceProvidersMap 
              providers={filteredProviders}
              selectedType={selectedType}
            />
          </Suspense>
        </MapErrorBoundary>
        
        <ProvidersList 
          providers={filteredProviders}
          isLoading={isLoading}
          resetFilters={resetFilters}
        />
        
        {!isLoading && filteredProviders.length > 9 && (
          <div className="mt-6 text-center">
            <Button variant="outline">
              Show More ({filteredProviders.length - 9} remaining)
            </Button>
          </div>
        )}
        
        <RegistrationPrompt />
      </main>
    </div>
  );
};

export default LogisticsSolutionsMap;
