
import React from 'react';
import { ArrowDownCircle, ShoppingBag, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  const handleScrollDown = () => {
    const searchSection = document.getElementById('search-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center relative overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sage-50/50 to-soil-50/50 dark:from-sage-900/20 dark:to-soil-900/20 -z-10" />
      
      {/* Animated circle decorations */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-sage-200/30 dark:bg-sage-800/10 blur-3xl -z-10 animate-pulse" style={{ animationDuration: '15s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-soil-200/20 dark:bg-soil-800/10 blur-3xl -z-10 animate-pulse" style={{ animationDuration: '20s' }} />
      
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
            <div className="flex items-center justify-center h-12 w-12 bg-sage-600 text-white rounded-md">
              <LinkIcon className="h-6 w-6" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-sage-700 to-soil-600 bg-clip-text text-transparent">Soko-Connect</span>
          </div>
        </div>
        
        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
          All-In-One Platform
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter mb-4">
          Your Complete Resource for
          <span className="block text-primary"> Agricultural Information in Kenya</span>
        </h1>
        <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto mt-6">
          Discover agricultural solutions, tender opportunities, and supply chain positions
          — all in one seamless platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-4">
          <Button 
            size="lg" 
            className="rounded-full px-8 text-lg shadow-lg hover:shadow-xl bg-primary hover:bg-primary/90"
            onClick={handleScrollDown}
          >
            Explore Now
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="rounded-full px-8 text-lg border-2"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Contact Us
          </Button>
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 rounded-full animate-bounce" 
        style={{ animationDuration: '2s' }}
        onClick={handleScrollDown}
      >
        <ArrowDownCircle className="h-8 w-8 text-primary/80" />
      </Button>
    </section>
  );
};

export default Hero;
