
/**
 * API Handler for AMIS Kenya API
 * This ensures consistent communication with the API with proper error handling
 */

const API_BASE_URL = "https://amis.kilimo.go.ke/en/api";

// Maximum number of retry attempts for failed API calls
const MAX_RETRIES = 2;
// Base delay for exponential backoff in milliseconds
const BASE_RETRY_DELAY = 1000;

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  queryParams?: Record<string, string>;
  fallbackReturnValue?: any;
  retries?: number;
}

// Define a generic type for API responses with results arrays
export interface AmisKeApiResponse<T> {
  results: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export class AmisKeApiHandler {
  static async get<T>(endpoint: string, queryParams?: Record<string, string>, fallbackReturnValue?: any): Promise<AmisKeApiResponse<T>> {
    return this.request<AmisKeApiResponse<T>>(endpoint, { method: 'GET', queryParams, fallbackReturnValue });
  }

  static async post<T>(endpoint: string, body: any, fallbackReturnValue?: any): Promise<AmisKeApiResponse<T>> {
    return this.request<AmisKeApiResponse<T>>(endpoint, { method: 'POST', body, fallbackReturnValue });
  }

  static async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { 
      method = 'GET', 
      body, 
      queryParams, 
      fallbackReturnValue = { results: [] } as unknown as T,
      retries = 0 
    } = options;

    // Add query parameters if they exist
    let url = `${API_BASE_URL}/${endpoint}`;
    if (queryParams) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      url += `?${params.toString()}`;
    }

    // Set up request options
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
    };

    // Add body for POST/PUT requests
    if (body && (method === 'POST' || method === 'PUT')) {
      requestOptions.body = JSON.stringify(body);
    }

    console.log(`Making ${method} request to ${url} (attempt ${retries + 1} of ${MAX_RETRIES + 1})`);
    
    try {
      const response = await fetch(url, requestOptions);

      // Check for server errors that might be temporary
      if (response.status >= 500 && response.status < 600) {
        if (retries < MAX_RETRIES) {
          // Calculate exponential backoff delay
          const delay = BASE_RETRY_DELAY * Math.pow(2, retries);
          console.log(`Server error (${response.status}), retrying in ${delay}ms...`);
          
          // Wait for the calculated delay
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Retry the request with incremented retry counter
          return this.request(endpoint, {
            ...options,
            retries: retries + 1
          });
        }
      }

      // Handle error responses
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}): ${errorText}`);
        
        // For 4xx client errors, we shouldn't retry as the request is likely invalid
        console.warn(`Request failed with status ${response.status}. Using fallback data.`);
        return fallbackReturnValue;
      }

      // Parse and return JSON response
      return response.json() as Promise<T>;
    } catch (error) {
      // Network errors or JSON parsing errors
      console.error(`Failed to connect to API (${endpoint}):`, error);
      
      // Retry for network errors (likely connectivity issues)
      if (retries < MAX_RETRIES) {
        const delay = BASE_RETRY_DELAY * Math.pow(2, retries);
        console.log(`Network error, retrying in ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.request(endpoint, {
          ...options,
          retries: retries + 1
        });
      }
      
      if (typeof fallbackReturnValue !== 'undefined') {
        console.log(`Maximum retries reached. Using fallback data for ${endpoint}`);
        return fallbackReturnValue;
      }
      
      throw error;
    }
  }
  
  // New helper method to check if API is reachable
  static async checkApiHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health-check`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
      });
      
      return response.ok;
    } catch (error) {
      console.warn('API health check failed:', error);
      return false;
    }
  }
}

export default AmisKeApiHandler;
