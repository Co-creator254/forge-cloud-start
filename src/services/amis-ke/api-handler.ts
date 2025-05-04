
/**
 * API Handler for AMIS Kenya API
 * This ensures consistent communication with the API with proper error handling
 */

const API_BASE_URL = "https://amis.kilimo.go.ke/en/api";

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  queryParams?: Record<string, string>;
}

export class AmisKeApiHandler {
  static async get<T>(endpoint: string, queryParams?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', queryParams });
  }

  static async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  static async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, queryParams } = options;

    // Add query parameters if they exist
    let url = `${API_BASE_URL}/${endpoint}`;
    if (queryParams) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        params.append(key, value);
      });
      url += `?${params.toString()}`;
    }

    // Set up request options
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
    };

    // Add body for POST/PUT requests
    if (body && (method === 'POST' || method === 'PUT')) {
      requestOptions.body = JSON.stringify(body);
    }

    console.log(`Making ${method} request to ${url}`);
    const response = await fetch(url, requestOptions);

    // Handle error responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`API request failed (${response.status}): ${response.statusText}`);
    }

    // Parse and return JSON response
    return response.json() as Promise<T>;
  }
}

export default AmisKeApiHandler;
