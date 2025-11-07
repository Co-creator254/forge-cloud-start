import React from 'react';
import SupplyChainDashboard from '@/components/supply-chain/SupplyChainDashboard';
import { AppLayout } from '@/components/layout/AppLayout';

export default function SupplyChainDashboardPage() {
  return (
    <AppLayout title="Supply Chain Dashboard">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Supply Chain Dashboard</h1>
          <p className="text-muted-foreground">
            Track your farm production through every stage of the supply chain
          </p>
        </div>
        <SupplyChainDashboard />
      </div>
    </AppLayout>
  );
}