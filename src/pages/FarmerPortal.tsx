
import React, { useState } from 'react';
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
  const [userProduce, setUserProduce] = useState<Produce[]>([
    {
      id: '1',
      name: 'Maïs',
      category: 'Céréales',
      county: 'Nakuru',
      quantity: 500,
      unit: 'kg',
      qualityGrade: 'A',
      availableFrom: '2023-10-15',
      farmer: 'Jean Kariuki',
      farmerId: 'farmer-1'
    },
    {
      id: '2', 
      name: 'Tomates',
      category: 'Légumes',
      county: 'Kiambu',
      quantity: 200,
      unit: 'kg',
      qualityGrade: 'B',
      availableFrom: '2023-10-20',
      farmer: 'Jean Kariuki',
      farmerId: 'farmer-1'
    }
  ]);

  const handleDeleteProduce = (id: string) => {
    setUserProduce(prev => prev.filter(produce => produce.id !== id));
  };

  const handleEditProduce = (produce: Produce) => {
    console.log('Editing produce:', produce);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard">Tableau de Bord</TabsTrigger>
            <TabsTrigger value="parcels">Parcelles</TabsTrigger>
            <TabsTrigger value="crops">Cultures</TabsTrigger>
            <TabsTrigger value="inventory">Inventaire</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
            <TabsTrigger value="analytics">Statistiques</TabsTrigger>
            <TabsTrigger value="products">Mes Produits</TabsTrigger>
            <TabsTrigger value="add-product">Ajouter Produit</TabsTrigger>
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
