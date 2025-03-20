
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Main pages
import Index from "./pages/Index";
import CommodityTrading from "./pages/CommodityTrading"; // This is already a proxy to CommodityTradingPage
import SupplyChainProblems from "./pages/SupplyChainProblems";
import KilimoAmsData from "./pages/KilimoAmsData";

// API pages
import SupplyChainAPI from "./pages/SupplyChainAPI";
import TenderAPI from "./pages/TenderAPI";
import JobsAPI from "./pages/JobsAPI";
import ApiDocs from "./pages/ApiDocs";

// Commodity trading sub-pages - using new proxy components that provide props
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

// New logistics and service provider pages
import TransporterSignUp from "./pages/TransporterSignUp";

import NotFound from "./pages/NotFound";
import DataJobs from "./pages/DataJobs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main pages */}
          <Route path="/" element={<Index />} />
          
          {/* Commodity Trading Section */}
          <Route path="/commodity-trading" element={<CommodityTrading />} />
          <Route path="/commodity-trading/marketplace" element={<MarketplaceView />} />
          <Route path="/commodity-trading/barter" element={<BarterExchangeView />} />
          <Route path="/commodity-trading/my-trades" element={<MyTradesView />} />
          <Route path="/commodity-trading/price-trends" element={<PriceTrendsView />} />
          <Route path="/commodity-trading/community" element={<CommunityForums />} />
          
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
          <Route path="/api-docs" element={<ApiDocs />} />

          {/* Service Provider Routes */}
          <Route path="/transporter-signup" element={<TransporterSignUp />} />
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
