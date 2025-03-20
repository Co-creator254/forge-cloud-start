
import React, { useState, useEffect } from 'react';
import BarterExchangeTab from '@/features/commodityTrading/tabs/BarterExchangeTab';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FarmerGroup } from '@/types';

const BarterExchangeView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const { toast } = useToast();
  const [farmerGroups, setFarmerGroups] = useState<FarmerGroup[]>([]);

  useEffect(() => {
    // Simulate fetching farmer groups
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        // This would be replaced with an actual API call
        setTimeout(() => {
          const groups: FarmerGroup[] = [
            {
              id: 'fg001',
              name: 'Nyeri Coffee Growers Association',
              region: 'Central',
              cropFocus: ['Coffee'],
              memberCount: 124,
              description: 'A cooperative of small-scale coffee farmers in Nyeri County',
              established: '2010-05-12',
              isCooperative: true,
              contactPerson: 'James Mwangi',
              contactInfo: '+254722000000'
            },
            {
              id: 'fg002',
              name: 'Meru Potato Farmers',
              region: 'Eastern',
              cropFocus: ['Potatoes'],
              memberCount: 78,
              description: 'Group of potato farmers focused on improving market access',
              established: '2015-08-23',
              isCooperative: false,
              contactPerson: 'Sarah Kinyua',
              contactInfo: '+254733000000'
            }
          ];
          setFarmerGroups(groups);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching farmer groups:', error);
        toast({
          title: 'Error',
          description: 'Failed to load farmer groups',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [toast]);

  const handleCreateGroup = () => {
    toast({
      title: 'Feature Coming Soon',
      description: 'Farmer group creation will be available in the next update.',
      variant: 'default'
    });
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Barter Exchange</h2>
          <p className="text-muted-foreground">Exchange goods and services with other farmers</p>
        </div>
        <Button 
          onClick={handleCreateGroup} 
          className="mt-4 sm:mt-0"
        >
          Create Farmer Group
        </Button>
      </div>
      
      <BarterExchangeTab 
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedLocation={selectedLocation}
        isLoading={isLoading}
      />

      {farmerGroups.length > 0 && (
        <div className="mt-8 border rounded-lg p-4">
          <h3 className="text-xl font-bold mb-4">Farmer Groups in Your Area</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {farmerGroups.map(group => (
              <div key={group.id} className="border rounded-lg p-4 hover:bg-accent transition-colors">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-lg">{group.name}</h4>
                  <span className="text-sm px-2 py-1 bg-primary/10 rounded-full">
                    {group.isCooperative ? 'Cooperative' : 'Group'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                <div className="mt-3 grid grid-cols-2 gap-y-1 text-sm">
                  <span className="font-medium">Region:</span> <span>{group.region}</span>
                  <span className="font-medium">Members:</span> <span>{group.memberCount}</span>
                  <span className="font-medium">Focus:</span> <span>{group.cropFocus?.join(', ')}</span>
                  <span className="font-medium">Since:</span> <span>{new Date(group.established || '').getFullYear()}</span>
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  Join Group
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default BarterExchangeView;
