import { createClient } from "@/lib/supabase/server";
import { Notification } from "@/types/notifications";

/**
 * Fetch notifications for a user
 */
export async function getUserNotifications(
  userId: string,
  limit: number = 20,
  offset: number = 0,
  includeRead: boolean = false
): Promise<{ data: Notification[]; count: number; error: any }> {
  const supabase = await createClient();
  
  let query = supabase
    .from("notifications")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (!includeRead) {
    query = query.eq("read", false);
  }
  
  const { data, error, count } = await query;
  
  // Transform to camelCase keys
  const formattedData = data?.map(notification => ({
    id: notification.id,
    userId: notification.user_id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    read: notification.read,
    data: notification.data,
    createdAt: notification.created_at,
    updatedAt: notification.updated_at
  })) || [];
  
  return {
    data: formattedData,
    count: count || 0,
    error
  };
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadNotificationCount(
  userId: string
): Promise<{ count: number; error: any }> {
  const supabase = await createClient();
  
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);
  
  return {
    count: count || 0,
    error
  };
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<{ success: boolean; error: any }> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);
  
  return {
    success: !error,
    error
  };
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(
  userId: string
): Promise<{ success: boolean; error: any }> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);
  
  return {
    success: !error,
    error
  };
}

/**
 * Delete a notification
 */
export async function deleteNotification(
  notificationId: string
): Promise<{ success: boolean; error: any }> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId);
  
  return {
    success: !error,
    error
  };
} 