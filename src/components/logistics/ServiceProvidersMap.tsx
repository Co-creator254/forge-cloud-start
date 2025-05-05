
import React from 'react';
import { ServiceProvider, ServiceProviderType } from '@/types';
import { Button } from "@/components/ui/button";

interface ServiceProvidersMapProps {
  providers: ServiceProvider[];
  selectedType: ServiceProviderType | 'all';
}

const ServiceProvidersMap: React.FC<ServiceProvidersMapProps> = ({ providers, selectedType }) => {
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

export default ServiceProvidersMap;
