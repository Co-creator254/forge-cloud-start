import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import CommodityTrading from './pages/CommodityTrading';
import Logistics from './pages/Logistics';
import ServiceProviders from './pages/ServiceProviders';
import MarketInformation from './pages/MarketInformation';
import CommunityForum from './pages/CommunityForum';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import FAQPage from './pages/FAQPage';
import NotFound from './pages/NotFound';
import SearchResultsPage from './pages/SearchResultsPage';
import FarmerPortal from './pages/FarmerPortal';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/commodity-trading" element={<CommodityTrading />} />
                <Route path="/logistics" element={<Logistics />} />
                <Route path="/service-providers" element={<ServiceProviders />} />
                <Route path="/market-information" element={<MarketInformation />} />
                <Route path="/community-forum" element={<CommunityForum />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/farmer-portal" element={<FarmerPortal />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
