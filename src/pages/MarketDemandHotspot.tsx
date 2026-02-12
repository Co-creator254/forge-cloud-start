
import { useEffect, useState, useRef } from "react";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, MapPin, TrendingUp } from "lucide-react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Types for market demand
interface DemandHotspot {
  id: string;
  crop: string;
  location: string;
  county: string;
  demandLevel: 'high' | 'medium' | 'low';
  pricePerKg: number;
  buyerCount: number;
  description: string;
  lastUpdated: Date;
}

// Mock data for demand hotspots
const mockDemandHotspots: DemandHotspot[] = [
  {
    id: '1',
    crop: 'Tomatoes',
    location: 'Wakulima Market',
    county: 'Nairobi',
    demandLevel: 'high',
    pricePerKg: 120,
    buyerCount: 15,
    description: 'High demand for fresh tomatoes with consistent supply for restaurants and hotels',
    lastUpdated: new Date('2025-04-22')
  },
  {
    id: '2',
    crop: 'Potatoes',
    location: 'Nakuru Main Market',
    county: 'Nakuru',
    demandLevel: 'high',
    pricePerKg: 45,
    buyerCount: 12,
    description: 'Wholesale buyers looking for bulk potato supply for distribution to retail outlets',
    lastUpdated: new Date('2025-04-23')
  },
  {
    id: '3',
    crop: 'Maize',
    location: 'Eldoret Grain Market',
    county: 'Uasin Gishu',
    demandLevel: 'medium',
    pricePerKg: 35,
    buyerCount: 8,
    description: 'Millers seeking quality maize with moisture content below 13%',
    lastUpdated: new Date('2025-04-21')
  },
  {
    id: '4',
    crop: 'Mangoes',
    location: 'Mombasa Fruit Market',
    county: 'Mombasa',
    demandLevel: 'high',
    pricePerKg: 90,
    buyerCount: 10,
    description: 'Export buyers seeking apple and ngowe mango varieties for international markets',
    lastUpdated: new Date('2025-04-20')
  },
  {
    id: '5',
    crop: 'Avocados',
    location: 'Thika Market',
    county: 'Kiambu',
    demandLevel: 'high',
    pricePerKg: 150,
    buyerCount: 7,
    description: 'Processing companies looking for hass avocados for oil extraction and export',
    lastUpdated: new Date('2025-04-22')
  }
];

const MarketDemandHotspot = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>("all");
  const [selectedCounty, setSelectedCounty] = useState<string>("all");
  const [filteredHotspots, setFilteredHotspots] = useState<DemandHotspot[]>(mockDemandHotspots);
  const [showMap, setShowMap] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  
  useEffect(() => {
    document.title = "Market Demand Hotspots | Kilimo Connect";
    
    // Initialize map if not already done
    if (showMap && mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([-1.2921, 36.8219], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Add demand hotspot markers
      const hotspotLocations: { lat: number; lng: number; hotspot: DemandHotspot }[] = [
        { lat: -1.2921, lng: 36.8219, hotspot: mockDemandHotspots[0] }, // Nairobi - Tomatoes
        { lat: -0.3031, lng: 36.0800, hotspot: mockDemandHotspots[1] }, // Nakuru - Potatoes
        { lat: 0.5143, lng: 35.2698, hotspot: mockDemandHotspots[2] }, // Eldoret - Maize
        { lat: -4.0435, lng: 39.6682, hotspot: mockDemandHotspots[3] }, // Mombasa - Mangoes
        { lat: -1.0396, lng: 37.0693, hotspot: mockDemandHotspots[4] }, // Thika - Avocados
      ];
      
      hotspotLocations.forEach(({ lat, lng, hotspot }) => {
        const color = hotspot.demandLevel === 'high' ? '#ef4444' : 
                     hotspot.demandLevel === 'medium' ? '#f97316' : '#eab308';
        
        const icon = L.divIcon({
          className: 'demand-marker',
          html: `<div style="background:${color};color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);">📍</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        
        L.marker([lat, lng], { icon })
          .bindPopup(`
            <div style="min-width:200px;">
              <strong>${hotspot.crop}</strong><br/>
              <small>${hotspot.location}, ${hotspot.county}</small><br/>
              <small>Demand: ${hotspot.demandLevel}</small><br/>
              <small>Price: KSh ${hotspot.pricePerKg}/kg</small><br/>
              <small>${hotspot.buyerCount} active buyers</small><br/>
              <small>${hotspot.description}</small>
            </div>
          `)
          .addTo(map);
      });
      
      mapInstanceRef.current = map;
    }
    
    // Filter the hotspots based on selections
    let filtered = [...mockDemandHotspots];
    
    if (selectedCrop && selectedCrop !== 'all') {
      filtered = filtered.filter(hotspot => 
        hotspot.crop.toLowerCase().includes(selectedCrop.toLowerCase())
      );
    }
    
    if (selectedCounty && selectedCounty !== 'all') {
      filtered = filtered.filter(hotspot => 
        hotspot.county.toLowerCase().includes(selectedCounty.toLowerCase())
      );
    }
    
    setFilteredHotspots(filtered);
  }, [selectedCrop, selectedCounty, showMap]);
  
  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Market Demand Hotspots</h1>
          <p className="text-muted-foreground mt-2">
            Discover where buyers are actively looking for specific crops and connect directly with them
          </p>
        </div>
        
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="crop" className="block text-sm font-medium mb-1">Crop</label>
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger id="crop">
                <SelectValue placeholder="All Crops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                <SelectItem value="tomatoes">Tomatoes</SelectItem>
                <SelectItem value="potatoes">Potatoes</SelectItem>
                <SelectItem value="maize">Maize</SelectItem>
                <SelectItem value="mangoes">Mangoes</SelectItem>
                <SelectItem value="avocados">Avocados</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="county" className="block text-sm font-medium mb-1">County</label>
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger id="county">
                <SelectValue placeholder="All Counties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                <SelectItem value="nairobi">Nairobi</SelectItem>
                <SelectItem value="nakuru">Nakuru</SelectItem>
                <SelectItem value="uasin gishu">Uasin Gishu</SelectItem>
                <SelectItem value="mombasa">Mombasa</SelectItem>
                <SelectItem value="kiambu">Kiambu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={() => {
              setSelectedCrop("all");
              setSelectedCounty("all");
            }}>
              Clear Filters
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Demand Hotspots Map</h3>
            <Button variant="outline" size="sm" onClick={() => setShowMap(!showMap)}>
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
          </div>
          
          {showMap && (
            <div ref={mapRef} className="w-full h-[400px] rounded-lg border" style={{ zIndex: 1 }} />
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotspots.map(hotspot => (
            <Card key={hotspot.id} className={
              hotspot.demandLevel === 'high' 
                ? 'border-red-200 bg-red-50' 
                : hotspot.demandLevel === 'medium'
                ? 'border-orange-200 bg-orange-50'
                : 'border-yellow-200 bg-yellow-50'
            }>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{hotspot.crop}</CardTitle>
                    <CardDescription>
                      {hotspot.location}, {hotspot.county}
                    </CardDescription>
                  </div>
                  <div className={`rounded-full px-2 py-1 text-xs font-medium 
                    ${hotspot.demandLevel === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : hotspot.demandLevel === 'medium'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {hotspot.demandLevel.charAt(0).toUpperCase() + hotspot.demandLevel.slice(1)} Demand
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Price</span>
                    <span className="font-medium">KSh {hotspot.pricePerKg}/kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Buyers</span>
                    <span className="font-medium">{hotspot.buyerCount}</span>
                  </div>
                  <p className="text-sm mt-2">{hotspot.description}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-xs text-muted-foreground">
                  Updated: {hotspot.lastUpdated.toLocaleDateString()}
                </span>
                <Button size="sm">Connect with Buyers</Button>
              </CardFooter>
            </Card>
          ))}
          
          {filteredHotspots.length === 0 && (
            <div className="col-span-full text-center p-12">
              <div className="mb-4 text-muted-foreground">
                <TrendingUp className="mx-auto h-12 w-12 opacity-50" />
              </div>
              <h3 className="text-lg font-medium">No demand hotspots found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try changing your filter criteria or check back later for new demand opportunities.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MarketDemandHotspot;
