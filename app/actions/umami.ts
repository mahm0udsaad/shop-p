const UMAMI_URL = process.env.UMAMI_URL || "https://analytics.shipfaster.tech";
const USERNAME = process.env.UMAMI_USERNAME || 'admin';
const PASSWORD = process.env.UMAMI_PASSWORD;

// Store token in memory
let sessionToken: string | null = null;
let tokenExpiry: number | null = null;

const UMAMI_API_URL = process.env.NEXT_PUBLIC_UMAMI_API_URL || 'https://analytics.umami.is'

interface UmamiResponse {
  pageviews: {
    value: number
  }
  avgDuration: number
}

interface UmamiMetric {
  x: string
  y: number
}

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
    
    if (data && data.token) {
      sessionToken = data.token;
      // Set token expiry to 23 hours from now (token typically lasts 24 hours)
      tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);
      return true;
    }
    
    console.error("Login succeeded but no token received");
    return false;
  } catch (error) {
    console.error("Login failed:", error instanceof Error ? error.message : String(error));
    return false;
  }
}

/**
 * Ensure we have a valid session token
 */
async function ensureValidSession(): Promise<boolean> {
  if (!sessionToken || !tokenExpiry || Date.now() >= tokenExpiry) {
    return login();
  }
  return true;
}

/**
 * Make an authenticated request to Umami API
 */
async function makeUmamiRequest(
  method: 'get' | 'post' | 'put' | 'delete',
  endpoint: string,
  body: any = null,
  params: Record<string, string> = {}
) {
  // Ensure we have a valid session
  const isValidSession = await ensureValidSession();
  if (!isValidSession || !sessionToken) {
    throw new Error('Failed to authenticate with Umami');
  }

  const url = new URL(endpoint, UMAMI_URL);
    Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
    });

  const response = await fetch(url.toString(), {
    method,
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  });

    if (!response.ok) {
      // If unauthorized, try to login again
    if (response.status === 401) {
      sessionToken = null;
      const retrySession = await ensureValidSession();
      if (retrySession) {
        return makeUmamiRequest(method, endpoint, body, params);
        }
      }
    throw new Error(`Umami API error: ${response.statusText}`);
    }

  return response.json();
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
  const websiteData = {
    name: name,
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
): Promise<any> {
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
    return {
      pageviews: { value: 0 },
      avgDuration: 0
    };
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
): Promise<any[]> {
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
    return [];
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