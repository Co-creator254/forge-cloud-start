import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Main pages
import Index from "./pages/Index";
import CommodityTrading from "./pages/CommodityTrading";
import SupplyChainProblems from "./pages/SupplyChainProblems";
import KilimoAmsData from "./pages/KilimoAmsData";
import SystemStatusPage from "./pages/SystemStatus";

// API pages
import SupplyChainAPI from "./pages/SupplyChainAPI";
import TenderAPI from "./pages/TenderAPI";
import JobsAPI from "./pages/JobsAPI";
import ApiDocs from "./pages/ApiDocs";

// Commodity trading sub-pages
import MarketplaceView from "./pages/commodityTrading/MarketplaceView";
import BarterExchangeView from "./pages/commodityTrading/BarterExchange";
import MyTradesView from "./pages/commodityTrading/MyTrades";
import PriceTrendsView from "./pages/commodityTrading/PriceTrends";
import CommunityForums from "./pages/commodityTrading/CommunityForums";

// Supply chain problem pages
import PostHarvestLosses from "./pages/supplyChainProblems/PostHarvestLosses";
import LogisticsIssues from "./pages/supplyChainProblems/LogisticsIssues";
import MarketAccess from "./pages/supplyChainProblems/MarketAccess";
import PriceVolatility from "./pages/supplyChainProblems/PriceVolatility";
import QualityControl from "./pages/supplyChainProblems/QualityControl";

// Service provider and logistics pages
import TransporterSignUp from "./pages/TransporterSignUp";
import ServiceProviders from "./pages/ServiceProviders";
import LogisticsSolutionsMap from "./pages/LogisticsSolutionsMap";
import ServiceProviderRegistration from "./pages/ServiceProviderRegistration";
import QualityControlDiscussions from "./pages/QualityControlDiscussions";
import TrainingEvents from "./pages/TrainingEvents";
import MarketLinkages from "./pages/MarketLinkages";
import Auth from "./pages/Auth";

// Analytics and insights pages
import SentimentAnalysis from "./pages/SentimentAnalysis";
import MarketDemandHotspot from "./pages/MarketDemandHotspot";
import FarmerSuccessStories from "./pages/FarmerSuccessStories";

import NotFound from "./pages/NotFound";
import DataJobs from "./pages/DataJobs";

// Production-ready configurations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          return (error as any).status >= 500 && failureCount < 3;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    },
    mutations: {
      retry: 1
    }
  }
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/api-docs" element={<ApiDocs />} />
                
                {/* System Administration */}
                <Route 
                  path="/system-status" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <SystemStatusPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Commodity Trading Section - Protected */}
                <Route 
                  path="/commodity-trading" 
                  element={
                    <ProtectedRoute>
                      <CommodityTrading />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/commodity-trading/marketplace" 
                  element={
                    <ProtectedRoute>
                      <MarketplaceView />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/commodity-trading/barter" 
                  element={
                    <ProtectedRoute>
                      <BarterExchangeView />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/commodity-trading/my-trades" 
                  element={
                    <ProtectedRoute>
                      <MyTradesView />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/commodity-trading/price-trends" element={<PriceTrendsView />} />
                <Route 
                  path="/commodity-trading/community" 
                  element={
                    <ProtectedRoute>
                      <CommunityForums />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Supply Chain Problems Section */}
                <Route path="/supply-chain-problems" element={<SupplyChainProblems />} />
                <Route path="/supply-chain-problems/post-harvest-losses" element={<PostHarvestLosses />} />
                <Route path="/supply-chain-problems/logistics" element={<LogisticsIssues />} />
                <Route path="/supply-chain-problems/market-access" element={<MarketAccess />} />
                <Route path="/supply-chain-problems/price-volatility" element={<PriceVolatility />} />
                <Route path="/supply-chain-problems/quality-control" element={<QualityControl />} />
                
                {/* Data Integration */}
                <Route path="/kilimo-ams-data" element={<KilimoAmsData />} />
                <Route path="/data-jobs" element={<DataJobs />} />
                
                {/* API Sections */}
                <Route path="/supply-chain-api" element={<SupplyChainAPI />} />
                <Route path="/tender-api" element={<TenderAPI />} />
                <Route path="/jobs-api" element={<JobsAPI />} />

                {/* Service Provider Routes */}
                <Route path="/service-providers" element={<ServiceProviders />} />
                <Route path="/logistics-solutions-map" element={<LogisticsSolutionsMap />} />
                <Route 
                  path="/service-provider-registration" 
                  element={
                    <ProtectedRoute>
                      <ServiceProviderRegistration />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/quality-control-discussions" element={<QualityControlDiscussions />} />
                <Route path="/training-events" element={<TrainingEvents />} />
                <Route path="/market-linkages" element={<MarketLinkages />} />
                <Route 
                  path="/transporter-signup" 
                  element={
                    <ProtectedRoute>
                      <TransporterSignUp />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Analytics and insights pages */}
                <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
                <Route path="/market-demand-hotspot" element={<MarketDemandHotspot />} />
                <Route path="/farmer-success-stories" element={<FarmerSuccessStories />} />
                
                {/* Catch all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
