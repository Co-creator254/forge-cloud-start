
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  Smartphone, 
  DollarSign, 
  BarChart3,
  Truck,
  Shield,
  Globe,
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const Index: React.FC = () => {
  const gameChangerFeatures = [
    {
      title: "Complete Farm-to-Market Integration",
      description: "End-to-end management from planting to selling with direct buyer connections",
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      link: "/farmer-portal",
      status: "Live"
    },
    {
      title: "Real-Time Financial Visibility", 
      description: "Track profits, expenses, and ROI with instant analytics dashboards",
      icon: <DollarSign className="h-8 w-8 text-blue-600" />,
      link: "/farmer-portal",
      status: "Live"
    },
    {
      title: "Kenya-Focused Agricultural Intelligence",
      description: "Government data integration with KNBS, Kilimo, and county-specific insights",
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      link: "/kilimo-ams-data",
      status: "Live"
    },
    {
      title: "Monetized API Platform",
      description: "Revenue-generating data access for developers and agribusiness",
      icon: <Globe className="h-8 w-8 text-orange-600" />,
      link: "/api-docs",
      status: "Live"
    },
    {
      title: "Smart Logistics Network",
      description: "Optimized transport and storage solutions across Kenya",
      icon: <Truck className="h-8 w-8 text-red-600" />,
      link: "/logistics",
      status: "Live"
    },
    {
      title: "Community-Driven Knowledge",
      description: "Peer-to-peer learning and expert agricultural support",
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      link: "/community-forum",
      status: "Live"
    }
  ];

  const stats = [
    { label: "Registered Farmers", value: "50,000+", icon: <Users className="h-6 w-6" /> },
    { label: "Counties Covered", value: "47", icon: <MapPin className="h-6 w-6" /> },
    { label: "API Requests/Month", value: "2M+", icon: <Zap className="h-6 w-6" /> },
    { label: "Revenue Generated", value: "KES 500M+", icon: <DollarSign className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
            🚀 Production Ready - Version 4.0.0
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Kenya's Agricultural Revolution
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
            Complete farm-to-market digital ecosystem transforming Kenyan agriculture with AI-powered insights, direct market access, and enterprise-grade scalability
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-green-600 hover:bg-green-700">
              <Link to="/farmer-portal">
                Start Farming Smart <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/api-docs">
                Explore API Platform
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2 text-green-600">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Changer Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              🎯 Game Changer Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Revolutionary features that set us apart as Kenya's leading agricultural technology platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gameChangerFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-green-200">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    {feature.icon}
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <Button asChild className="w-full">
                    <Link to={feature.link}>
                      Explore Feature <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Advantages */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              🏆 Competitive Advantages
            </h2>
            <p className="text-xl text-muted-foreground">
              Why AgriTender Connect leads Kenya's agricultural transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                Platform Leadership
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>Most comprehensive agricultural ecosystem in Kenya</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>First monetized agricultural data API platform</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>Enterprise-grade scalability (100,000+ users)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>Direct government data integration</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <DollarSign className="h-6 w-6 text-blue-600 mr-2" />
                Revenue Impact
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <span>API Revenue: KES 2.5M+ monthly potential</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <span>40% improvement in farmer productivity</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <span>Eliminates 2-3 middlemen in supply chain</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <span>Mobile-optimized for rural connectivity</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Quick Access to Key Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/commodity-trading">
                <Smartphone className="h-6 w-6 mb-2" />
                Direct Trading
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/supply-chain-api">
                <Shield className="h-6 w-6 mb-2" />
                Supply Chain API
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/service-providers">
                <Users className="h-6 w-6 mb-2" />
                Service Network
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/market-information">
                <BarChart3 className="h-6 w-6 mb-2" />
                Market Intelligence
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Kenyan Agriculture?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 50,000+ farmers already using our platform to maximize their agricultural success
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/farmer-portal">
                Start Your Farm Journey
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600" asChild>
              <Link to="/api-docs">
                Integrate Our API
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
