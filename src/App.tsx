
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

// Create proxy components for commodity trading sub-pages
import BarterExchange from "./features/commodityTrading/tabs/BarterExchangeTab";
import MarketplaceTab from "./features/commodityTrading/tabs/MarketplaceTab";
import MyTradesTab from "./features/commodityTrading/tabs/MyTradesTab";
import PriceTrendsTab from "./features/commodityTrading/tabs/PriceTrendsTab";

import NotFound from "./pages/NotFound";
import DataJobs from "./pages/DataJobs";

// Supply chain problem pages
import PostHarvestLosses from "./pages/supplyChainProblems/PostHarvestLosses";

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
          <Route path="/commodity-trading/marketplace" element={<MarketplaceTab />} />
          <Route path="/commodity-trading/barter" element={<BarterExchange />} />
          <Route path="/commodity-trading/my-trades" element={<MyTradesTab />} />
          <Route path="/commodity-trading/price-trends" element={<PriceTrendsTab />} />
          
          {/* Supply Chain Problems Section */}
          <Route path="/supply-chain-problems" element={<SupplyChainProblems />} />
          <Route path="/supply-chain-problems/post-harvest-losses" element={<PostHarvestLosses />} />
          
          {/* Data Integration */}
          <Route path="/kilimo-ams-data" element={<KilimoAmsData />} />
          <Route path="/data-jobs" element={<DataJobs />} />
          
          {/* API Sections */}
          <Route path="/supply-chain-api" element={<SupplyChainAPI />} />
          <Route path="/tender-api" element={<TenderAPI />} />
          <Route path="/jobs-api" element={<JobsAPI />} />
          <Route path="/api-docs" element={<ApiDocs />} />
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
