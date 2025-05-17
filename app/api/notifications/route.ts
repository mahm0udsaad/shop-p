import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get search parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeRead = searchParams.get('includeRead') === 'true';

    // Get the user session from cookies
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get unread notification count
    const { count: unreadCount, error: countError } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (countError) {
      return NextResponse.json({ error: 'Error fetching notification count' }, { status: 500 });
    }

    // Build query for notifications
    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Only include unread notifications if specified
    if (!includeRead) {
      query = query.eq("read", false);
    }

    // Get notifications
    const { data: notificationsData, error: notificationsError } = await query;

    if (notificationsError) {
      return NextResponse.json({ error: 'Error fetching notifications' }, { status: 500 });
    }

    // Transform to camelCase keys for frontend consistency
    const notifications = notificationsData.map(notification => ({
      id: notification.id,
      userId: notification.user_id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      read: notification.read,
      data: notification.data,
      createdAt: notification.created_at,
      updatedAt: notification.updated_at
    }));

    return NextResponse.json({
      notifications,
      unreadCount: unreadCount || 0,
      userId
    });
  } catch (error) {
    console.error('Error in notifications API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 