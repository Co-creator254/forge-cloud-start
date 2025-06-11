
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface ParcelMapViewProps {
  selectedParcel?: {
    id: string;
    name: string;
    size: number;
    crop: string;
    coordinates?: [number, number];
  };
}

const ParcelMapView: React.FC<ParcelMapViewProps> = ({ selectedParcel }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [mapReady, setMapReady] = useState(false);

  const initializeMap = async () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      // Dynamically import mapbox-gl
      const mapboxgl = await import('mapbox-gl');
      await import('mapbox-gl/dist/mapbox-gl.css');

      mapboxgl.default.accessToken = mapboxToken;
      
      map.current = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: selectedParcel?.coordinates || [36.8219, -1.2921], // Default to Nairobi
        zoom: selectedParcel ? 15 : 6,
      });

      map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right');

      if (selectedParcel?.coordinates) {
        new mapboxgl.default.Marker()
          .setLngLat(selectedParcel.coordinates)
          .setPopup(
            new mapboxgl.default.Popup().setHTML(
              `<h3>${selectedParcel.name}</h3><p>Size: ${selectedParcel.size} acres<br/>Crop: ${selectedParcel.crop}</p>`
            )
          )
          .addTo(map.current);
      }

      setMapReady(true);
    } catch (error) {
      console.error('Error loading Mapbox:', error);
    }
  };

  useEffect(() => {
    if (mapboxToken) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken, selectedParcel]);

  if (!mapboxToken) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Farm Map</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter your Mapbox public token to view the interactive map of your parcels.
          </p>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter Mapbox public token"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Get your token from{' '}
              <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline">
                mapbox.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Farm Map
          {selectedParcel && ` - ${selectedParcel.name}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={mapContainer} className="h-[400px] w-full rounded-b-lg" />
        {!mapReady && mapboxToken && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParcelMapView;
