
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
import { ArrowRight } from 'lucide-react';

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
        
        {/* Data Integration Section */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-2">
                Data Integrations
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
