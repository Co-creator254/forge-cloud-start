import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Users,
  Database,
  CheckCircle,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  FileText,
  ShoppingCart,
  Truck,
  Package,
  Award,
  MessageSquare,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TableCategory {
  name: string;
  icon: React.ReactNode;
  tables: string[];
}

const tableCategories: TableCategory[] = [
  {
    name: 'User & Auth',
    icon: <Users className="h-4 w-4" />,
    tables: ['profiles', 'user_roles', 'auth_logs', 'trust_points', 'qr_codes', 'qr_scans']
  },
  {
    name: 'Marketplace',
    icon: <ShoppingCart className="h-4 w-4" />,
    tables: ['products', 'produce_listings', 'orders', 'transactions', 'reviews', 'favorites']
  },
  {
    name: 'Supply Chain',
    icon: <Truck className="h-4 w-4" />,
    tables: ['logistics_providers', 'shipments', 'fleet_routes', 'warehouses', 'inventory']
  },
  {
    name: 'Verification',
    icon: <CheckCircle className="h-4 w-4" />,
    tables: ['verification_requests', 'certifications', 'compliance_records', 'inspections']
  },
  {
    name: 'Payments',
    icon: <DollarSign className="h-4 w-4" />,
    tables: ['payments', 'subscriptions', 'invoices', 'payment_methods']
  },
  {
    name: 'Content',
    icon: <MessageSquare className="h-4 w-4" />,
    tables: ['posts', 'comments', 'notifications', 'announcements', 'faqs']
  },
  {
    name: 'Analytics',
    icon: <BarChart3 className="h-4 w-4" />,
    tables: ['analytics_events', 'user_activity', 'performance_metrics']
  },
  {
    name: 'Admin',
    icon: <Shield className="h-4 w-4" />,
    tables: ['admin_audit_log', 'system_settings', 'feature_flags']
  }
];

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['User & Auth']);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const isTableActive = (tableName: string) => {
    return location.pathname.includes(`/admin/tables/${tableName}`);
  };

  const filteredCategories = tableCategories.map(category => ({
    ...category,
    tables: category.tables.filter(table =>
      table.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.tables.length > 0);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="font-bold text-lg">Admin Panel</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {/* Dashboard */}
            <Button
              variant={location.pathname === '/admin' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => navigate('/admin')}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>

            {/* Users */}
            <Button
              variant={location.pathname === '/admin/users' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => navigate('/admin/users')}
            >
              <Users className="h-4 w-4 mr-2" />
              User Management
            </Button>

            {/* Verifications */}
            <Button
              variant={location.pathname === '/admin/verifications' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => navigate('/admin/verifications')}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Verifications
            </Button>

            {/* Analytics */}
            <Button
              variant={location.pathname === '/admin/analytics' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => navigate('/admin/analytics')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>

            <div className="my-4 border-t border-gray-200" />

            {/* Table Categories */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground">
                <Database className="h-3 w-3" />
                DATABASE TABLES
              </div>

              {filteredCategories.map((category) => (
                <div key={category.name}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => toggleCategory(category.name)}
                  >
                    {expandedCategories.includes(category.name) ? (
                      <ChevronDown className="h-4 w-4 mr-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2" />
                    )}
                    {category.icon}
                    <span className="ml-2 flex-1 text-left">{category.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {category.tables.length}
                    </Badge>
                  </Button>

                  {expandedCategories.includes(category.name) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {category.tables.map((table) => (
                        <Button
                          key={table}
                          variant={isTableActive(table) ? 'secondary' : 'ghost'}
                          size="sm"
                          className="w-full justify-start text-sm"
                          onClick={() => navigate(`/admin/tables/${table}`)}
                        >
                          <FileText className="h-3 w-3 mr-2" />
                          {table}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <Card className="p-3 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
          </Card>
          <Button
            variant="ghost"
            className="w-full justify-start mt-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className={sidebarOpen ? 'hidden' : 'block'}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Manage all aspects of the SokoConnect platform
                </p>
              </div>
            </div>

            <Button onClick={() => navigate('/')}>
              Back to App
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
