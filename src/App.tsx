import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/hooks/useAuth';
import Footer from './components/Footer';
import ScrollToTop from './components/common/ScrollToTop';

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
import DataManagement from './pages/DataManagement';
import BusinessMarketing from './pages/BusinessMarketing';
import DataStatus from './pages/DataStatus';

// Supply Chain Problem Pages
import PostHarvestLosses from './pages/supplyChainProblems/PostHarvestLosses';
import MarketAccess from './pages/supplyChainProblems/MarketAccess';
import LogisticsIssues from './pages/supplyChainProblems/LogisticsIssues';
import PriceVolatility from './pages/supplyChainProblems/PriceVolatility';
import QualityControl from './pages/supplyChainProblems/QualityControl';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <BrowserRouter>
            <div className="min-h-screen bg-background flex flex-col">
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
                  <Route path="/data-management" element={<DataManagement />} />
                  <Route path="/business-marketing" element={<BusinessMarketing />} />
                  <Route path="/data-status" element={<DataStatus />} />
                  
                  {/* Supply Chain Problem Routes */}
                  <Route path="/supply-chain-problems/post-harvest-losses" element={<PostHarvestLosses />} />
                  <Route path="/supply-chain-problems/market-access" element={<MarketAccess />} />
                  <Route path="/supply-chain-problems/logistics-issues" element={<LogisticsIssues />} />
                  <Route path="/supply-chain-problems/price-volatility" element={<PriceVolatility />} />
                  <Route path="/supply-chain-problems/quality-control" element={<QualityControl />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <ScrollToTop />
            </div>
            <Toaster />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
