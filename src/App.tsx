
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"

import Header from './components/Header';
import Home from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import CommodityTrading from './pages/CommodityTrading';
import Logistics from './pages/LogisticsSolutionsMap';
import ServiceProviders from './pages/ServiceProviders';
import MarketInformation from './pages/MarketLinkages';
import CommunityForum from './pages/CommunityForum';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import FAQPage from './pages/FAQPage';
import NotFound from './pages/NotFound';
import SearchResultsPage from './pages/SearchResultsPage';
import FarmerPortal from './pages/FarmerPortal';
import KilimoAmsData from './pages/KilimoAmsData';
import ApiDocs from './pages/ApiDocs';
import SupplyChainAPI from './pages/SupplyChainAPI';
import SupplyChainProblems from './pages/SupplyChainProblems';

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
                <Route path="/kilimo-ams-data" element={<KilimoAmsData />} />
                <Route path="/api-docs" element={<ApiDocs />} />
                <Route path="/supply-chain-api" element={<SupplyChainAPI />} />
                <Route path="/supply-chain-problems" element={<SupplyChainProblems />} />
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
