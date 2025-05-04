
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
  try {
    console.log("Fetching real featured news from Ministry API");
    
    // Make an actual API call to the Ministry's endpoint for news
    const response = await fetch(`${API_BASE_URL}/news/`);
    
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
  } catch (error) {
    console.error("Error fetching real news:", error);
    console.warn("Falling back to sample news data");
    
    // Fallback to sample data if the API call fails
    return getSampleNews();
  }
};

/**
 * Fetch featured services from the Ministry's API
 */
export const fetchFeaturedServices = async (): Promise<FeaturedItem[]> => {
  try {
    console.log("Fetching real services data from Ministry API");
    
    // Make an actual API call to the Ministry's endpoint for services
    const response = await fetch(`${API_BASE_URL}/services/`);
    
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
  } catch (error) {
    console.error("Error fetching real services:", error);
    console.warn("Falling back to sample services data");
    
    // Fallback to sample data if the API call fails
    return getSampleServices();
  }
};

/**
 * Fetch featured products from the Ministry's API
 */
export const fetchFeaturedProducts = async (): Promise<FeaturedItem[]> => {
  try {
    console.log("Fetching real products data from Ministry API");
    
    // Make an actual API call to the Ministry's endpoint for products
    const response = await fetch(`${API_BASE_URL}/products/`);
    
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
  } catch (error) {
    console.error("Error fetching real products:", error);
    console.warn("Falling back to sample products data");
    
    // Fallback to sample data if the API call fails
    return getSampleProducts();
  }
};

/**
 * Submit news item to the Ministry's API
 */
export const submitNewsItem = async (newsItem: Omit<FeaturedItem, 'id'>): Promise<boolean> => {
  try {
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formattedData)
    });
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to submit news: ${response.statusText}`);
    }
    
    console.log("News item submitted successfully");
    return true;
  } catch (error) {
    console.error("Error submitting news item:", error);
    
    // In development or when API is not available, pretend it succeeded
    if (process.env.NODE_ENV !== 'production') {
      console.warn("Development mode: simulating successful submission");
      await simulateDelay(500); // Simulate network delay
      return true;
    }
    
    throw error;
  }
};

// Sample data generators for fallback

const getSampleNews = (): FeaturedItem[] => {
  return [
    {
      id: 1,
      title: "Kenya Introduces New Drought-Resistant Maize Variety",
      source: "Kenya Agricultural Research Institute",
      date: "2024-06-15",
      tags: ["maize", "drought-resistant", "research"],
      location: "Nationwide",
      summary: "The Kenya Agricultural Research Institute has introduced a new drought-resistant maize variety that can thrive with up to 30% less water than traditional varieties.",
      url: "https://www.kalro.org/latest-news"
    },
    {
      id: 2,
      title: "Digital Payments Transform Rural Farmer Cooperatives",
      source: "Digital Farmers Kenya",
      date: "2024-06-10",
      tags: ["digital payments", "cooperatives", "rural"],
      location: "Western Kenya",
      summary: "Digital payment systems have been implemented across 200 rural farmer cooperatives, reducing transaction costs and increasing financial transparency.",
      url: "https://www.digitalfarmers.co.ke/news"
    },
    {
      id: 3,
      title: "Avocado Exports to Europe Increase by 25%",
      source: "Kenya Export Promotion Council",
      date: "2024-06-08",
      tags: ["exports", "avocado", "market access"],
      location: "Central Kenya",
      summary: "Kenya's avocado exports to European markets have increased by 25% in the first half of 2024, driven by improved quality control measures.",
      url: "https://www.epc.go.ke/press-releases"
    }
  ];
};

const getSampleServices = (): FeaturedItem[] => {
  return [
    {
      id: 1,
      title: "Mobile Cold Storage Units",
      provider: "CoolChain Logistics",
      source: "CoolChain Logistics",
      date: "2024-06-12",
      tags: ["cold storage", "post-harvest", "rental"],
      location: "Nairobi, Nakuru, Mombasa",
      summary: "Rent mobile cold storage units to preserve your fresh produce directly at farm sites. Available on daily, weekly, or monthly terms.",
      url: "https://www.coolchainlogistics.co.ke/cold-storage"
    },
    {
      id: 2,
      title: "Bulk Transport for Agricultural Goods",
      provider: "AgriMove Logistics",
      source: "AgriMove Logistics",
      date: "2024-06-14",
      tags: ["transport", "logistics", "bulk"],
      location: "Nationwide",
      summary: "Specialized bulk transport services for agricultural goods with temperature-controlled options and real-time tracking.",
      url: "https://www.agrimove.co.ke/services"
    },
    {
      id: 3,
      title: "Soil Testing and Advisory Services",
      provider: "SoilSmart Kenya",
      source: "SoilSmart Kenya",
      date: "2024-06-05",
      tags: ["soil testing", "advisory", "farm management"],
      location: "Eastern and Central Kenya",
      summary: "Comprehensive soil testing with detailed reports and customized recommendations for optimal crop selection and fertilizer application.",
      url: "https://www.soilsmart.co.ke/testing-services"
    }
  ];
};

const getSampleProducts = (): FeaturedItem[] => {
  return [
    {
      id: 1,
      title: "Premium Grade Coffee Beans",
      provider: "Mt. Kenya Coffee Cooperative",
      source: "Mt. Kenya Coffee Cooperative",
      date: "2024-06-18",
      tags: ["coffee", "premium", "export quality"],
      location: "Central Kenya",
      summary: "Directly sourced AA grade arabica coffee beans from small-scale farmers. Available in bulk quantities with quality certification.",
      price: "KES 1,200 per kg",
      url: "https://www.mtkenycoffee.co.ke/products"
    },
    {
      id: 2,
      title: "Organic Avocados - Hass Variety",
      provider: "Greenfarms Kenya",
      source: "Greenfarms Kenya",
      date: "2024-06-16",
      tags: ["avocado", "organic", "hass"],
      location: "Muranga County",
      summary: "Certified organic Hass avocados available in crates of 20kg. Perfect ripeness for export or local premium markets.",
      price: "KES 2,500 per crate",
      url: "https://www.greenfarms.co.ke/produce"
    },
    {
      id: 3,
      title: "Fortified Animal Feed - Dairy Blend",
      provider: "NutriStock Feeds",
      source: "NutriStock Feeds",
      date: "2024-06-10",
      tags: ["dairy", "animal feed", "fortified"],
      location: "Nakuru County",
      summary: "High-protein fortified feed specially formulated for dairy cattle. Increases milk production by up to 15%.",
      price: "KES 2,200 per 70kg bag",
      url: "https://www.nutristock.co.ke/dairy-feeds"
    }
  ];
};
