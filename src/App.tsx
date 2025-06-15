
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import ScrollToTop from '@/components/common/ScrollToTop';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Page imports
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import KilimoAmsData from '@/pages/KilimoAmsData';
import LogisticsSolutionsMap from '@/pages/LogisticsSolutionsMap';
import ServiceProviders from '@/pages/ServiceProviders';
import BusinessMarketing from '@/pages/BusinessMarketing';
import CommodityTrading from '@/pages/CommodityTrading';
import CommunityForum from '@/pages/CommunityForum';
import SentimentAnalysis from '@/pages/SentimentAnalysis';
import FarmerPortal from '@/pages/FarmerPortal';
import SupplyChainProblems from '@/pages/SupplyChainProblems';
import SystemStatus from '@/pages/SystemStatus';
import Contact from '@/pages/Contact';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';
import FAQPage from '@/pages/FAQPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';

// Supply Chain Problem pages
import PostHarvestLosses from '@/pages/supplyChainProblems/PostHarvestLosses';
import LogisticsIssues from '@/pages/supplyChainProblems/LogisticsIssues';
import MarketAccess from '@/pages/supplyChainProblems/MarketAccess';
import PriceVolatility from '@/pages/supplyChainProblems/PriceVolatility';
import QualityControl from '@/pages/supplyChainProblems/QualityControl';

// Other imports
import TransporterSignUp from '@/pages/TransporterSignUp';
import ServiceProviderRegistration from '@/pages/ServiceProviderRegistration';
import SearchResultsPage from '@/pages/SearchResultsPage';
import MarketDemandHotspot from '@/pages/MarketDemandHotspot';
import TrainingEvents from '@/pages/TrainingEvents';
import QualityControlDiscussions from '@/pages/QualityControlDiscussions';
import FarmerSuccessStories from '@/pages/FarmerSuccessStories';
import MarketLinkages from '@/pages/MarketLinkages';
import ApiDocs from '@/pages/ApiDocs';
import SupplyChainAPI from '@/pages/SupplyChainAPI';
import DataJobs from '@/pages/DataJobs';
import DataManagement from '@/pages/DataManagement';
import DataStatus from '@/pages/DataStatus';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="agriconnect-theme">
          <AuthProvider>
            <Router>
              <ScrollToTop />
              <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/kilimo-ams-data" element={<KilimoAmsData />} />
                    <Route path="/logistics" element={<LogisticsSolutionsMap />} />
                    <Route path="/service-providers" element={<ServiceProviders />} />
                    <Route path="/business-marketing" element={<BusinessMarketing />} />
                    <Route path="/commodity-trading" element={<CommodityTrading />} />
                    <Route path="/community-forum" element={<CommunityForum />} />
                    <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
                    <Route path="/farmer-portal" element={<FarmerPortal />} />
                    <Route path="/supply-chain-problems" element={<SupplyChainProblems />} />
                    <Route path="/supply-chain-problems/post-harvest-losses" element={<PostHarvestLosses />} />
                    <Route path="/supply-chain-problems/logistics-issues" element={<LogisticsIssues />} />
                    <Route path="/supply-chain-problems/market-access" element={<MarketAccess />} />
                    <Route path="/supply-chain-problems/price-volatility" element={<PriceVolatility />} />
                    <Route path="/supply-chain-problems/quality-control" element={<QualityControl />} />
                    <Route path="/system-status" element={<SystemStatus />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                    <Route path="/transporter-signup" element={<TransporterSignUp />} />
                    <Route path="/service-provider-registration" element={<ServiceProviderRegistration />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/market-demand-hotspot" element={<MarketDemandHotspot />} />
                    <Route path="/training-events" element={<TrainingEvents />} />
                    <Route path="/quality-control-discussions" element={<QualityControlDiscussions />} />
                    <Route path="/farmer-success-stories" element={<FarmerSuccessStories />} />
                    <Route path="/market-linkages" element={<MarketLinkages />} />
                    <Route path="/api-docs" element={<ApiDocs />} />
                    <Route path="/supply-chain-api" element={<SupplyChainAPI />} />
                    <Route path="/data-jobs" element={<DataJobs />} />
                    <Route path="/data-management" element={<DataManagement />} />
                    <Route path="/data-status" element={<DataStatus />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
              <Toaster />
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
