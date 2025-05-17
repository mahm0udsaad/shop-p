import { Notification } from '@/types/notifications';
import { NotificationBell } from '@/components/dashboard/notification-bell';
import { createClient } from '@/lib/supabase/server';

// Transform DB notification to frontend format
const transformNotification = (notification: any): Notification => ({
  id: notification.id,
  userId: notification.user_id,
  title: notification.title,
  message: notification.message,
  type: notification.type,
  read: notification.read,
  data: notification.data,
  createdAt: notification.created_at,
  updatedAt: notification.updated_at
});

export async function NotificationLoader() {
  const supabase = await createClient();
  
  // Get the user session from cookies
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session || !session.user) {
    // If no authenticated user, return null
    console.log("NotificationLoader: No authenticated user");
    return null;
  }
  
  const userId = session.user.id;
  console.log("NotificationLoader: User ID", userId);
  
  // Get unread notification count
  const { count: unreadCount, error: countError } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);
    
  if (countError) {
    console.error("NotificationLoader: Error getting unread count", countError);
  } else {
    console.log("NotificationLoader: Unread count", unreadCount);
  }
    
  // Get most recent notifications (limit to 10)
  const { data: notificationsData, error: notificationsError } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);
    
  if (notificationsError) {
    console.error("NotificationLoader: Error getting notifications", notificationsError);
  } else {
    console.log("NotificationLoader: Notifications data", notificationsData);
  }
    
  // Transform to frontend format
  const notifications = notificationsData 
    ? notificationsData.map(transformNotification)
    : [];
    
  console.log("NotificationLoader: Transformed notifications", notifications);
    
  return (
    <NotificationBell 
      userId={userId}
      initialNotifications={notifications}
      initialUnreadCount={unreadCount || 0}
    />
  );
} 