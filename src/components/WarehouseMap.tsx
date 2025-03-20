
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Plus, Warehouse as WarehouseIcon, Thermometer, FileCheck, Clock } from 'lucide-react';
import { fetchWarehouses } from '@/services/kilimoAPI';
import { Warehouse as WarehouseType } from '@/types';
import { useToast } from '@/hooks/use-toast';

// In a real app, this would use a mapping library like Mapbox or Google Maps
// For this demo, we'll simulate a map with a div and positioned elements

const WarehouseMap: React.FC = () => {
  const { toast } = useToast();
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseType | null>(null);
  const [isAddingWarehouse, setIsAddingWarehouse] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: -1.2921, lng: 36.8219 }); // Nairobi as default
  const [mapZoom, setMapZoom] = useState(6);

  useEffect(() => {
    const loadWarehouses = async () => {
      setIsLoading(true);
      try {
        const data = await fetchWarehouses();
        setWarehouses(data);
      } catch (error) {
        console.error('Error loading warehouses:', error);
        toast({
          title: 'Error',
          description: 'Failed to load warehouse data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWarehouses();
  }, [toast]);

  const handleAddWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Warehouse Added',
      description: 'Your warehouse has been added to the map',
    });
    setIsAddingWarehouse(false);
  };

  const handleWarehouseClick = (warehouse: WarehouseType) => {
    setSelectedWarehouse(warehouse);
  };

  // Calculate the position of warehouses on the "map"
  const calculatePosition = (lat: number | undefined, lng: number | undefined) => {
    if (lat === undefined || lng === undefined) return { left: '50%', top: '50%' };
    
    // This is a simple mapping to position warehouses on our simulated map
    // In a real app, we would use proper map coordinates
    const mapWidth = 100; // percent
    const mapHeight = 100; // percent
    
    // Kenya's approximate bounds
    const kenyaMinLat = -4.8;
    const kenyaMaxLat = 4.5;
    const kenyaMinLng = 33.5;
    const kenyaMaxLng = 42;
    
    // Calculate position as percentage within bounds
    const left = ((lng - kenyaMinLng) / (kenyaMaxLng - kenyaMinLng)) * mapWidth;
    const top = ((kenyaMaxLat - lat) / (kenyaMaxLat - kenyaMinLat)) * mapHeight;
    
    return {
      left: `${Math.min(Math.max(left, 0), 100)}%`,
      top: `${Math.min(Math.max(top, 0), 100)}%`
    };
  };

  // Get pin color based on warehouse type
  const getPinColor = (warehouse: WarehouseType) => {
    if (warehouse.hasRefrigeration) return 'bg-blue-500';
    if (warehouse.hasCertifications) return 'bg-green-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Warehouse Map</h2>
          <p className="text-muted-foreground">Find and add warehouses across Kenya</p>
        </div>
        <Button onClick={() => setIsAddingWarehouse(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Warehouse
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4">
          <Card className="h-[500px] overflow-hidden">
            <CardContent className="p-0 relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/5">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="relative w-full h-[500px] bg-muted overflow-hidden">
                  {/* Simulated Kenya map boundaries */}
                  <div className="absolute inset-0 border-2 border-dashed border-border rounded-md">
                    {/* Major cities for reference */}
                    <div className="absolute text-xs text-muted-foreground" style={{ left: '40%', top: '40%' }}>Nairobi</div>
                    <div className="absolute text-xs text-muted-foreground" style={{ left: '15%', top: '45%' }}>Kisumu</div>
                    <div className="absolute text-xs text-muted-foreground" style={{ left: '75%', top: '65%' }}>Mombasa</div>
                    <div className="absolute text-xs text-muted-foreground" style={{ left: '35%', top: '25%' }}>Nakuru</div>
                    
                    {/* Warehouse pins */}
                    {warehouses.map(warehouse => {
                      const position = calculatePosition(warehouse.latitude, warehouse.longitude);
                      return (
                        <div 
                          key={warehouse.id} 
                          className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                          style={{ left: position.left, top: position.top }}
                          onClick={() => handleWarehouseClick(warehouse)}
                        >
                          <div className={`h-4 w-4 rounded-full ${getPinColor(warehouse)} flex items-center justify-center animate-pulse`}>
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          </div>
                          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-background border shadow-md rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            {warehouse.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm">Standard Storage</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">Refrigerated Storage</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Certified Storage</span>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/4">
          {selectedWarehouse ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{selectedWarehouse.name}</CardTitle>
                <CardDescription>{selectedWarehouse.location}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Warehouse className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      Capacity: {selectedWarehouse.capacity} {selectedWarehouse.capacityUnit}
                    </span>
                  </div>
                  
                  {selectedWarehouse.hasRefrigeration && (
                    <div className="flex items-center text-sm">
                      <Thermometer className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-blue-600 dark:text-blue-400">
                        Refrigerated Storage Available
                      </span>
                    </div>
                  )}
                  
                  {selectedWarehouse.hasCertifications && (
                    <div className="flex items-center text-sm">
                      <FileCheck className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">
                        Certified: {selectedWarehouse.certificationTypes?.join(', ')}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      Rates: {selectedWarehouse.rates}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">Goods Types:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedWarehouse.goodsTypes.map(type => (
                      <div key={type} className="text-xs bg-muted px-2 py-1 rounded-full">
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">Contact:</div>
                  <div className="text-sm">{selectedWarehouse.contactInfo}</div>
                </div>
                
                <Button size="sm" className="w-full mt-2">Book Storage</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Warehouse Information</CardTitle>
                <CardDescription>
                  Select a warehouse on the map to view details
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Click on any pin to see warehouse details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {isAddingWarehouse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add New Warehouse</CardTitle>
              <CardDescription>
                Register your warehouse on our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddWarehouse} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Warehouse Name</Label>
                    <Input id="name" placeholder="Warehouse name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="county">County</Label>
                    <Select>
                      <SelectTrigger id="county">
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nairobi">Nairobi</SelectItem>
                        <SelectItem value="nakuru">Nakuru</SelectItem>
                        <SelectItem value="kiambu">Kiambu</SelectItem>
                        <SelectItem value="mombasa">Mombasa</SelectItem>
                        <SelectItem value="kisumu">Kisumu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Specific Location</Label>
                    <Input id="location" placeholder="Address or landmark" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Information</Label>
                    <Input id="contact" placeholder="Phone number" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Storage Capacity</Label>
                    <Input id="capacity" placeholder="e.g., 1000" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacityUnit">Capacity Unit</Label>
                    <Select>
                      <SelectTrigger id="capacityUnit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tons">Tons</SelectItem>
                        <SelectItem value="sq-m">Square Meters</SelectItem>
                        <SelectItem value="cubic-m">Cubic Meters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goodsTypes">Goods Types</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="cereals" />
                      <label htmlFor="cereals" className="text-sm">Cereals</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="fruits" />
                      <label htmlFor="fruits" className="text-sm">Fruits</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="vegetables" />
                      <label htmlFor="vegetables" className="text-sm">Vegetables</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="processed" />
                      <label htmlFor="processed" className="text-sm">Processed Foods</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="dairy" />
                      <label htmlFor="dairy" className="text-sm">Dairy Products</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="meat" />
                      <label htmlFor="meat" className="text-sm">Meat Products</label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Features</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="refrigeration" />
                      <label htmlFor="refrigeration" className="text-sm">Refrigerated Storage</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="certified" />
                      <label htmlFor="certified" className="text-sm">Has Certifications</label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rates">Rates</Label>
                  <Input id="rates" placeholder="e.g., KES 500 per ton/month" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Additional Information</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Any other details about your warehouse..."
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" type="button" onClick={() => setIsAddingWarehouse(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Add Warehouse
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WarehouseMap;
