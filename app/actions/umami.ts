const UMAMI_URL = process.env.UMAMI_URL || "https://analytics.shipfaster.tech";
const UMAMI_USERNAME = process.env.UMAMI_USERNAME || 'admin';
const UMAMI_PASSWORD = process.env.UMAMI_PASSWORD;
const UMAMI_API_KEY = process.env.UMAMI_API_KEY; // Optional API key for direct access

// Session token cache with expiration
let sessionToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Login to Umami and get a session token
 */
async function login(): Promise<string | null> {
  try {
    // If we have a valid API key, use that instead of logging in
    if (UMAMI_API_KEY) {
      return UMAMI_API_KEY;
    }
    
    // Check if we already have a valid token
    if (sessionToken && tokenExpiry > Date.now()) {
      return sessionToken;
    }
    
    // Otherwise login
    const response = await fetch(`${UMAMI_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: UMAMI_USERNAME,
        password: UMAMI_PASSWORD
      })
    });
    
    const data = await response.json();
    
    // Check if token exists in response data
    if (data && data.token) {
      sessionToken = data.token;
      // Set expiry to 6 hours from now
      tokenExpiry = Date.now() + 6 * 60 * 60 * 1000;
      return sessionToken;
    } 
    
    // Fallback to cookie-based auth if needed
    else if (response.headers && response.headers.get('set-cookie')) {
      const cookie = response.headers.get('set-cookie')?.split(',').find(c => c.startsWith('auth='));
      if (cookie) {
        sessionToken = cookie;
        tokenExpiry = Date.now() + 6 * 60 * 60 * 1000;
        return sessionToken;
      }
    }
    
    console.error("Login succeeded but no token or cookie received");
    return null;
  } catch (error: any) {
    console.error("Login failed:", error.message);
    if (error.response) {
      console.error("Server response:", error.response.data);
    }
    return null;
  }
}

/**
 * Make an authenticated request to Umami API
 */
async function umamiRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE', 
  endpoint: string, 
  data?: any, 
  params?: any
): Promise<T | null> {
  try {
    // Get auth token
    const token = await login();
    if (!token) {
      throw new Error("Authentication failed");
    }
    
    // Prepare headers
    const headers: Record<string, string> = {};
    
    // Set auth header based on token type
    if (token.startsWith('auth=')) {
      headers['Cookie'] = token;
    } else if (UMAMI_API_KEY) {
      headers['x-umami-api-key'] = token;
    } else {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Make request
    const response = await fetch(`${UMAMI_URL}${endpoint}${params ? '?' + new URLSearchParams(params).toString() : ''}`, {
      method,
      headers,
      ...(data && { body: JSON.stringify(data) })
    });
    
    return await response.json() as T;
  } catch (error: any) {
    // If token expired, clear it and retry once
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      sessionToken = null;
      tokenExpiry = 0;
      
      // Try one more time with fresh login
      try {
        const token = await login();
        if (!token) {
          throw new Error("Authentication failed on retry");
        }
        
        const headers: Record<string, string> = {};
        if (token.startsWith('auth=')) {
          headers['Cookie'] = token;
        } else if (UMAMI_API_KEY) {
          headers['x-umami-api-key'] = token;
        } else {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${UMAMI_URL}${endpoint}${params ? '?' + new URLSearchParams(params).toString() : ''}`, {
          method,
          headers,
          ...(data && { body: JSON.stringify(data) })
        });
        
        return await response.json() as T;
      } catch (retryError: any) {
        console.error("API request retry failed:", retryError.message);
        throw retryError;
      }
    }
    
    console.error(`${method} ${endpoint} failed:`, error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    throw error;
  }
}

/**
 * Interface for a website in Umami
 */
interface UmamiWebsite {
  id: string;
  name: string;
  domain: string;
  share_id?: string;
  created_at?: string;
  user_id?: string;
}

/**
 * Create a new website in Umami
 */
export async function createUmamiWebsite(
  name: string, 
  domain: string
): Promise<UmamiWebsite | null> {
  try {
    const data = { name, domain };
    return await umamiRequest<UmamiWebsite>('POST', '/api/websites', data);
  } catch (error) {
    console.error("Failed to create website in Umami:", error);
    return null;
  }
}

/**
 * Get a website by domain
 */
export async function getWebsiteByDomain(domain: string): Promise<UmamiWebsite | null> {
  try {
    // Get all websites first
    const websites = await umamiRequest<UmamiWebsite[]>('GET', '/api/websites');
    
    if (!websites) {
      return null;
    }
    
    // Find the one matching our domain
    const website = websites.find(site => 
      site.domain === domain || site.domain.includes(domain)
    );
    
    return website || null;
  } catch (error) {
    console.error("Failed to find website by domain:", error);
    return null;
  }
}

/**
 * Enable or disable website sharing
 */
export async function setWebsiteSharing(
  websiteId: string, 
  enableSharing: boolean
): Promise<string | null> {
  try {
    if (enableSharing) {
      // Enable sharing
      const result = await umamiRequest<{share_id: string}>('POST', `/api/websites/${websiteId}/share`);
      return result?.share_id || null;
    } else {
      // Disable sharing
      await umamiRequest('DELETE', `/api/websites/${websiteId}/share`);
      return null;
    }
  } catch (error) {
    console.error("Failed to update website sharing:", error);
    return null;
  }
}

/**
 * Get website analytics data for a specific date range
 */
export async function getWebsiteAnalytics(
  websiteId: string,
  startDate: Date | number,
  endDate: Date | number,
  unit: 'day' | 'month' | 'hour' = 'day'
) {
  try {
    // Convert dates to timestamps if they're Date objects
    const startAt = typeof startDate === 'number' ? startDate : startDate.getTime();
    const endAt = typeof endDate === 'number' ? endDate : endDate.getTime();
    
    return await umamiRequest('GET', `/api/websites/${websiteId}/stats`, null, {
      startAt,
      endAt,
      unit
    });
  } catch (error) {
    console.error("Failed to get website analytics:", error);
    return null;
  }
}

/**
 * Get website metrics like top pages, referrers, etc.
 */
export async function getWebsiteMetrics(
  websiteId: string,
  metricType: 'url' | 'referrer' | 'browser' | 'os' | 'device' | 'country' | 'event',
  startDate: Date | number,
  endDate: Date | number,
  limit: number = 10
) {
  try {
    // Convert dates to timestamps if they're Date objects
    const startAt = typeof startDate === 'number' ? startDate : startDate.getTime();
    const endAt = typeof endDate === 'number' ? endDate : endDate.getTime();
    
    return await umamiRequest('GET', `/api/websites/${websiteId}/metrics`, null, {
      type: metricType,
      startAt,
      endAt,
      limit
    });
  } catch (error) {
    console.error(`Failed to get website ${metricType} metrics:`, error);
    return null;
  }
}

/**
 * Delete a website from Umami
 */
export async function deleteUmamiWebsite(websiteId: string): Promise<boolean> {
  try {
    await umamiRequest('DELETE', `/api/websites/${websiteId}`);
    return true;
  } catch (error) {
    console.error("Failed to delete website:", error);
    return false;
  }
}