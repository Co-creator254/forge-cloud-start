
import { MarketLinkage } from '@/types';

export const mockMarketLinkages: MarketLinkage[] = [
  {
    id: "1",
    name: "Fresh Produce Export Program",
    type: "vertical",
    description: "Direct linkage between smallholder farmers and European export markets for fresh fruits and vegetables. Includes quality control support, logistics coordination, and fair pricing agreements.",
    providerId: "provider1",
    providerName: "Kenya Export Promotions",
    markets: ["European Union", "Middle East"],
    crops: ["avocados", "french beans", "snow peas", "mangoes"],
    requirements: "GlobalGAP certification, minimum 5 acres combined production, consistent quality",
    benefits: "Premium prices, long-term contracts, technical assistance, export logistics handled",
    contactInfo: "exports@kenyaexport.org | +254 712 345 678"
  },
  {
    id: "2",
    name: "Nairobi Hotels Supply Chain",
    type: "vertical",
    description: "Program connecting vegetable farmers with high-end hotels and restaurants in Nairobi. Regular weekly orders with fixed prices and quality specifications.",
    providerId: "provider2",
    providerName: "Urban Fresh Link",
    markets: ["Nairobi Hotels", "Upscale Restaurants"],
    crops: ["tomatoes", "onions", "carrots", "spinach", "herbs"],
    requirements: "Consistent quality, timely delivery, food safety practices documentation",
    benefits: "Weekly guaranteed orders, premium pricing, payment within 14 days",
    contactInfo: "supply@urbanfresh.co.ke | +254 723 456 789"
  },
  {
    id: "3",
    name: "Maize Producers Cooperative",
    type: "horizontal",
    description: "Farmer-owned cooperative for collective marketing of maize. Members pool resources for storage, transportation, and negotiation with large buyers.",
    providerId: "provider3",
    providerName: "Trans Nzoia Farmers Cooperative",
    markets: ["NCPB", "Large Millers", "Institutional Buyers"],
    crops: ["maize"],
    requirements: "Membership fee, quality standards adherence, minimum delivery quantities",
    benefits: "Better prices through collective bargaining, storage facilities, bulk transport",
    contactInfo: "info@transnzoiafarmers.co.ke | +254 734 567 890"
  },
  {
    id: "4",
    name: "Dairy Processing Direct Supply",
    type: "vertical",
    description: "Direct supply arrangement between dairy farmers and processing companies. Includes milk collection points, quality testing, and consistent pricing.",
    providerId: "provider4",
    providerName: "Highland Dairy Processors",
    markets: ["Dairy Processing Plants"],
    crops: ["milk"],
    requirements: "Minimum hygiene standards, regular supply commitment, quality testing compliance",
    benefits: "Stable pricing, regular income, bonuses for premium quality, veterinary support",
    contactInfo: "farmers@highlanddairy.co.ke | +254 745 678 901"
  },
  {
    id: "5",
    name: "Organic Farmers Market Network",
    type: "horizontal",
    description: "Network of organic farmers who jointly market and sell their produce at weekly farmers markets in major towns. Includes shared branding and certification.",
    providerId: "provider5",
    providerName: "Kenya Organic Network",
    markets: ["Urban Farmers Markets", "Health Food Stores"],
    crops: ["vegetables", "fruits", "herbs", "honey"],
    requirements: "Organic practices (certification preferred but not required), quality standards",
    benefits: "Direct consumer sales, premium pricing, shared marketing costs, knowledge exchange",
    contactInfo: "join@organickenya.org | +254 756 789 012"
  },
  {
    id: "6",
    name: "Contract Farming for Processing",
    type: "vertical",
    description: "Contract farming program for vegetables destined for freezing and canning. Fixed seasonal contracts with predetermined prices and quantities.",
    providerId: "provider6",
    providerName: "Fresh Valley Processors",
    markets: ["Food Processing Industry"],
    crops: ["green peas", "sweet corn", "green beans", "carrots"],
    requirements: "Minimum acreage, adherence to planting schedule, pesticide use protocols",
    benefits: "Guaranteed market, fixed prices, input support, technical assistance",
    contactInfo: "contracts@freshvalley.co.ke | +254 767 890 123"
  },
  {
    id: "7",
    name: "Coffee Growers Association",
    type: "horizontal",
    description: "Association of coffee farmers who collectively process, grade, and market their coffee beans. Focus on quality improvement and direct trade relationships.",
    providerId: "provider7",
    providerName: "Central Kenya Coffee Growers",
    markets: ["Direct Trade Buyers", "Coffee Auctions", "Specialty Markets"],
    crops: ["coffee"],
    requirements: "Membership fee, quality standards, processing practices compliance",
    benefits: "Better prices, shared processing facilities, certification support, training",
    contactInfo: "info@centralkenyacoffee.co.ke | +254 778 901 234"
  },
  {
    id: "8",
    name: "School Feeding Program Supply",
    type: "vertical",
    description: "Direct supply linkage between local farmers and school feeding programs. Focuses on staple foods with consistent demand and simplified procurement.",
    providerId: "provider8",
    providerName: "Nutrition for Education Initiative",
    markets: ["Public Schools", "Education Institutions"],
    crops: ["maize", "beans", "potatoes", "vegetables"],
    requirements: "Food safety standards, consistent supply capability, local location",
    benefits: "Guaranteed market, prompt payment, social impact, reduced transport costs",
    contactInfo: "supply@nutritionforeducation.org | +254 789 012 345"
  }
];
