
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, Package, MapPin, AlertTriangle, Users, BarChart3 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Logistics: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const logisticsServices = [
    {
      title: 'Transportation Services',
      description: 'Connect with reliable transporters for your agricultural products',
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      link: '/logistics-solutions-map',
      count: '150+ Providers'
    },
    {
      title: 'Warehouse Solutions',
      description: 'Find storage facilities and cold chain solutions',
      icon: <Package className="h-8 w-8 text-green-600" />,
      link: '/logistics-solutions-map',
      count: '80+ Facilities'
    },
    {
      title: 'Supply Chain Issues',
      description: 'Identify and solve logistics challenges',
      icon: <AlertTriangle className="h-8 w-8 text-orange-600" />,
      link: '/supply-chain-problems/logistics-issues',
      count: 'Solutions Available'
    },
    {
      title: 'Service Providers',
      description: 'Browse all agricultural service providers',
      icon: <Users className="h-8 w-8 text-purple-600" />,
      link: '/service-providers',
      count: '200+ Services'
    }
  ];

  const quickStats = [
    { label: 'Active Transporters', value: '150+', icon: <Truck className="h-5 w-5" /> },
    { label: 'Storage Facilities', value: '80+', icon: <Package className="h-5 w-5" /> },
    { label: 'Counties Covered', value: '47', icon: <MapPin className="h-5 w-5" /> },
    { label: 'Monthly Deliveries', value: '2,500+', icon: <BarChart3 className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Agricultural Logistics Hub</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your one-stop solution for agricultural transportation, storage, and supply chain management across Kenya
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transportation">Transportation</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="solutions">Solutions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {logisticsServices.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(service.link)}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        {service.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                        <div className="text-sm text-primary font-medium">{service.count}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                    <Button className="w-full mt-4" onClick={(e) => {
                      e.stopPropagation();
                      navigate(service.link);
                    }}>
                      Explore Service
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transportation">
            <Card>
              <CardHeader>
                <CardTitle>Transportation Services</CardTitle>
                <CardDescription>
                  Find reliable transporters for your agricultural products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold">Truck Transport</h3>
                      <p className="text-sm text-muted-foreground">Large capacity for bulk goods</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold">Refrigerated Transport</h3>
                      <p className="text-sm text-muted-foreground">Cold chain for perishables</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold">Express Delivery</h3>
                      <p className="text-sm text-muted-foreground">Fast delivery for urgent goods</p>
                    </div>
                  </div>
                  <Button onClick={() => navigate('/logistics-solutions-map')} className="w-full">
                    Find Transporters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage">
            <Card>
              <CardHeader>
                <CardTitle>Storage Solutions</CardTitle>
                <CardDescription>
                  Secure storage facilities across Kenya
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold">Warehouses</h3>
                      <p className="text-sm text-muted-foreground">Dry storage for grains and processed goods</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold">Cold Storage</h3>
                      <p className="text-sm text-muted-foreground">Temperature-controlled for fresh produce</p>
                    </div>
                  </div>
                  <Button onClick={() => navigate('/logistics-solutions-map')} className="w-full">
                    Find Storage Facilities
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="solutions">
            <Card>
              <CardHeader>
                <CardTitle>Logistics Solutions</CardTitle>
                <CardDescription>
                  Comprehensive solutions for supply chain challenges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/supply-chain-problems/logistics-issues')}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Identify Logistics Issues
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/transporter-signup')}
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Register as Transporter
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/service-provider-registration')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Register Service Provider
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        {!user && (
          <Card className="mt-8">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Join Our Logistics Network</h3>
              <p className="text-muted-foreground mb-4">
                Sign up to access premium logistics services and connect with verified providers
              </p>
              <Button onClick={() => navigate('/auth')} size="lg">
                Sign Up Now
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Logistics;
