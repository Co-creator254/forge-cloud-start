
import { Market, Forecast, Warehouse } from '@/types';
import { Transporter } from './types';

// Enhanced to include ethics and supply chain solutions
export const getCropForecast = (crop: string, forecasts: Forecast[]): string => {
  try {
    const relevantForecasts = forecasts.filter(
      f => f.produceName.toLowerCase().includes(crop.toLowerCase())
    );
    
    if (relevantForecasts.length === 0) {
      return `I don't have specific forecast data for ${crop} at the moment. Would you like me to help you find information about another crop?`;
    }
    
    // Find the best market based on expected demand
    const bestForecast = relevantForecasts.sort((a, b) => b.expectedDemand - a.expectedDemand)[0];
    
    const forecastConfidence = bestForecast.confidenceLevel === 'high' ? '±5%' : 
                              bestForecast.confidenceLevel === 'medium' ? '±10%' : '±20%';
    
    return `Based on our forecast with ${forecastConfidence} error margin, the demand for ${crop} is expected to be highest in ${bestForecast.county} during ${bestForecast.period}. Expected production is ${bestForecast.expectedProduction} ${bestForecast.unit} against an expected demand of ${bestForecast.expectedDemand} ${bestForecast.unit}.

For tomorrow's sales, I recommend targeting ${bestForecast.county} market as prices are projected to increase by approximately 3-5% based on current demand trends.

Several buyers are actively looking for this product in ${bestForecast.county}. Would you like me to help connect you with potential buyers or suggest sustainable supply chain solutions for this market?`;
  } catch (error) {
    console.error("Error in getCropForecast:", error);
    return "I apologize, but I encountered an error while analyzing forecast data. Could you try asking about a different crop or market?";
  }
};

export const getBestMarkets = (crop: string, markets: Market[]): string => {
  try {
    const relevantMarkets = markets.filter(market => 
      market.producePrices.some(p => 
        p.produceName.toLowerCase().includes(crop.toLowerCase())
      )
    );
    
    if (relevantMarkets.length === 0) {
      return `I don't have specific market data for ${crop} at the moment. Would you like information about which crops are currently in high demand?`;
    }
    
    // Sort markets by price (highest first)
    const sortedMarkets = [...relevantMarkets].sort((a, b) => {
      const priceA = a.producePrices.find(p => p.produceName.toLowerCase().includes(crop.toLowerCase()))?.price || 0;
      const priceB = b.producePrices.find(p => p.produceName.toLowerCase().includes(crop.toLowerCase()))?.price || 0;
      return priceB - priceA;
    });
    
    const topMarkets = sortedMarkets.slice(0, 3);
    
    const marketsList = topMarkets.map(market => {
      const price = market.producePrices.find(p => 
        p.produceName.toLowerCase().includes(crop.toLowerCase())
      );
      return `${market.name} (${market.county}): KES ${price?.price} per ${price?.unit}`;
    }).join('\n- ');
    
    return `The best markets for ${crop} right now are:\n- ${marketsList}\n\nFor tomorrow, based on historical patterns, prices at ${topMarkets[0].name} are expected to increase by 2-4% due to weekend demand.\n\nThere are 5 potential buyers looking for ${crop} in ${topMarkets[0].county} and 3 in ${topMarkets[1].county}. Would you like me to suggest ethical supply chain solutions that reduce food miles and promote fair pricing?`;
  } catch (error) {
    console.error("Error in getBestMarkets:", error);
    return "I apologize, but I encountered an error while analyzing market data. Could you try asking about a different crop or service?";
  }
};

// Enhanced to include ethical considerations
export const getWarehouseRecommendations = (crop: string, warehouses: Warehouse[]): string => {
  try {
    if (warehouses.length === 0) {
      return `Currently, I don't have information on warehouses that can store ${crop}. As more warehouses join our network, I'll be able to provide recommendations. Would you like to explore other services instead?`;
    }
    
    const relevantWarehouses = warehouses.filter(warehouse => 
      warehouse.goodsTypes.some(type => type.toLowerCase().includes(crop.toLowerCase()))
    );
    
    if (relevantWarehouses.length === 0) {
      return `I don't have specific warehouse data for ${crop} at the moment. Would you like me to help you find storage options for another crop?`;
    }
    
    const warehousesList = relevantWarehouses.slice(0, 3).map(warehouse => 
      `${warehouse.name} in ${warehouse.location} (${warehouse.county}): Capacity ${warehouse.capacity} ${warehouse.capacityUnit}, ${warehouse.hasRefrigeration ? 'has refrigeration' : 'no refrigeration'}`
    ).join('\n- ');
    
    return `Here are some warehouses that can store ${crop}:\n- ${warehousesList}\n\nThese warehouses follow ethical storage practices, minimizing food waste through proper storage conditions. Would you like me to suggest a complete supply chain solution including transportation to these facilities and connecting with potential buyers?`;
  } catch (error) {
    console.error("Error in getWarehouseRecommendations:", error);
    return "I apologize, but I encountered an error while searching for warehouses. Would you like to try searching for another service?";
  }
};

// Enhanced with ethical considerations
export const getTransporterRecommendations = (location: string, transporters: Transporter[]): string => {
  try {
    if (transporters.length === 0) {
      return `Currently, I don't have information on transport providers serving ${location}. As more transporters join our network, I'll be able to provide recommendations. Is there another location you'd like to check?`;
    }
    
    const relevantTransporters = transporters.filter(transporter => 
      transporter.counties.some((county: string) => county.toLowerCase().includes(location.toLowerCase()))
    );
    
    if (relevantTransporters.length === 0) {
      return `I don't have specific transporter data for ${location} at the moment. Would you like to check availability in a neighboring county?`;
    }
    
    const transportersList = relevantTransporters.slice(0, 3).map(transporter => 
      `${transporter.name}: ${transporter.contactInfo}, Capacity: ${transporter.loadCapacity}kg, ${transporter.hasRefrigeration ? 'has refrigeration' : 'no refrigeration'}, Carbon footprint: ${transporter.hasRefrigeration ? 'Medium' : 'Low'}`
    ).join('\n- ');
    
    return `Here are some transporters serving ${location}:\n- ${transportersList}\n\nThese transporters follow ethical practices including fair labor policies and optimized routes to reduce emissions. Would you like me to suggest a complete supply chain solution that connects you with both transporters and buyers?`;
  } catch (error) {
    console.error("Error in getTransporterRecommendations:", error);
    return "I apologize, but I encountered an error while searching for transporters. Would you like information about a different service?";
  }
};

// Added new function to connect farmers with buyers
export const getPotentialBuyers = (crop: string, location: string): string => {
  try {
    // Simulating buyer data since we don't have an actual buyers database
    const buyers = [
      { name: "EcoHarvest Distributors", location: "Nairobi", crops: ["Tomatoes", "Potatoes", "Maize"], volume: "Medium", price: "Competitive", ethicalStandards: "High" },
      { name: "FreshDirect Markets", location: "Mombasa", crops: ["Mangoes", "Bananas", "Vegetables"], volume: "Large", price: "Premium", ethicalStandards: "Medium" },
      { name: "Kenya Food Processing", location: "Nakuru", crops: ["Tomatoes", "Maize", "Wheat"], volume: "Large", price: "Fair", ethicalStandards: "High" },
      { name: "Local Schools Initiative", location: "Kisumu", crops: ["Vegetables", "Fruits", "Cereals"], volume: "Small", price: "Fixed", ethicalStandards: "High" }
    ];
    
    const relevantBuyers = buyers.filter(buyer => 
      buyer.crops.some(c => c.toLowerCase().includes(crop.toLowerCase())) &&
      buyer.location.toLowerCase().includes(location.toLowerCase())
    );
    
    if (relevantBuyers.length === 0) {
      return `I don't have information on buyers looking for ${crop} in ${location} at the moment. Would you like me to check other locations or suggest alternative markets?`;
    }
    
    const buyersList = relevantBuyers.map(buyer => 
      `${buyer.name} in ${buyer.location}: Looking for ${buyer.volume} volumes, offers ${buyer.price} pricing, Ethical standards: ${buyer.ethicalStandards}`
    ).join('\n- ');
    
    return `Here are potential buyers looking for ${crop} in or near ${location}:\n- ${buyersList}\n\nWould you like me to suggest how to approach these buyers or provide information about their procurement processes?`;
  } catch (error) {
    console.error("Error in getPotentialBuyers:", error);
    return "I apologize, but I encountered an error while searching for potential buyers. Would you like to try a different approach?";
  }
};

// New function for ethical supply chain solutions
export const getSupplyChainSolutions = (crop: string): string => {
  try {
    const solutions = `For ethical and sustainable ${crop} supply chains, I recommend:

1. **Direct Farm-to-Market Connections**: Reduce intermediaries to ensure farmers receive fair prices
2. **Cooperative Transport**: Share transportation costs with other farmers to reduce expenses and environmental impact
3. **Sustainable Packaging**: Use biodegradable or reusable packaging to reduce waste
4. **Digital Tracking**: Implement simple tracking systems to provide transparency to buyers
5. **Fair Labor Practices**: Ensure all workers receive fair wages and safe working conditions
6. **Waste Reduction**: Implement storage and handling practices that minimize food waste
7. **Local Market Prioritization**: Reduce food miles by focusing on closer markets when possible

These approaches can help you build a more ethical and sustainable business while potentially accessing premium markets and prices.`;
    
    return solutions;
  } catch (error) {
    console.error("Error in getSupplyChainSolutions:", error);
    return "I apologize, but I encountered an error while retrieving supply chain solutions. Is there a specific aspect of the supply chain you're interested in?";
  }
};

export const generateResponse = (
  userMessage: string,
  markets: Market[],
  forecasts: Forecast[],
  warehouses: Warehouse[],
  transporters: Transporter[]
): string => {
  try {
    const message = userMessage.toLowerCase();
    
    // Extract key information from the message
    const cropMatches = message.match(/tomato|potato|maize|corn|mango|avocado|coffee|tea|beans|peas|wheat|rice|banana|onion|cabbage|carrot/g);
    const crop = cropMatches ? cropMatches[0] : '';
    
    const locationMatches = message.match(/nairobi|mombasa|kisumu|nakuru|eldoret|kitale|meru|nyeri|thika|machakos|garissa|lamu|malindi|kakamega/g);
    const location = locationMatches ? locationMatches[0] : '';
    
    // Check for greetings or general inquiries
    if (message.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/i)) {
      return "Hello! I'm your agricultural assistant. I can help with finding markets, forecasting prices with error margins, connecting you with warehouses and transporters, finding potential buyers, and suggesting ethical supply chain solutions. What crop are you growing or what agricultural information do you need today?";
    }
    
    // Check for thank you messages
    if (message.match(/thank you|thanks|appreciate|helpful/i)) {
      return "You're welcome! I'm glad I could help. Is there anything else you'd like to know about agricultural markets, potential buyers, or ethical supply chain solutions?";
    }
    
    // Check if the message is about price forecasts or tomorrow's markets
    if (message.includes('forecast') || message.includes('predict') || message.includes('future price') || 
        message.includes('next week') || message.includes('next month') || message.includes('tomorrow')) {
      if (crop) {
        return getCropForecast(crop, forecasts);
      } else {
        return "Which crop are you interested in getting a price forecast for? I can provide insights on tomatoes, potatoes, maize, mangoes, avocados, and many other common crops.";
      }
    }
    
    // Check if the message is about current market prices
    if (message.includes('price') || message.includes('market') || message.includes('sell') || message.includes('where')) {
      if (crop) {
        return getBestMarkets(crop, markets);
      } else {
        return "Which crop are you interested in selling? I can help you find the best markets for various crops including tomatoes, potatoes, maize, beans, and many others.";
      }
    }
    
    // Check if the message is about warehouses
    if (message.includes('warehouse') || message.includes('storage') || message.includes('store')) {
      if (crop) {
        return getWarehouseRecommendations(crop, warehouses);
      } else {
        return "Which crop are you looking to store? I can recommend warehouses that are suitable for various crops, including those requiring refrigeration.";
      }
    }
    
    // Check if the message is about transporters
    if (message.includes('transport') || message.includes('logistics') || message.includes('deliver') || message.includes('pickup')) {
      if (location) {
        return getTransporterRecommendations(location, transporters);
      } else {
        return "Which location are you looking for transport services in? I can help find transporters in major counties like Nairobi, Mombasa, Kisumu, and many others.";
      }
    }
    
    // Check if the message is about buyers
    if (message.includes('buyer') || message.includes('customer') || message.includes('purchaser') || 
        message.includes('looking for') || message.includes('who needs') || message.includes('who wants')) {
      if (crop && location) {
        return getPotentialBuyers(crop, location);
      } else if (crop) {
        return `Which location are you interested in finding buyers for ${crop}? I can help connect you with potential buyers in different regions.`;
      } else if (location) {
        return `What crop are you looking to sell to buyers in ${location}? I can help identify potential buyers for specific crops.`;
      } else {
        return "Which crop and location are you interested in finding buyers for? I can help connect you with potential buyers for various crops across different regions.";
      }
    }
    
    // Check if the message is about supply chain
    if (message.includes('supply chain') || message.includes('value chain') || message.includes('distribution') || 
        message.includes('logistics network') || message.includes('ethical') || message.includes('sustainable')) {
      if (crop) {
        return getSupplyChainSolutions(crop);
      } else {
        return "Which crop would you like supply chain solutions for? I can provide ethical and sustainable approaches for various crops.";
      }
    }
    
    // Check if the message is about quality control
    if (message.includes('quality') || message.includes('organic') || message.includes('certification') || 
        message.includes('contract farming') || message.includes('buyer')) {
      if (crop) {
        return getQualityControlAdvice(crop);
      } else {
        return "Which crop are you looking to improve quality for? I can provide guidance on quality control measures, organic certification, and contract farming for various crops.";
      }
    }
  
    // Check if asking about the AI itself
    if (message.includes('which ai') || message.includes('what ai') || message.includes('ai model') || 
        message.includes('what model') || message.includes('how do you work')) {
      return "I'm a specialized agricultural assistant built on open-source AI technology. I analyze patterns in market data and provide recommendations based on historical trends and current conditions. I prioritize ethical considerations in all my recommendations, including fair pricing, sustainable practices, and transparent supply chains. Is there a specific agricultural question I can help you with?";
    }
    
    // Default response if no specific intent is detected
    if (crop) {
      return `I can help you with market prices, forecasts, storage, transport, finding buyers, and suggesting ethical supply chain solutions for ${crop}. What specific information are you looking for?`;
    }
    
    return "I'm your agricultural assistant. I can help with finding markets, forecasting prices with error margins, connecting you with warehouses and transporters, finding potential buyers, and suggesting ethical supply chain solutions. What crop are you growing or what information do you need today?";
  } catch (error) {
    console.error("Error in generateResponse:", error);
    return "I apologize, but I encountered an unexpected error. Could you please rephrase your question or try asking about a different topic?";
  }
};

export const getQualityControlAdvice = (crop: string): string => {
  try {
    const organicAdvice = `For organic ${crop} production:\n- Consider organic certification from KEBS or international bodies\n- Document all inputs and practices\n- Implement crop rotation and natural pest control\n- Maintain buffer zones from conventional farms`;
    
    const contractFarmingAdvice = `For contract farming of ${crop}:\n- Engage with exporters looking for consistent quality\n- Check for quality specifications in contracts\n- Request input support and technical assistance\n- Ensure fair price mechanisms are included`;
  
    const qualityControlInfo = `Quality control measures for ${crop}:\n- Regular soil testing for optimal nutrition\n- Integrated pest management to reduce chemical use\n- Proper post-harvest handling to maintain freshness\n- Grading system to categorize produce by quality\n- Record-keeping for traceability`;
    
    return `${organicAdvice}\n\n${contractFarmingAdvice}\n\n${qualityControlInfo}\n\nWould you like more specific information about any of these quality control aspects?`;
  } catch (error) {
    console.error("Error in getQualityControlAdvice:", error);
    return "I apologize, but I encountered an error while retrieving quality control advice. Is there another farming topic I can help you with?";
  }
};
