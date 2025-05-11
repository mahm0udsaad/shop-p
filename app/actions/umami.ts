const UMAMI_URL = process.env.UMAMI_URL || "https://analytics.shipfaster.tech";
const USERNAME = process.env.UMAMI_USERNAME || 'admin';
const PASSWORD = process.env.UMAMI_PASSWORD;
const UMAMI_API_KEY = process.env.UMAMI_API_KEY; // Optional API key for direct access

// Session storage
let sessionToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Login to Umami and get a session token
 */
async function login(): Promise<boolean> {
  try {
    const response = await fetch(`${UMAMI_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: USERNAME,
        password: PASSWORD
      })
    });

    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if token exists in response data
    if (data && data.token) {
      sessionToken = data.token;
      console.log("Login successful, got token");
      return true;
    }
    
    // Fallback to cookie-based auth if needed
    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      const authCookie = cookies.split(';').find(c => c.trim().startsWith('auth='));
      if (authCookie) {
        sessionToken = authCookie.trim();
        console.log("Login successful, got cookie");
        return true;
      }
    }
    
    console.error("Login succeeded but no token or cookie received");
    return false;
  } catch (error) {
    console.error("Login failed:", error instanceof Error ? error.message : String(error));
    return false;
  }
}

/**
 * Make an authenticated request to Umami API
 */
async function makeUmamiRequest(method: string, endpoint: string, data: any = null, params: Record<string, string | number> = {}) {
  // Ensure we have a session token
  if (!sessionToken && !(await login())) {
    console.error("Could not authenticate with Umami");
    return null;
  }

  try {
    // Prepare headers with token
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // Check if token is a cookie or JWT
    if (sessionToken && sessionToken.startsWith('auth=')) {
      headers['Cookie'] = sessionToken;
    } else if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }

    // Build URL with query parameters
    const url = new URL(`${UMAMI_URL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    const config: RequestInit = {
      method: method.toUpperCase(),
      headers,
    };

    if (data && (method.toLowerCase() === 'post' || method.toLowerCase() === 'put')) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url.toString(), config);

    if (!response.ok) {
      // If unauthorized, try to login again
      if (response.status === 401 || response.status === 403) {
        console.log("Session expired, attempting to re-login...");
        if (await login()) {
          return makeUmamiRequest(method, endpoint, data, params); // Retry with new token
        }
      }
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(`Error with ${method.toUpperCase()} request to ${endpoint}:`, 
      error instanceof Error ? error.message : String(error));
    return { error: error instanceof Error ? error.message : String(error) };
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
export async function createUmamiWebsite(name: string, domain: string): Promise<UmamiWebsite | null> {
  // Generate a unique website name with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const websiteData = {
    name: `${name} (${timestamp})`,
    domain: domain,
    shareId: null
  };
  
  console.log(`Creating Umami website: ${websiteData.name}`);
  
  const website = await makeUmamiRequest('post', '/api/websites', websiteData);
  
  if (website && website.id) {
    console.log("Website created successfully:", website);
    return website;
  } else {
    console.error("Failed to create website");
    return null;
  }
}

/**
 * Get a website by domain
 */
export async function getWebsiteByDomain(domain: string): Promise<UmamiWebsite | null> {
  const websites = await makeUmamiRequest('get', '/api/websites');
  if (websites && Array.isArray(websites)) {
    return websites.find(website => website.domain === domain);
  }
  return null;
}

/**
 * Enable or disable website sharing
 */
export async function setWebsiteSharing(websiteId: string, enable: boolean): Promise<string | null> {
  const website = await makeUmamiRequest('put', `/api/websites/${websiteId}`, {
    enableShare: enable
  });
  return website?.shareId || null;
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
    
    return await makeUmamiRequest('get', `/api/websites/${websiteId}/stats`, null, {
      startAt: String(startAt),
      endAt: String(endAt),
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
    
    return await makeUmamiRequest('get', `/api/websites/${websiteId}/metrics`, null, {
      type: metricType,
      startAt: String(startAt),
      endAt: String(endAt),
      limit: String(limit)
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
    await makeUmamiRequest('delete', `/api/websites/${websiteId}`);
    return true;
  } catch (error) {
    console.error("Failed to delete website:", error);
    return false;
  }
}