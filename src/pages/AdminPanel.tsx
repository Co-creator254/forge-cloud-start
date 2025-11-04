import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Loader2 } from 'lucide-react';
import FarmInputCategoryManager from '../components/admin/FarmInputCategoryManager';
import FarmInputSupplierManager from '../components/admin/FarmInputSupplierManager';
import FarmInputProductManager from '../components/admin/FarmInputProductManager';
import FarmInputOrderManager from '../components/admin/FarmInputOrderManager';

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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <div className="mb-8">
        <FarmInputCategoryManager />
      </div>
      <div className="mb-8">
        <FarmInputSupplierManager />
      </div>
      <div className="mb-8">
        <FarmInputProductManager />
      </div>
      <div className="mb-8">
        <FarmInputOrderManager />
      </div>
    </div>
  );
};

export default AdminPanel;
