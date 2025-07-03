
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import DataManagement from "./pages/DataManagement";
import DataStatus from "./pages/DataStatus";
import DataJobs from "./pages/DataJobs";
import KilimoAmsData from "./pages/KilimoAmsData";
import SupplyChainAPI from "./pages/SupplyChainAPI";
import ApiDocs from "./pages/ApiDocs";
import SearchResultsPage from "./pages/SearchResultsPage";
import ServiceProviders from "./pages/ServiceProviders";
import ServiceProviderRegistration from "./pages/ServiceProviderRegistration";
import TransporterSignUp from "./pages/TransporterSignUp";
import Logistics from "./pages/Logistics";
import LogisticsSolutionsMap from "./pages/LogisticsSolutionsMap";
import TrainingEvents from "./pages/TrainingEvents";
import MarketLinkages from "./pages/MarketLinkages";
import CommunityForum from "./pages/CommunityForum";
import QualityControlDiscussions from "./pages/QualityControlDiscussions";
import FarmerPortal from "./pages/FarmerPortal";
import BusinessMarketing from "./pages/BusinessMarketing";
import SentimentAnalysis from "./pages/SentimentAnalysis";
import MarketDemandHotspot from "./pages/MarketDemandHotspot";
import SupplyChainProblems from "./pages/SupplyChainProblems";
import SystemStatus from "./pages/SystemStatus";
import FarmerSuccessStories from "./pages/FarmerSuccessStories";
import CommodityTrading from "./pages/CommodityTrading";
import FarmerExporterCollaboration from "./pages/FarmerExporterCollaboration";
import ExporterProfile from "./pages/ExporterProfile";
import NotFound from "./pages/NotFound";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import FAQPage from "./pages/FAQPage";

// Supply Chain Problems Pages
import LogisticsIssues from "./pages/supplyChainProblems/LogisticsIssues";
import MarketAccess from "./pages/supplyChainProblems/MarketAccess";
import PostHarvestLosses from "./pages/supplyChainProblems/PostHarvestLosses";
import PriceVolatility from "./pages/supplyChainProblems/PriceVolatility";
import QualityControl from "./pages/supplyChainProblems/QualityControl";

// Commodity Trading Pages
import BarterExchange from "./pages/commodityTrading/BarterExchange";
import MarketplaceView from "./pages/commodityTrading/MarketplaceView";
import MyTrades from "./pages/commodityTrading/MyTrades";
import PriceTrends from "./pages/commodityTrading/PriceTrends";
import CommunityForums from "./pages/commodityTrading/CommunityForums";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-background flex flex-col">
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/profile" element={<Profile />} />
                    
                    {/* Data Management Routes */}
                    <Route path="/data-management" element={<DataManagement />} />
                    <Route path="/data-status" element={<DataStatus />} />
                    <Route path="/data-jobs" element={<DataJobs />} />
                    <Route path="/kilimo-ams-data" element={<KilimoAmsData />} />
                    
                    {/* API Routes */}
                    <Route path="/supply-chain-api" element={<SupplyChainAPI />} />
                    <Route path="/api-docs" element={<ApiDocs />} />
                    
                    {/* Search */}
                    <Route path="/search" element={<SearchResultsPage />} />
                    
                    {/* Service Providers & Logistics */}
                    <Route path="/service-providers" element={<ServiceProviders />} />
                    <Route path="/service-provider-registration" element={<ServiceProviderRegistration />} />
                    <Route path="/transporter-signup" element={<TransporterSignUp />} />
                    <Route path="/logistics" element={<Logistics />} />
                    <Route path="/logistics-solutions-map" element={<LogisticsSolutionsMap />} />
                    
                    {/* Training & Market Linkages */}
                    <Route path="/training-events" element={<TrainingEvents />} />
                    <Route path="/market-linkages" element={<MarketLinkages />} />
                    
                    {/* Community */}
                    <Route path="/community-forum" element={<CommunityForum />} />
                    <Route path="/quality-control-discussions" element={<QualityControlDiscussions />} />
                    
                    {/* Farmer Portal */}
                    <Route path="/farmer-portal" element={<FarmerPortal />} />
                    <Route path="/farmer-success-stories" element={<FarmerSuccessStories />} />
                    
                    {/* Business & Marketing */}
                    <Route path="/business-marketing" element={<BusinessMarketing />} />
                    
                    {/* Analytics & Insights */}
                    <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
                    <Route path="/market-demand-hotspot" element={<MarketDemandHotspot />} />
                    
                    {/* Supply Chain Problems */}
                    <Route path="/supply-chain-problems" element={<SupplyChainProblems />} />
                    <Route path="/supply-chain-problems/logistics-issues" element={<LogisticsIssues />} />
                    <Route path="/supply-chain-problems/market-access" element={<MarketAccess />} />
                    <Route path="/supply-chain-problems/post-harvest-losses" element={<PostHarvestLosses />} />
                    <Route path="/supply-chain-problems/price-volatility" element={<PriceVolatility />} />
                    <Route path="/supply-chain-problems/quality-control" element={<QualityControl />} />
                    
                    {/* Commodity Trading */}
                    <Route path="/commodity-trading" element={<CommodityTrading />} />
                    <Route path="/commodity-trading/barter-exchange" element={<BarterExchange />} />
                    <Route path="/commodity-trading/marketplace" element={<MarketplaceView />} />
                    <Route path="/commodity-trading/my-trades" element={<MyTrades />} />
                    <Route path="/commodity-trading/price-trends" element={<PriceTrends />} />
                    <Route path="/commodity-trading/community-forums" element={<CommunityForums />} />
                    
                    {/* Farmer-Exporter Collaboration */}
                    <Route path="/farmer-exporter-collaboration" element={<FarmerExporterCollaboration />} />
                    <Route path="/exporter-profile" element={<ExporterProfile />} />
                    
                    {/* System */}
                    <Route path="/system-status" element={<SystemStatus />} />
                    
                    {/* Legal Pages */}
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
