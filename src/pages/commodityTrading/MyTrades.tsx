
import React, { useState, useEffect } from 'react';
import MyTradesTab from '@/features/commodityTrading/tabs/MyTradesTab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Truck, Map, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LogisticsProvider, TransportRoute } from '@/types';

const MyTradesView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [nearbyTransporters, setNearbyTransporters] = useState<LogisticsProvider[]>([]);
  const [showTransporters, setShowTransporters] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleFindTransport = () => {
    setShowTransporters(true);
    
    // Simulate finding nearby transporters
    setIsLoading(true);
    setTimeout(() => {
      const transporters: LogisticsProvider[] = [
        {
          id: 'T001',
          name: 'Fast Track Logistics',
          serviceType: 'transport',
          counties: ['Nairobi', 'Kiambu', 'Machakos'],
          contactInfo: '+254712345678',
          capacity: '5-10 tons',
          rates: 'KES 15 per kg',
          hasRefrigeration: true,
          vehicleType: '7-ton truck',
          loadCapacity: 7000,
          availableRoutes: [
            {
              id: 'R001',
              origin: 'Nairobi',
              destination: 'Nakuru',
              distance: 158,
              estimatedTime: '3 hours',
              frequency: 'Daily',
              cost: 15000
            }
          ],
          availableTimes: ['Morning', 'Afternoon'],
          latitude: -1.2921,
          longitude: 36.8219
        },
        {
          id: 'T002',
          name: 'Fresh Produce Movers',
          serviceType: 'transport',
          counties: ['Nakuru', 'Nairobi', 'Kiambu'],
          contactInfo: '+254723456789',
          capacity: '3-5 tons',
          rates: 'KES 20 per kg',
          hasRefrigeration: true,
          vehicleType: '3-ton refrigerated van',
          loadCapacity: 3000,
          availableRoutes: [
            {
              id: 'R002',
              origin: 'Nakuru',
              destination: 'Nairobi',
              distance: 158,
              estimatedTime: '3 hours',
              frequency: 'Mon, Wed, Fri',
              cost: 12000
            }
          ],
          availableTimes: ['Morning'],
          latitude: -0.3031,
          longitude: 36.0800
        }
      ];
      
      setNearbyTransporters(transporters);
      setIsLoading(false);
      
      toast({
        title: 'Transporters Found',
        description: `${transporters.length} transporters available in your area`,
        variant: 'default'
      });
    }, 1500);
  };

  const handleRequestTransport = (transporter: LogisticsProvider) => {
    toast({
      title: 'Transport Request Sent',
      description: `Your request has been sent to ${transporter.name}. They will contact you shortly.`,
      variant: 'default'
    });
  };

  const handleShowOnMap = () => {
    toast({
      title: 'Feature Coming Soon',
      description: 'Map view will be available in the next update with satellite imagery.',
      variant: 'default'
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">My Trades</h2>
          <p className="text-muted-foreground">Manage your agricultural trades and find transport</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button 
            onClick={handleFindTransport} 
            className="flex items-center gap-2"
            variant="outline"
          >
            <Truck className="h-4 w-4" />
            Find Transport
          </Button>
          <Button 
            variant="outline"
            onClick={handleShowOnMap}
            className="flex items-center gap-2"
          >
            <Map className="h-4 w-4" />
            Map View
          </Button>
        </div>
      </div>

      <MyTradesTab isLoading={isLoading} searchTerm={searchTerm} />

      {showTransporters && (
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Nearby Transport Providers</CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                setShowTransporters(false);
                setNearbyTransporters([]);
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : nearbyTransporters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyTransporters.map(transporter => (
                  <div key={transporter.id} className="border rounded-lg p-4 hover:bg-accent transition-colors">
                    <div className="flex justify-between">
                      <h4 className="font-semibold">{transporter.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${transporter.hasRefrigeration ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
                        {transporter.hasRefrigeration ? 'Refrigerated' : 'Standard'}
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 gap-y-1 text-sm">
                      <span className="font-medium">Vehicle:</span> <span>{transporter.vehicleType}</span>
                      <span className="font-medium">Capacity:</span> <span>{transporter.capacity}</span>
                      <span className="font-medium">Areas:</span> <span>{transporter.counties.join(', ')}</span>
                      <span className="font-medium">Rates:</span> <span>{transporter.rates}</span>
                    </div>
                    
                    {transporter.availableRoutes && transporter.availableRoutes.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium mb-1">Available Routes:</h5>
                        {transporter.availableRoutes.map(route => (
                          <div key={route.id} className="text-xs bg-background p-2 rounded">
                            <div className="flex justify-between">
                              <span>{route.origin} to {route.destination}</span>
                              <span>{route.distance} km</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground mt-1">
                              <span>{route.frequency}</span>
                              <span>Est. {route.estimatedTime}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-3 flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleRequestTransport(transporter)}
                      >
                        Request Transport
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => {
                          toast({
                            title: 'Notification Set',
                            description: `You'll be notified when ${transporter.name} is available.`,
                            variant: 'default'
                          });
                        }}
                      >
                        <Bell className="h-3 w-3" />
                        Notify
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No transport providers found in your area.</p>
                <p className="mt-2">Try adjusting your search criteria or check back later.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyTradesView;
