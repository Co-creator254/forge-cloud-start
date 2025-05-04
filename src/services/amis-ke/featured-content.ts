
import { simulateDelay } from '../apiUtils';

const API_BASE_URL = "https://amis.kilimo.go.ke/en/api";

export interface FeaturedItem {
  id: number | string;
  title: string;
  source: string;
  date: string;
  tags: string[];
  location: string;
  summary: string;
  url: string;
  price?: string;
  provider?: string;
}

/**
 * Fetch featured news from the Ministry's API
 */
export const fetchFeaturedNews = async (): Promise<FeaturedItem[]> => {
  console.log("Fetching real featured news from Ministry API");
  
  // Make an actual API call to the Ministry's endpoint for news
  const response = await fetch(`${API_BASE_URL}/news/`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors'
  });
  
  if (!response.ok) {
    console.error(`API error: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch news: ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log("Received news data:", data);
  
  // Transform the API response to match our expected format
  const newsItems: FeaturedItem[] = data.results.map((item: any, index: number) => ({
    id: item.id || index + 1,
    title: item.title || item.headline,
    source: item.source || "Ministry of Agriculture",
    date: item.published_date || new Date().toISOString().split('T')[0],
    tags: item.tags ? 
          (typeof item.tags === 'string' ? item.tags.split(',').map((t: string) => t.trim()) : item.tags) : 
          ["agriculture"],
    location: item.location || "Kenya",
    summary: item.summary || item.content || item.description || "",
    url: item.url || `${API_BASE_URL}/news/${item.id}/`
  }));
  
  console.log(`Successfully fetched ${newsItems.length} news items`);
  return newsItems;
};

/**
 * Fetch featured services from the Ministry's API
 */
export const fetchFeaturedServices = async (): Promise<FeaturedItem[]> => {
  console.log("Fetching real services data from Ministry API");
  
  // Make an actual API call to the Ministry's endpoint for services
  const response = await fetch(`${API_BASE_URL}/services/`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors'
  });
  
  if (!response.ok) {
    console.error(`API error: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch services: ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log("Received services data:", data);
  
  // Transform the API response to match our expected format
  const servicesItems: FeaturedItem[] = data.results.map((item: any, index: number) => ({
    id: item.id || index + 1,
    title: item.name || item.title,
    provider: item.provider || item.organization,
    source: item.provider || item.organization,
    date: item.date_added || new Date().toISOString().split('T')[0],
    tags: item.tags ? 
          (typeof item.tags === 'string' ? item.tags.split(',').map((t: string) => t.trim()) : item.tags) : 
          ["service"],
    location: item.locations || item.coverage || "Kenya",
    summary: item.description || item.summary || "",
    url: item.url || item.website || `${API_BASE_URL}/services/${item.id}/`
  }));
  
  console.log(`Successfully fetched ${servicesItems.length} services`);
  return servicesItems;
};

/**
 * Fetch featured products from the Ministry's API
 */
export const fetchFeaturedProducts = async (): Promise<FeaturedItem[]> => {
  console.log("Fetching real products data from Ministry API");
  
  // Make an actual API call to the Ministry's endpoint for products
  const response = await fetch(`${API_BASE_URL}/products/`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors'
  });
  
  if (!response.ok) {
    console.error(`API error: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log("Received products data:", data);
  
  // Transform the API response to match our expected format
  const productsItems: FeaturedItem[] = data.results.map((item: any, index: number) => ({
    id: item.id || index + 1,
    title: item.name || item.title,
    provider: item.provider || item.seller || item.organization,
    source: item.provider || item.seller || item.organization,
    date: item.date_listed || item.date_added || new Date().toISOString().split('T')[0],
    tags: item.tags ?
          (typeof item.tags === 'string' ? item.tags.split(',').map((t: string) => t.trim()) : item.tags) : 
          ["product"],
    location: item.location || "Kenya",
    summary: item.description || item.summary || "",
    price: item.price ? `KES ${item.price}` : undefined,
    url: item.url || `${API_BASE_URL}/products/${item.id}/`
  }));
  
  console.log(`Successfully fetched ${productsItems.length} products`);
  return productsItems;
};

/**
 * Submit news item to the Ministry's API
 */
export const submitNewsItem = async (newsItem: Omit<FeaturedItem, 'id'>): Promise<boolean> => {
  console.log("Submitting news item to Ministry API", newsItem);
  
  // Format the data according to what the API expects
  const formattedData = {
    title: newsItem.title,
    source: newsItem.source,
    tags: Array.isArray(newsItem.tags) ? newsItem.tags.join(', ') : newsItem.tags,
    location: newsItem.location,
    content: newsItem.summary,
    url: newsItem.url,
    published_date: new Date().toISOString().split('T')[0]
  };
  
  // Make an actual API call to submit the news item
  const response = await fetch(`${API_BASE_URL}/news/submit/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(formattedData),
    mode: 'cors'
  });
  
  if (!response.ok) {
    console.error(`API error: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to submit news: ${response.statusText}`);
  }
  
  console.log("News item submitted successfully");
  return true;
};
