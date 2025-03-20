
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarIcon, TruckIcon, Warehouse as WarehouseIcon, Check, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { TransportRequest, WarehouseBooking, TransportProvider, Warehouse } from '@/types';
import { fetchWarehouses, fetchTransportProviders } from '@/services/kilimoAPI';
import WarehouseMap from '@/components/WarehouseMap';

const MyTradesView: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('purchases');
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestingTransport, setIsRequestingTransport] = useState(false);
  const [isBookingWarehouse, setIsBookingWarehouse] = useState(false);
  const [date, setDate] = useState<Date>();
  const [transportRequests, setTransportRequests] = useState<TransportRequest[]>([]);
  const [warehouseBookings, setWarehouseBookings] = useState<WarehouseBooking[]>([]);
  const [transportProviders, setTransportProviders] = useState<TransportProvider[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [showWarehouseMap, setShowWarehouseMap] = useState(false);
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load transport providers
        const providers = await fetchTransportProviders();
        setTransportProviders(providers);
        
        // Load warehouses
        const warehouseData = await fetchWarehouses();
        setWarehouses(warehouseData);
        
        // Sample transport requests data
        setTransportRequests([
          {
            id: 'TR001',
            farmerId: 'F001',
            farmerName: 'John Farmer',
            origin: 'Nakuru County',
            destination: 'Nairobi County',
            produceType: 'Potatoes',
            quantity: 2000,
            unit: 'kg',
            requiredDate: '2024-04-10',
            hasSpecialRequirements: false,
            status: 'pending',
            created: '2024-03-15T09:30:00Z',
          },
          {
            id: 'TR002',
            farmerId: 'F001',
            farmerName: 'John Farmer',
            origin: 'Nakuru County',
            destination: 'Eldoret County',
            produceType: 'Maize',
            quantity: 5000,
            unit: 'kg',
            requiredDate: '2024-04-15',
            hasSpecialRequirements: true,
            specialRequirements: 'Need covered truck due to rainy season',
            status: 'accepted',
            created: '2024-03-18T14:20:00Z',
            transporterId: 'TP003',
            transporterName: 'Fast Movers Logistics'
          }
        ]);
        
        // Sample warehouse bookings data
        setWarehouseBookings([
          {
            id: 'WB001',
            userId: 'F001',
            userName: 'John Farmer',
            warehouseId: 'WH002',
            warehouseName: 'Nakuru Cold Storage',
            produceType: 'Potatoes',
            quantity: 2000,
            unit: 'kg',
            startDate: '2024-04-10',
            endDate: '2024-05-10',
            requiresRefrigeration: true,
            status: 'confirmed',
            created: '2024-03-20T10:15:00Z'
          }
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleRequestTransport = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: TransportRequest = {
      id: `TR${(transportRequests.length + 1).toString().padStart(3, '0')}`,
      farmerId: 'F001',
      farmerName: 'John Farmer',
      origin: 'Nakuru County',
      destination: 'Nairobi County',
      produceType: 'Tomatoes',
      quantity: 1500,
      unit: 'kg',
      requiredDate: date ? format(date, 'yyyy-MM-dd') : '2024-04-20',
      hasSpecialRequirements: false,
      status: 'pending',
      created: new Date().toISOString()
    };
    
    setTransportRequests([...transportRequests, newRequest]);
    
    toast({
      title: 'Transport Requested',
      description: 'Your transport request has been submitted and transporters will be notified.',
    });
    
    setIsRequestingTransport(false);
  };
  
  const handleBookWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBooking: WarehouseBooking = {
      id: `WB${(warehouseBookings.length + 1).toString().padStart(3, '0')}`,
      userId: 'F001',
      userName: 'John Farmer',
      warehouseId: 'WH001',
      warehouseName: 'Nairobi Central Storage',
      produceType: 'Maize',
      quantity: 3000,
      unit: 'kg',
      startDate: date ? format(date, 'yyyy-MM-dd') : '2024-04-25',
      endDate: '2024-05-25',
      requiresRefrigeration: false,
      status: 'pending',
      created: new Date().toISOString()
    };
    
    setWarehouseBookings([...warehouseBookings, newBooking]);
    
    toast({
      title: 'Warehouse Booking',
      description: 'Your warehouse booking request has been submitted.',
    });
    
    setIsBookingWarehouse(false);
  };
  
  // Find matching transporters for the first transport request
  const findMatchingTransporters = () => {
    if (transportRequests.length === 0 || transportProviders.length === 0) return [];
    
    const request = transportRequests[0];
    
    return transportProviders
      .filter(provider => 
        provider.counties.includes(request.origin.split(' ')[0]) || 
        provider.counties.includes(request.destination.split(' ')[0])
      )
      .slice(0, 3); // Limit to 3 matches
  };
  
  const matchingTransporters = findMatchingTransporters();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Trades & Logistics</h1>
            <p className="text-muted-foreground">
              Manage your purchases, sales, transport, and storage
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Button onClick={() => setIsRequestingTransport(true)}>
              <TruckIcon className="h-4 w-4 mr-2" />
              Request Transport
            </Button>
            <Button variant="outline" onClick={() => setIsBookingWarehouse(true)}>
              <WarehouseIcon className="h-4 w-4 mr-2" />
              Book Warehouse
            </Button>
            <Button variant="secondary" onClick={() => setShowWarehouseMap(true)}>
              Find Warehouses
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="transport">Transport</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="purchases">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Purchases</CardTitle>
                  <CardDescription>
                    Track and manage your agricultural commodity purchases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No purchase transactions yet</p>
                      <Button className="mt-4">Browse Marketplace</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sales">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Sales</CardTitle>
                  <CardDescription>
                    Track and manage your agricultural commodity sales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No sales transactions yet</p>
                      <Button className="mt-4">List Produce for Sale</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="transport">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transport Requests</CardTitle>
                  <CardDescription>
                    Manage your transport requests and bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : transportRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-sm text-muted-foreground border-b">
                            <th className="text-left p-2">ID</th>
                            <th className="text-left p-2">From</th>
                            <th className="text-left p-2">To</th>
                            <th className="text-left p-2">Produce</th>
                            <th className="text-left p-2">Quantity</th>
                            <th className="text-left p-2">Date Needed</th>
                            <th className="text-center p-2">Status</th>
                            <th className="text-right p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transportRequests.map(request => (
                            <tr key={request.id} className="border-b hover:bg-muted/50">
                              <td className="p-2 font-medium">{request.id}</td>
                              <td className="p-2">{request.origin}</td>
                              <td className="p-2">{request.destination}</td>
                              <td className="p-2">{request.produceType}</td>
                              <td className="p-2">{request.quantity} {request.unit}</td>
                              <td className="p-2">{request.requiredDate}</td>
                              <td className="p-2 text-center">
                                <Badge variant={request.status === 'pending' ? 'outline' : 'default'}>
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </Badge>
                              </td>
                              <td className="p-2 text-right">
                                <Button variant="ghost" size="sm">Details</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No transport requests yet</p>
                      <Button onClick={() => setIsRequestingTransport(true)} className="mt-4">
                        Request Transport
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {matchingTransporters.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Matching Transport Providers</CardTitle>
                    <CardDescription>
                      These transport providers match your recent request
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {matchingTransporters.map(transporter => (
                        <Card key={transporter.id}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{transporter.name}</CardTitle>
                            <CardDescription>
                              {transporter.counties.join(', ')}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium">Vehicle:</span> {transporter.vehicleType}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Capacity:</span> {transporter.capacity}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Rates:</span> {transporter.rates}
                            </div>
                            {transporter.hasRefrigeration && (
                              <div className="text-sm text-blue-600 dark:text-blue-400">
                                ✓ Refrigerated transport available
                              </div>
                            )}
                          </CardContent>
                          <CardFooter>
                            <Button size="sm" className="w-full">Contact Provider</Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="storage">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Warehouse Bookings</CardTitle>
                  <CardDescription>
                    Manage your warehouse and storage bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : warehouseBookings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-sm text-muted-foreground border-b">
                            <th className="text-left p-2">ID</th>
                            <th className="text-left p-2">Warehouse</th>
                            <th className="text-left p-2">Produce</th>
                            <th className="text-left p-2">Quantity</th>
                            <th className="text-left p-2">From</th>
                            <th className="text-left p-2">To</th>
                            <th className="text-center p-2">Status</th>
                            <th className="text-right p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {warehouseBookings.map(booking => (
                            <tr key={booking.id} className="border-b hover:bg-muted/50">
                              <td className="p-2 font-medium">{booking.id}</td>
                              <td className="p-2">{booking.warehouseName}</td>
                              <td className="p-2">{booking.produceType}</td>
                              <td className="p-2">{booking.quantity} {booking.unit}</td>
                              <td className="p-2">{booking.startDate}</td>
                              <td className="p-2">{booking.endDate}</td>
                              <td className="p-2 text-center">
                                <Badge variant={booking.status === 'pending' ? 'outline' : 'default'}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                              </td>
                              <td className="p-2 text-right">
                                <Button variant="ghost" size="sm">Details</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No warehouse bookings yet</p>
                      <Button onClick={() => setIsBookingWarehouse(true)} className="mt-4">
                        Book Warehouse
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {showWarehouseMap && (
                <WarehouseMap />
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Transport Request Modal */}
        {isRequestingTransport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-xl">
              <CardHeader>
                <CardTitle>Request Transport</CardTitle>
                <CardDescription>
                  Request transportation for your agricultural products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRequestTransport} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="origin">Origin (Pickup Location)</Label>
                      <Input id="origin" placeholder="Enter origin location" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination</Label>
                      <Input id="destination" placeholder="Enter destination" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="produceType">Produce Type</Label>
                      <Select>
                        <SelectTrigger id="produceType">
                          <SelectValue placeholder="Select produce type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maize">Maize</SelectItem>
                          <SelectItem value="potatoes">Potatoes</SelectItem>
                          <SelectItem value="tomatoes">Tomatoes</SelectItem>
                          <SelectItem value="beans">Beans</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <div className="flex">
                        <Input id="quantity" placeholder="Enter quantity" type="number" min="1" required />
                        <Select>
                          <SelectTrigger className="w-[110px] ml-2">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">Kilograms</SelectItem>
                            <SelectItem value="tons">Tons</SelectItem>
                            <SelectItem value="bags">Bags</SelectItem>
                            <SelectItem value="crates">Crates</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date Needed</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Select a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleType">Vehicle Type</Label>
                      <Select>
                        <SelectTrigger id="vehicleType">
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="pickup">Pickup</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="truck-small">Truck (3-5 tons)</SelectItem>
                          <SelectItem value="truck-medium">Truck (5-10 tons)</SelectItem>
                          <SelectItem value="truck-large">Heavy Truck (10+ tons)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="refrigeration" />
                      <label htmlFor="refrigeration" className="text-sm">
                        Requires refrigeration
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialRequirements">Special Requirements</Label>
                    <Textarea 
                      id="specialRequirements" 
                      placeholder="Any special handling instructions or requirements"
                      rows={3}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsRequestingTransport(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRequestTransport}>
                  Submit Request
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        
        {/* Warehouse Booking Modal */}
        {isBookingWarehouse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-xl">
              <CardHeader>
                <CardTitle>Book Warehouse</CardTitle>
                <CardDescription>
                  Book storage space for your agricultural products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBookWarehouse} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="warehouse">Warehouse</Label>
                      <Select>
                        <SelectTrigger id="warehouse">
                          <SelectValue placeholder="Select warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                          {warehouses.map(warehouse => (
                            <SelectItem key={warehouse.id} value={warehouse.id}>
                              {warehouse.name} ({warehouse.county})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="produceType">Produce Type</Label>
                      <Select>
                        <SelectTrigger id="produceType">
                          <SelectValue placeholder="Select produce type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maize">Maize</SelectItem>
                          <SelectItem value="potatoes">Potatoes</SelectItem>
                          <SelectItem value="tomatoes">Tomatoes</SelectItem>
                          <SelectItem value="beans">Beans</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <div className="flex">
                        <Input id="quantity" placeholder="Enter quantity" type="number" min="1" required />
                        <Select>
                          <SelectTrigger className="w-[110px] ml-2">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">Kilograms</SelectItem>
                            <SelectItem value="tons">Tons</SelectItem>
                            <SelectItem value="bags">Bags</SelectItem>
                            <SelectItem value="crates">Crates</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Select a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Select>
                        <SelectTrigger id="duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1month">1 Month</SelectItem>
                          <SelectItem value="2months">2 Months</SelectItem>
                          <SelectItem value="3months">3 Months</SelectItem>
                          <SelectItem value="6months">6 Months</SelectItem>
                          <SelectItem value="custom">Custom Period</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="refrigeration" />
                      <label htmlFor="refrigeration" className="text-sm">
                        Requires refrigeration
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Requirements</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Any special storage requirements or notes"
                      rows={3}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsBookingWarehouse(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBookWarehouse}>
                  Book Warehouse
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyTradesView;
