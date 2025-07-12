
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Phone, Star, Filter, Truck, Warehouse, Users, Package } from 'lucide-react';
import { getLogisticsStats, getLogisticsProviders, getWarehouses } from '@/services/logisticsService';
import LogisticsStatsCard from '@/components/LogisticsStatsCard';

interface LogisticsStats {
  activeTransporters: number;
  storageFacilities: number;
  countiesCovered: number;
  monthlyDeliveries: number;
}

const Logistics: React.FC = () => {
  const [stats, setStats] = useState<LogisticsStats>({
    activeTransporters: 0,
    storageFacilities: 0,
    countiesCovered: 0,
    monthlyDeliveries: 0
  });
  const [transportProviders, setTransportProviders] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching logistics data...');
        
        const [statsData, transportData, warehouseData] = await Promise.all([
          getLogisticsStats(),
          getLogisticsProviders(),
          getWarehouses()
        ]);

        console.log('Stats data:', statsData);
        console.log('Transport data:', transportData);
        console.log('Warehouse data:', warehouseData);

        setStats(statsData);
        setTransportProviders(transportData);
        setWarehouses(warehouseData);
      } catch (error) {
        console.error('Error fetching logistics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
    'Kiambu', 'Machakos', 'Meru', 'Embu', 'Nyeri', 'Muranga'
  ];

  const filteredTransportProviders = transportProviders.filter(provider => {
    const matchesSearch = provider.provider_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCounty = !selectedCounty || provider.counties_served?.includes(selectedCounty);
    const matchesService = !selectedServiceType || provider.provider_type === selectedServiceType;
    return matchesSearch && matchesCounty && matchesService;
  });

  const filteredWarehouses = warehouses.filter(warehouse => {
    const matchesSearch = warehouse.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCounty = !selectedCounty || warehouse.county === selectedCounty;
    return matchesSearch && matchesCounty;
  });

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-lg">Loading logistics data from database...</div>
            <div className="text-sm text-muted-foreground mt-2">Fetching real providers and facilities</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Smart Logistics Network</h1>
          <p className="text-lg text-muted-foreground">
            Connect with verified transport providers, storage facilities, and logistics solutions across Kenya
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <LogisticsStatsCard
            label="Active Providers"
            value={stats.activeTransporters}
            icon={<Truck className="h-5 w-5 text-primary" />}
          />
          <LogisticsStatsCard
            label="Storage Facilities"
            value={stats.storageFacilities}
            icon={<Package className="h-5 w-5 text-primary" />}
          />
          <LogisticsStatsCard
            label="Counties Covered"
            value={stats.countiesCovered}
            icon={<Star className="h-5 w-5 text-primary" />}
          />
          <LogisticsStatsCard
            label="Monthly Deliveries"
            value={stats.monthlyDeliveries}
            icon={<Users className="h-5 w-5 text-primary" />}
          />
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select County" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Counties</SelectItem>
                  {counties.map((county) => (
                    <SelectItem key={county} value={county}>
                      {county}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Services</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                  <SelectItem value="cold_chain">Cold Chain</SelectItem>
                  <SelectItem value="packaging">Packaging</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setSelectedCounty('');
                setSelectedServiceType('');
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="transport" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transport">Transport Providers</TabsTrigger>
            <TabsTrigger value="storage">Storage Facilities</TabsTrigger>
          </TabsList>

          <TabsContent value="transport" className="space-y-6">
            <div className="grid gap-6">
              {filteredTransportProviders.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Transport Providers Found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || selectedCounty || selectedServiceType 
                        ? 'Try adjusting your filters to see more results.'
                        : 'Transport providers will appear here once they register on the platform.'
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredTransportProviders.map((provider) => (
                  <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            {provider.provider_name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {provider.counties_served?.join(', ') || provider.location}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-sm">{provider.rating || '4.5'}</span>
                          </div>
                          <Badge variant="secondary">{provider.provider_type}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Capacity</h4>
                          <p className="text-sm text-muted-foreground">{provider.max_capacity_tons} tons</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Fleet Size</h4>
                          <p className="text-sm text-muted-foreground">{provider.fleet_size} vehicles</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Refrigeration</h4>
                          <Badge variant={provider.has_refrigeration ? "default" : "secondary"}>
                            {provider.has_refrigeration ? "Available" : "Not Available"}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span className="text-sm">{provider.contact_phone}</span>
                          </div>
                          <Button size="sm">
                            Book Transport
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="storage" className="space-y-6">
            <div className="grid gap-6">
              {filteredWarehouses.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Warehouse className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Storage Facilities Found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || selectedCounty 
                        ? 'Try adjusting your filters to see more results.'
                        : 'Storage facilities will appear here once they register on the platform.'
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredWarehouses.map((warehouse) => (
                  <Card key={warehouse.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Warehouse className="h-5 w-5" />
                            {warehouse.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {warehouse.location || warehouse.county}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-sm">4.3</span>
                          </div>
                          <Badge variant="secondary">Storage</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Capacity</h4>
                          <p className="text-sm text-muted-foreground">{warehouse.capacity_tons} tons</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Storage Type</h4>
                          <p className="text-sm text-muted-foreground">
                            {warehouse.storage_type?.join(', ') || 'General Storage'}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Refrigeration</h4>
                          <Badge variant={warehouse.temperature_controlled ? "default" : "secondary"}>
                            {warehouse.temperature_controlled ? "Available" : "Not Available"}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span className="text-sm">{warehouse.contact_phone}</span>
                          </div>
                          <Button size="sm">
                            Book Storage
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Logistics;
