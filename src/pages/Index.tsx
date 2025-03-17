
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SearchSection from '@/components/SearchSection';
import Contact from '@/components/Contact';
import ChatBot from '@/components/ChatBot';

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
