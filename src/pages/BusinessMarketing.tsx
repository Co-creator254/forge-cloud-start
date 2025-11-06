import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, TrendingUp, Users, Target, CheckCircle, MessageCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BusinessMarketing: React.FC = () => {
  const navigate = useNavigate();

  const packages = [
    {
      name: 'Basic',
      price: 'KES 5,000',
      period: '/month',
      features: [
        'Business profile listing',
        'Contact information display',
        'Basic analytics',
        '5 product listings',
        'Email support'
      ],
      color: 'border-green-200'
    },
    {
      name: 'Professional',
      price: 'KES 15,000',
      period: '/month',
      features: [
        'Featured business profile',
        'Unlimited product listings',
        'Priority search placement',
        'Advanced analytics dashboard',
        'Social media integration',
        'Customer reviews & ratings',
        'Priority support'
      ],
      color: 'border-green-500',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'KES 35,000',
      period: '/month',
      features: [
        'Premium featured listing',
        'Unlimited everything',
        'Top search ranking',
        'Dedicated account manager',
        'Custom branding',
        'API access',
        'Marketing campaign support',
        '24/7 priority support'
      ],
      color: 'border-green-700'
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: 'Reach Thousands of Farmers',
      description: 'Connect directly with farmers, cooperatives, and agribusinesses across Kenya'
    },
    {
      icon: Target,
      title: 'Targeted Marketing',
      description: 'Reach the right audience with location-based and category-specific targeting'
    },
    {
      icon: TrendingUp,
      title: 'Boost Your Sales',
      description: 'Increase visibility and drive more customers to your agricultural business'
    },
    {
      icon: MessageCircle,
      title: 'Direct Communication',
      description: 'Build relationships with potential customers through direct messaging'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
            <Megaphone className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Advertise Your Agricultural Business
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Reach thousands of farmers, suppliers, and buyers across Kenya. Grow your business with targeted marketing on AgriTender Connect.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-green-100 rounded-full mb-4">
                    <benefit.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Advertising Package</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.color} border-2 ${pkg.popular ? 'shadow-lg scale-105' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star className="h-4 w-4" /> Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{pkg.price}</span>
                    <span className="text-muted-foreground">{pkg.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${pkg.popular ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    variant={pkg.popular ? 'default' : 'outline'}
                    onClick={() => navigate('/contact')}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
              <p className="text-lg mb-6 opacity-90">
                Join hundreds of successful agribusinesses already advertising on AgriTender Connect
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => navigate('/contact')}
                >
                  Contact Sales
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white text-green-700 hover:bg-gray-100"
                  onClick={() => navigate('/service-provider-registration')}
                >
                  Register Your Business
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {[
            { number: '10,000+', label: 'Active Users' },
            { number: '47', label: 'Counties Covered' },
            { number: '500+', label: 'Listed Businesses' },
            { number: '95%', label: 'Customer Satisfaction' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessMarketing;
