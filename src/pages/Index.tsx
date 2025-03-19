
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Contact from '@/components/Contact';
import ChatBot from '@/components/ChatBot';
import KilimoStatsView from '@/components/KilimoStatsView';
import AmisKeDataView from '@/components/AmisKeDataView';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Package, Truck, BarChart, Users, Star, TrendingUp, Shield } from 'lucide-react';
import FeaturedContent from '@/components/FeaturedContent';
import Onboarding from '@/components/Onboarding';

const Index = () => {
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(0);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(
    localStorage.getItem('onboardingComplete') === 'true'
  );

  useEffect(() => {
    // Smooth scroll to section when URL has hash
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    // Pre-fetch data when the page loads
    const preFetchData = async () => {
      try {
        // Pre-fetch markets data
        const module = await import('@/services/api');
        await module.fetchMarkets();
      } catch (error) {
        console.error('Error pre-fetching data:', error);
      }
    };
    
    preFetchData();
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setIsOnboardingComplete(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {!isOnboardingComplete && (
          <Onboarding 
            currentStep={currentOnboardingStep}
            setCurrentStep={setCurrentOnboardingStep}
            completeOnboarding={completeOnboarding}
          />
        )}
        
        <Hero />
        
        {/* Featured Content Section */}
        <section id="featured-content" className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-2">
                Featured Agricultural Content
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Agricultural Insights</h2>
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
                Stay updated with the latest agricultural news, offerings, and innovative solutions from featured providers
              </p>
            </div>
            
            <FeaturedContent />
          </div>
        </section>
        
        {/* Main Features Section */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Transforming Agricultural Supply Chains</h2>
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
                Our platform connects farmers, buyers, and service providers across Kenya to address
                key challenges in agricultural supply chains
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="flex flex-col hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="mb-2 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Commodity Trading</CardTitle>
                  <CardDescription>Connect directly with buyers and sellers across Kenya</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Searchable commodity listings</li>
                    <li>Barter exchange with value calculator</li>
                    <li>M-Pesa integration</li>
                    <li>Quality verification system</li>
                  </ul>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                  <Button asChild className="w-full">
                    <Link to="/commodity-trading">
                      Start Trading <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
              
              <Card className="flex flex-col hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="mb-2 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Supply Chain Solutions</CardTitle>
                  <CardDescription>Tackle critical agricultural challenges</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Post-harvest loss reduction</li>
                    <li>Logistics and transportation</li>
                    <li>Market access improvement</li>
                    <li>Price volatility mitigation</li>
                  </ul>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/supply-chain-problems">
                      Explore Solutions <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
              
              <Card className="flex flex-col hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="mb-2 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Market Intelligence</CardTitle>
                  <CardDescription>Make data-driven farming decisions</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Real-time price data</li>
                    <li>County-level production trends</li>
                    <li>Seasonal forecasting</li>
                    <li>Crop performance analysis</li>
                  </ul>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/kilimo-ams-data">
                      Access Data <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Success Stories Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-2">
                Success Stories
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Transforming Kenyan Agriculture</h2>
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
                See how our platform is helping to revolutionize agricultural practices across Kenya
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-muted/30 border-none overflow-hidden hover:shadow-md transition-all">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="bg-[url('/placeholder.svg')] bg-cover bg-center h-full min-h-[180px]"></div>
                  <div className="col-span-2 p-6">
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">Meru Farmers Cooperative</h3>
                    <p className="text-muted-foreground mb-3">Increased market access by 45%</p>
                    <p>"The platform connected us directly to urban buyers, eliminating middlemen and increasing our profits. The price data helped us negotiate better terms."</p>
                    <div className="flex items-center mt-4">
                      <Users className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm text-muted-foreground">320 members</span>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-muted/30 border-none overflow-hidden hover:shadow-md transition-all">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="bg-[url('/placeholder.svg')] bg-cover bg-center h-full min-h-[180px]"></div>
                  <div className="col-span-2 p-6">
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">Nakuru Fresh Produce</h3>
                    <p className="text-muted-foreground mb-3">Reduced post-harvest losses by 30%</p>
                    <p>"The platform's logistics solutions and collection point network helped us preserve produce quality and reach markets faster, significantly reducing wastage."</p>
                    <div className="flex items-center mt-4">
                      <TrendingUp className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm text-muted-foreground">1.2M KES monthly revenue</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="text-center mt-10">
              <Button asChild variant="outline">
                <Link to="/success-stories">
                  View All Success Stories <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Data Integration Section */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-2">
                Real-time Data
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Agricultural Market Intelligence</h2>
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto mb-6">
                Access critical agricultural market data to make informed decisions
              </p>
              <div className="flex justify-center gap-4 mb-8">
                <Button asChild className="group">
                  <Link to="/kilimo-ams-data">
                    Explore Full Data <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/data-jobs">
                    Manage Data Jobs <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-10">
              <KilimoStatsView />
              <AmisKeDataView />
            </div>
          </div>
        </section>
        
        {/* Trust & Security Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-2">
                Trust & Security
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Reliability</h2>
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
                Our platform is designed with security, accuracy, and long-term sustainability in mind
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-md transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Secure Transactions</h3>
                  <p className="text-muted-foreground">All transactions and data exchanges are encrypted and protected using industry-standard security protocols</p>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-md transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Quality Verification</h3>
                  <p className="text-muted-foreground">Our verification system ensures that products meet quality standards before transactions are finalized</p>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-md transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                    <BarChart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Data Accuracy</h3>
                  <p className="text-muted-foreground">We continuously validate all agricultural data with multiple reliable sources for maximum accuracy</p>
                </div>
              </Card>
            </div>
          </div>
        </section>
        
        <Contact />
      </main>
      <footer className="bg-muted/30 py-8 px-6 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto">
          <p>© {new Date().getFullYear()} AgriTender Connect. All rights reserved.</p>
        </div>
      </footer>
      
      <ChatBot />
    </div>
  );
};

export default Index;
