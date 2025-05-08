-- Update the get_dashboard_analytics function to fix the FROM clause issue
CREATE OR REPLACE FUNCTION get_dashboard_analytics(user_uuid UUID, days_back INTEGER DEFAULT 7)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  total_views INTEGER;
  total_orders INTEGER;
  conversion_rate NUMERIC;
  views_over_time JSONB;
  orders_over_time JSONB;
  top_referrers JSONB;
  recent_orders JSONB;
BEGIN
  -- Get total views for user's products
  SELECT COUNT(*) INTO total_views
  FROM page_views pv
  JOIN products p ON pv.product_id = p.id
  WHERE p.user_id = user_uuid
  AND pv.created_at >= NOW() - (days_back || ' days')::INTERVAL;

  -- Get total orders for user's products
  SELECT COUNT(*) INTO total_orders
  FROM orders o
  JOIN products p ON o.product_id = p.id
  WHERE p.user_id = user_uuid
  AND o.created_at >= NOW() - (days_back || ' days')::INTERVAL;

  -- Calculate conversion rate
  IF total_views > 0 THEN
    conversion_rate := (total_orders::NUMERIC / total_views::NUMERIC) * 100;
  ELSE
    conversion_rate := 0;
  END IF;

  -- Get views over time
  WITH date_series AS (
    SELECT generate_series(
      NOW() - ((days_back - 1) || ' days')::INTERVAL,
      NOW(),
      '1 day'::INTERVAL
    )::date as day
  )
  SELECT jsonb_agg(
    jsonb_build_object(
      'date', TO_CHAR(ds.day, 'Dy'),
      'views', COALESCE(COUNT(pv.id), 0)
    )
  ) INTO views_over_time
  FROM date_series ds
  LEFT JOIN products p ON p.user_id = user_uuid
  LEFT JOIN page_views pv ON pv.product_id = p.id 
    AND date_trunc('day', pv.created_at)::date = ds.day
  GROUP BY ds.day
  ORDER BY ds.day;

  -- Get orders over time
  WITH date_series AS (
    SELECT generate_series(
      NOW() - ((days_back - 1) || ' days')::INTERVAL,
      NOW(),
      '1 day'::INTERVAL
    )::date as day
  )
  SELECT jsonb_agg(
    jsonb_build_object(
      'date', TO_CHAR(ds.day, 'Dy'),
      'orders', COALESCE(COUNT(o.id), 0)
    )
  ) INTO orders_over_time
  FROM date_series ds
  LEFT JOIN products p ON p.user_id = user_uuid
  LEFT JOIN orders o ON o.product_id = p.id 
    AND date_trunc('day', o.created_at)::date = ds.day
  GROUP BY ds.day
  ORDER BY ds.day;

  -- Get top referrers
  SELECT jsonb_agg(
    jsonb_build_object(
      'referrer', ref_category,
      'percentage', percentage
    )
  ) INTO top_referrers
  FROM (
    SELECT 
      CASE 
        WHEN referrer = '' OR referrer IS NULL THEN 'Direct' 
        WHEN referrer LIKE '%google%' THEN 'Google'
        WHEN referrer LIKE '%facebook%' THEN 'Facebook'
        WHEN referrer LIKE '%instagram%' THEN 'Instagram'
        WHEN referrer LIKE '%twitter%' THEN 'Twitter'
        ELSE 'Other'
      END as ref_category,
      ROUND((COUNT(*)::NUMERIC / NULLIF((
        SELECT COUNT(*) 
        FROM page_views pv2
        JOIN products p2 ON pv2.product_id = p2.id
        WHERE p2.user_id = user_uuid
        AND pv2.created_at >= NOW() - (days_back || ' days')::INTERVAL
      ), 0)) * 100) as percentage
    FROM page_views pv
    JOIN products p ON pv.product_id = p.id
    WHERE p.user_id = user_uuid
    AND pv.created_at >= NOW() - (days_back || ' days')::INTERVAL
    GROUP BY ref_category
    ORDER BY COUNT(*) DESC
    LIMIT 4
  ) as referrer_counts;

  -- Get recent orders
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', '#ORD-' || SUBSTRING(o.id::TEXT, 1, 6),
      'product', p.name,
      'customer', o.customer_name,
      'date', TO_CHAR(o.created_at, 'YYYY-MM-DD'),
      'status', o.status,
      'amount', '$' || o.amount::TEXT
    )
  ) INTO recent_orders
  FROM (
    SELECT DISTINCT ON (o.id) 
      o.id,
      o.customer_name,
      o.status,
      o.amount,
      o.created_at,
      p.id as product_id,
      p.name
    FROM orders o
    JOIN products p ON o.product_id = p.id
    WHERE p.user_id = user_uuid
    ORDER BY o.id, o.created_at DESC
    LIMIT 5
  ) o
  JOIN products p ON o.product_id = p.id;

  -- Build the final result
  result := jsonb_build_object(
    'totalViews', total_views,
    'totalOrders', total_orders,
    'conversionRate', ROUND(conversion_rate, 1),
    'viewsOverTime', COALESCE(views_over_time, '[]'::JSONB),
    'ordersOverTime', COALESCE(orders_over_time, '[]'::JSONB),
    'topReferrers', COALESCE(top_referrers, '[]'::JSONB),
    'recentOrders', COALESCE(recent_orders, '[]'::JSONB)
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
