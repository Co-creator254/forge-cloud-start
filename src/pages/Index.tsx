
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SearchSection from '@/components/SearchSection';
import Contact from '@/components/Contact';
import ChatBot from '@/components/ChatBot';
import KilimoStatsView from '@/components/KilimoStatsView';
import AmisKeDataView from '@/components/AmisKeDataView';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Package, Truck, BarChart, Database } from 'lucide-react';

const Index = () => {
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

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <SearchSection id="agricultural-issues" />
        
        {/* Main Features Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Solving Agricultural Supply Chain Challenges</h2>
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
                Our platform connects farmers, buyers, and service providers across Kenya to address
                key challenges in agricultural supply chains
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="flex flex-col">
                <CardHeader>
                  <div className="mb-2 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Commodity Trading</CardTitle>
                  <CardDescription>Buy, sell, and barter agricultural commodities directly</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="list-disc pl-5 mb-4 space-y-1">
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
              
              <Card className="flex flex-col">
                <CardHeader>
                  <div className="mb-2 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Supply Chain Solutions</CardTitle>
                  <CardDescription>Addressing key agricultural challenges</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="list-disc pl-5 mb-4 space-y-1">
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
              
              <Card className="flex flex-col">
                <CardHeader>
                  <div className="mb-2 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Data Integration</CardTitle>
                  <CardDescription>Real-time agricultural data insights</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Kilimo statistics integration</li>
                    <li>AMIS Kenya price data</li>
                    <li>County-level production trends</li>
                    <li>Market price analysis</li>
                  </ul>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/kilimo-ams-data">
                      View Data <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
              
              <Card className="flex flex-col">
                <CardHeader>
                  <div className="mb-2 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>API Services</CardTitle>
                  <CardDescription>Developer resources and integrations</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Supply chain data API</li>
                    <li>Agricultural tenders API</li>
                    <li>Jobs and opportunities API</li>
                    <li>Comprehensive documentation</li>
                  </ul>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/api-docs">
                      API Documentation <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Agricultural Data Insights</h2>
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto mb-6">
                Explore valuable agricultural data from Kenya's most reliable sources
              </p>
              <div className="flex justify-center mb-8">
                <Link to="/data-jobs">
                  <Button variant="outline" className="group">
                    Manage Data Jobs
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-10">
              <KilimoStatsView />
              <AmisKeDataView />
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
