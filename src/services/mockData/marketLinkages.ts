import { MarketLinkage } from '@/types';

export const mockMarketLinkages: MarketLinkage[] = [
  {
    id: "ml1",
    name: "Avocado Export Cooperative",
    type: "vertical",
    description: "Cooperative connecting small-scale avocado farmers directly with EU exporters",
    providerId: "sp6",
    providerName: "AgriLink Cooperatives",
    markets: ["European Union", "Middle East"],
    crops: ["Avocados"],
    requirements: "GlobalGAP certification, minimum 2 acres of avocado trees, consistent quality",
    benefits: "30-40% higher prices than local markets, guaranteed purchase, technical support",
    contactInfo: "avocado@agrilink.co.ke | +254712345670"
  },
  {
    id: "ml2",
    name: "Meru Potato Farmers Association",
    type: "horizontal",
    description: "Association of potato farmers in Meru County for collective bargaining and market access",
    providerId: "sp7",
    providerName: "Meru Farmers Cooperative",
    markets: ["Local processors", "Retail chains"],
    crops: ["Potatoes"],
    requirements: "Located in Meru County, minimum 1 acre potato farming, membership fee of KSh 2,000",
    benefits: "Bulk selling, collective transport, stable prices, input supplies at wholesale rates",
    contactInfo: "potatoes@merufarmers.co.ke | +254723456780"
  }
];
