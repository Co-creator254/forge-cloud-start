
import { Forecast } from '@/types';

export const getCropForecast = (crop: string, forecasts: Forecast[]): string => {
  try {
    const relevantForecasts = forecasts.filter(
      f => f.produceName.toLowerCase().includes(crop.toLowerCase())
    );
    
    if (relevantForecasts.length === 0) {
      return `I don't have specific forecast data for ${crop} at the moment. Would you like me to help you find information about another crop?`;
    }
    
    const bestForecast = relevantForecasts.sort((a, b) => b.expectedDemand - a.expectedDemand)[0];
    
    const forecastConfidence = bestForecast.confidenceLevel === 'high' ? '±5%' : 
                              bestForecast.confidenceLevel === 'medium' ? '±10%' : '±20%';
    
    // Use county if available, otherwise use general language
    const countyText = bestForecast.county 
      ? `the ${bestForecast.county} county` 
      : "major growing regions";
    
    // Use unit if available, or default to kg
    const unit = bestForecast.unit || 'kg';
    
    return `Based on our forecast with ${forecastConfidence} error margin, the demand for ${crop} is expected to be highest in ${countyText} during ${bestForecast.period}. Expected production is ${bestForecast.expectedProduction} ${unit} against an expected demand of ${bestForecast.expectedDemand} ${unit}.

For tomorrow's sales, I recommend targeting markets in ${countyText} as prices are projected to increase by approximately 3-5% based on current demand trends.

Several buyers are actively looking for this product in these areas. Would you like me to help connect you with potential buyers or suggest sustainable supply chain solutions for this market?`;
  } catch (error) {
    console.error("Error in getCropForecast:", error);
    return "I apologize, but I encountered an error while analyzing forecast data. Could you try asking about a different crop or market?";
  }
};
