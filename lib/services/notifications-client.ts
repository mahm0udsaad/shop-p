import { createClient } from '@supabase/supabase-js';
import { Notification } from "@/types/notifications";

/**
 * Fetch notifications for a user (client-side version)
 */
export async function getUserNotificationsClient(
  userId: string,
  limit: number = 20,
  offset: number = 0,
  includeRead: boolean = false
): Promise<{ data: Notification[]; count: number; error: any }> {
  try {
    // Build query string with parameters
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      includeRead: includeRead.toString()
    });

    const response = await fetch(`/api/notifications?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // This ensures cookies are sent with the request
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch notifications');
    }

    return {
      data: result.notifications || [],
      count: result.unreadCount || 0,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return {
      data: [],
      count: 0,
      error,
    };
  }
}

/**
 * Get unread notification count for a user (client-side version)
 */
export async function getUnreadNotificationCountClient(
  userId: string
): Promise<{ count: number; error: any }> {
  try {
    // Just get the count from the notifications endpoint with a limit of 0
    const queryParams = new URLSearchParams({
      limit: '0',
      offset: '0',
      includeRead: 'false'
    });

    const response = await fetch(`/api/notifications?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // This ensures cookies are sent with the request
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch unread notification count');
    }

    return {
      count: result.unreadCount || 0,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    return {
      count: 0,
      error,
    };
  }
}

/**
 * Mark a notification as read (client-side version)
 */
export async function markNotificationAsReadClient(
  notificationId: string
): Promise<{ success: boolean; error: any }> {
  try {
    const response = await fetch('/api/notifications/mark-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // This ensures cookies are sent with the request
      body: JSON.stringify({ notificationId }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to mark notification as read');
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return {
      success: false,
      error,
    };
  }
}

/**
 * Mark all notifications as read for a user (client-side version)
 */
export async function markAllNotificationsAsReadClient(
  userId: string
): Promise<{ success: boolean; error: any }> {
  try {
    const response = await fetch('/api/notifications/mark-all-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // This ensures cookies are sent with the request
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to mark all notifications as read');
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return {
      success: false,
      error,
    };
  }
}

/**
 * Delete a notification (client-side version)
 */
export async function deleteNotificationClient(
  notificationId: string
): Promise<{ success: boolean; error: any }> {
  try {
    const response = await fetch(`/api/notifications/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // This ensures cookies are sent with the request
      body: JSON.stringify({ notificationId }),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Failed to delete notification');
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return {
      success: false,
      error,
    };
  }
} 