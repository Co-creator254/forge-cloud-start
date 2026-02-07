import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Award,
  Package,
  Activity,
  CheckCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  // In production, these would be fetched from the database
  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12.5%',
      icon: <Users className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Active Orders',
      value: '156',
      change: '+8.2%',
      icon: <ShoppingCart className="h-5 w-5" />,
      color: 'text-green-600'
    },
    {
      title: 'Revenue (Monthly)',
      value: 'KSh 1.2M',
      change: '+23.1%',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'text-yellow-600'
    },
    {
      title: 'Trust Points Awarded',
      value: '8,432',
      change: '+45.3%',
      icon: <Award className="h-5 w-5" />,
      color: 'text-purple-600'
    },
    {
      title: 'Products Listed',
      value: '1,234',
      change: '+15.7%',
      icon: <Package className="h-5 w-5" />,
      color: 'text-orange-600'
    },
    {
      title: 'Pending Verifications',
      value: '23',
      change: '-5.2%',
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-red-600'
    }
  ];

  const recentActivity = [
    { action: 'New user registered', user: 'john@example.com', time: '2 minutes ago' },
    { action: 'Order completed', user: 'Order #1234', time: '15 minutes ago' },
    { action: 'QR Code scanned', user: 'Farmer John Doe', time: '1 hour ago' },
    { action: 'Verification approved', user: 'Exporter ABC Ltd', time: '2 hours ago' },
    { action: 'Payment received', user: 'KSh 15,000', time: '3 hours ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h2 className="text-3xl font-bold">Welcome to Admin Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Monitor and manage all aspects of the SokoConnect platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={stat.change.startsWith('+') ? 'default' : 'destructive'}>
                      {stat.change}
                    </Badge>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className={`${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 pb-3 border-b last:border-0">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-5 w-5 mb-2 text-blue-600" />
                <p className="font-medium text-sm">Manage Users</p>
              </button>
              <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <CheckCircle className="h-5 w-5 mb-2 text-green-600" />
                <p className="font-medium text-sm">Verifications</p>
              </button>
              <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <Package className="h-5 w-5 mb-2 text-orange-600" />
                <p className="font-medium text-sm">Products</p>
              </button>
              <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <TrendingUp className="h-5 w-5 mb-2 text-purple-600" />
                <p className="font-medium text-sm">Analytics</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
