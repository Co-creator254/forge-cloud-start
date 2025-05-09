
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');

interface RequestBody {
  commodity: string;
  county: string;
  text: string;
}

interface SentimentResponse {
  sentimentScore: number;
  tags: string[];
  issues: string[];
  summary: string;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      status: 204,
    });
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  try {
    // Check API key
    if (!PERPLEXITY_API_KEY) {
      console.error('Missing Perplexity API key');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error',
        sentimentScore: 0,
        tags: [],
        issues: []
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Parse request body
    const { commodity, county, text }: RequestBody = await req.json();
    
    // Validate inputs
    if (!commodity || !county || !text) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields',
        sentimentScore: 0,
        tags: [],
        issues: []
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Create system prompt for sentiment analysis
    const systemPrompt = `
      You are a specialized agricultural market sentiment analyzer. 
      Analyze the provided text about ${commodity} in ${county}, Kenya and extract the following information:
      1. Overall sentiment score from -1.0 (extremely negative) to 1.0 (extremely positive)
      2. List of key topics/tags mentioned (max 5)
      3. List of issues or challenges mentioned (max 5)
      
      Format your response as a JSON object with these keys:
      {
        "sentimentScore": number,
        "tags": string[],
        "issues": string[],
        "summary": string
      }
      
      Base your analysis on factors like price trends, supply/demand mentions, quality comments, and market access issues.
    `;

    // Call Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Perplexity API error:', error);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const perplexityResponse = await response.json();
    const content = perplexityResponse.choices[0].message.content;
    
    // Parse the JSON response from the AI
    let sentimentData: SentimentResponse;
    try {
      sentimentData = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse Perplexity response:', e);
      throw new Error('Invalid response format from Perplexity');
    }

    // Store the analysis in our database
    const { supabaseClient } = await import("./supabaseClient.ts");
    const { data, error } = await supabaseClient.from('market_sentiment').insert([
      {
        commodity_name: commodity,
        county: county,
        sentiment_score: sentimentData.sentimentScore,
        report_count: 1,
        tags: sentimentData.tags || [],
        issues: sentimentData.issues || [],
      }
    ]);

    if (error) {
      console.error('Error inserting sentiment analysis:', error);
    }

    // Return the sentiment analysis
    return new Response(JSON.stringify(sentimentData), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing sentiment analysis:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Server error during sentiment analysis',
      sentimentScore: 0,
      tags: [],
      issues: []
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 500,
    });
  }
});
