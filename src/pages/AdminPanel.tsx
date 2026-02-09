import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FarmInputCategoryManager from '../components/admin/FarmInputCategoryManager';
import FarmInputSupplierManager from '../components/admin/FarmInputSupplierManager';
import FarmInputProductManager from '../components/admin/FarmInputProductManager';
import FarmInputOrderManager from '../components/admin/FarmInputOrderManager';
import { AdminAdPlacements } from '../components/admin/AdminAdPlacements';

const AdminPanel: React.FC = () => {
  const { isAdmin, loading } = useAdminRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      
      <Tabs defaultValue="farm-inputs" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="farm-inputs">Farm Inputs</TabsTrigger>
          <TabsTrigger value="ad-placements">Ad Placements</TabsTrigger>
        </TabsList>

        <TabsContent value="farm-inputs">
          <div className="space-y-8">
            <FarmInputCategoryManager />
            <FarmInputSupplierManager />
            <FarmInputProductManager />
            <FarmInputOrderManager />
          </div>
        </TabsContent>

        <TabsContent value="ad-placements">
          <AdminAdPlacements />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;