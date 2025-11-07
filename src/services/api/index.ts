// Central API service exports
export { supplyChainService } from './supabase/supply-chain.service';
export { marketIntelligenceService } from './supabase/market-intelligence.service';
export { marketplaceService } from './supabase/marketplace.service';

// Re-export types
export type { SupplyChainStage, FinancialAnalysis } from './supabase/supply-chain.service';
export type { RoadMarket, MarketReport, RouteVendor, DemandHotspot } from './supabase/market-intelligence.service';
export type { ContractFarmingOpportunity, SuccessStory } from './supabase/marketplace.service';
