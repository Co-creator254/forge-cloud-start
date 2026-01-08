import React from 'react';
import { ServiceProvider, ServiceProviderType } from '@/types';
import { MapPin, Truck, Warehouse, Building, Store } from 'lucide-react';

interface ServiceProvidersMapProps {
  providers: ServiceProvider[];
  selectedType: ServiceProviderType | 'all';
}

const ServiceProvidersMap: React.FC<ServiceProvidersMapProps> = ({ providers, selectedType }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'transport': return <Truck className="h-4 w-4" />;
      case 'storage': return <Warehouse className="h-4 w-4" />;
      case 'training': return <Building className="h-4 w-4" />;
      case 'input-supplier': return <Store className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full rounded-lg overflow-hidden border bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="text-center mb-4">
        <h3 className="font-semibold text-lg">Service Providers Across Kenya</h3>
        <p className="text-sm text-muted-foreground">
          {providers.length} providers available{selectedType !== 'all' ? ` (filtered by ${selectedType.replace('-', ' ')})` : ''}
        </p>
      </div>
      
      {providers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
          {providers.slice(0, 12).map((provider, index) => (
            <div key={provider.id || index} className="bg-white p-3 rounded-lg shadow-sm border flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                {getIcon(provider.businessType)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{provider.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {provider.location?.county} • {provider.businessType?.replace('-', ' ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No providers found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default ServiceProvidersMap;
