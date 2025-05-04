
import { useToast } from "@/hooks/use-toast";

/**
 * Wrapper to handle API requests with consistent error handling and logging
 * for Ministry of Agriculture data
 */
export async function fetchWithErrorHandling<T>(
  url: string, 
  options: RequestInit = {},
  retryAttempts = 1
): Promise<T> {
  // Tracking for API performance
  const requestStart = performance.now();
  
  try {
    // Add common headers for the Ministry API
    const headers = {
      'Accept': 'application/json',
      ...options.headers,
    };
    
    // Make the API request
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Log performance
    const requestTime = performance.now() - requestStart;
    console.log(`API Request to ${url} completed in ${requestTime.toFixed(2)}ms`);
    
    // Handle non-200 responses
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText} for ${url}`);
      console.error(`Response details:`, await response.text());
      
      // Retry for 5xx errors (server errors) if attempts remain
      if (response.status >= 500 && retryAttempts > 0) {
        console.warn(`Retrying request to ${url}, ${retryAttempts} attempts remaining`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay before retry
        return fetchWithErrorHandling<T>(url, options, retryAttempts - 1);
      }
      
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    // Parse and return the JSON response
    const data = await response.json();
    return data as T;
  } catch (error) {
    // Log detailed error information
    console.error(`API Request Error for ${url}:`, error);
    
    // Rethrow to allow caller to handle
    throw error;
  }
}

/**
 * Create a dedicated error toast notification for API errors
 */
export function showApiError(errorMessage: string) {
  const { toast } = useToast();
  
  toast({
    title: "API Error",
    description: errorMessage,
    variant: "destructive",
    duration: 5000,
  });
}

/**
 * Monitor API performance and detect flickering issues
 */
export function monitorApiPerformance(apiName: string, requestTime: number, threshold = 2000) {
  if (requestTime > threshold) {
    console.warn(`Performance warning: ${apiName} API request took ${requestTime.toFixed(2)}ms, which exceeds the ${threshold}ms threshold`);
    return false;
  }
  return true;
}
