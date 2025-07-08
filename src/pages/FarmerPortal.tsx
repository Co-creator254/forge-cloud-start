
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FarmDashboard from '@/components/farm/FarmDashboard';
import ProduceManagement from '@/components/farm/ProduceManagement';
import LandManagement from '@/components/farm/LandManagement';
import CropTracking from '@/components/farm/CropTracking';
import InventoryManagement from '@/components/farm/InventoryManagement';
import FinancialManagement from '@/components/farm/FinancialManagement';
import AnalyticsDashboard from '@/components/farm/AnalyticsDashboard';
import FarmerProductForm from '@/components/FarmerProductForm';
import { Produce } from '@/types/farmer';

const FarmerPortal: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userProduce, setUserProduce] = useState<Produce[]>([
    {
      id: '1',
      name: 'Maize',
      category: 'Grains',
      county: 'Nakuru',
      quantity: 500,
      unit: 'kg',
      qualityGrade: 'A',
      availableFrom: '2023-10-15',
      farmer: 'John Kariuki',
      farmerId: 'farmer-1'
    },
    {
      id: '2', 
      name: 'Tomatoes',
      category: 'Vegetables',
      county: 'Kiambu',
      quantity: 200,
      unit: 'kg',
      qualityGrade: 'B',
      availableFrom: '2023-10-20',
      farmer: 'John Kariuki',
      farmerId: 'farmer-1'
    }
  ]);

  const handleDeleteProduce = (id: string) => {
    setUserProduce(prev => prev.filter(produce => produce.id !== id));
  };

  const handleEditProduce = (produce: Produce) => {
    console.log('Editing produce:', produce);
  };

  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Farmer Portal</h1>
          <p className="text-muted-foreground">Manage your farm operations and produce</p>
        </div>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="parcels">Land Parcels</TabsTrigger>
            <TabsTrigger value="crops">Crops</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="add-product">Add Product</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <FarmDashboard />
          </TabsContent>

          <TabsContent value="parcels">
            <LandManagement />
          </TabsContent>

          <TabsContent value="crops">
            <CropTracking />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManagement />
          </TabsContent>

          <TabsContent value="finances">
            <FinancialManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="products">
            <ProduceManagement 
              userProduce={userProduce}
              onDeleteProduce={handleDeleteProduce}
              onEditProduce={handleEditProduce}
            />
          </TabsContent>

          <TabsContent value="add-product">
            <div className="max-w-2xl mx-auto">
              <FarmerProductForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FarmerPortal;
