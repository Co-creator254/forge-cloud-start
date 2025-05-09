
import { MarketSentimentRecord } from "@/types";

/**
 * Analyzes market reports and comments for sentiment
 */
export const analyzeMarketSentiment = async (
  commodity: string,
  county: string,
  reports: string[]
): Promise<MarketSentimentRecord | null> => {
  try {
    if (!reports.length) {
      console.warn('No reports to analyze');
      return null;
    }
    
    // Combine reports into a single text
    const reportText = reports.join("\n\n");
    
    // Send to Perplexity API for analysis
    const result = await sendToPerplexityForAnalysis(commodity, county, reportText);
    
    if (!result) {
      console.error('Failed to get sentiment analysis result');
      return null;
    }
    
    return result;
  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    return null;
  }
};

/**
 * Send data to Perplexity AI for analysis
 */
async function sendToPerplexityForAnalysis(
  commodity: string, 
  county: string, 
  text: string
): Promise<MarketSentimentRecord | null> {
  try {
    // Call Perplexity through Edge Function
    const response = await fetch('/api/analyze-sentiment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commodity,
        county,
        text
      }),
    });

    if (!response.ok) {
      throw new Error(`Error from sentiment analysis API: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Structure the response into our expected format
    return {
      id: crypto.randomUUID(),
      commodity_name: commodity,
      county: county,
      sentiment_score: data.sentimentScore || 0,
      report_count: 1,
      tags: data.tags || [],
      issues: data.issues || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to call sentiment analysis API:', error);
    return null;
  }
}
