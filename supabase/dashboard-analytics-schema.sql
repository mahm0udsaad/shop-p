-- Create extension for UUID generation if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create page_views table to track product views
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- This references the product owner
  visitor_id TEXT, -- Anonymous identifier for the visitor
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster page view lookups
CREATE INDEX IF NOT EXISTS page_views_product_id_idx ON page_views(product_id);
CREATE INDEX IF NOT EXISTS page_views_user_id_idx ON page_views(user_id);
CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views(created_at);

-- Create orders table to track product orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- This references the product owner
  customer_name TEXT,
  customer_email TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'processing',
  payment_intent_id TEXT,
  shipping_address JSONB,
  billing_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster order lookups
CREATE INDEX IF NOT EXISTS orders_product_id_idx ON orders(product_id);
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at);

-- Create function to get dashboard analytics
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
  SELECT jsonb_agg(
    jsonb_build_object(
      'date', TO_CHAR(day, 'Dy'),
      'views', COALESCE(view_count, 0)
    )
  ) INTO views_over_time
  FROM (
    SELECT 
      date_trunc('day', dd)::date as day,
      COUNT(pv.id) as view_count
    FROM generate_series(
      NOW() - ((days_back - 1) || ' days')::INTERVAL,
      NOW(),
      '1 day'::INTERVAL
    ) as dd
    LEFT JOIN page_views pv ON date_trunc('day', pv.created_at) = date_trunc('day', dd)
    LEFT JOIN products p ON pv.product_id = p.id AND p.user_id = user_uuid
    GROUP BY day
    ORDER BY day
  ) as daily_views;

  -- Get orders over time
  SELECT jsonb_agg(
    jsonb_build_object(
      'date', TO_CHAR(day, 'Dy'),
      'orders', COALESCE(order_count, 0)
    )
  ) INTO orders_over_time
  FROM (
    SELECT 
      date_trunc('day', dd)::date as day,
      COUNT(o.id) as order_count
    FROM generate_series(
      NOW() - ((days_back - 1) || ' days')::INTERVAL,
      NOW(),
      '1 day'::INTERVAL
    ) as dd
    LEFT JOIN orders o ON date_trunc('day', o.created_at) = date_trunc('day', dd)
    LEFT JOIN products p ON o.product_id = p.id AND p.user_id = user_uuid
    GROUP BY day
    ORDER BY day
  ) as daily_orders;

  -- Get top referrers
  SELECT jsonb_agg(
    jsonb_build_object(
      'referrer', CASE 
                    WHEN referrer = '' OR referrer IS NULL THEN 'Direct' 
                    WHEN referrer LIKE '%google%' THEN 'Google'
                    WHEN referrer LIKE '%facebook%' THEN 'Facebook'
                    WHEN referrer LIKE '%instagram%' THEN 'Instagram'
                    WHEN referrer LIKE '%twitter%' THEN 'Twitter'
                    ELSE 'Other'
                  END,
      'percentage', ROUND((count::NUMERIC / NULLIF(total_count, 0)) * 100)
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
      END as referrer,
      COUNT(*) as count,
      SUM(COUNT(*)) OVER () as total_count
    FROM page_views pv
    JOIN products p ON pv.product_id = p.id
    WHERE p.user_id = user_uuid
    AND pv.created_at >= NOW() - (days_back || ' days')::INTERVAL
    GROUP BY 1
    ORDER BY count DESC
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
  FROM orders o
  JOIN products p ON o.product_id = p.id
  WHERE p.user_id = user_uuid
  ORDER BY o.created_at DESC
  LIMIT 5;

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

-- Create function to track a page view
CREATE OR REPLACE FUNCTION track_page_view(
  product_uuid UUID,
  visitor_uuid TEXT,
  referrer_url TEXT,
  user_agent_string TEXT,
  ip_addr TEXT,
  page_path TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  product_owner_id UUID;
BEGIN
  -- Get the product owner's user_id
  SELECT user_id INTO product_owner_id FROM products WHERE id = product_uuid;
  
  IF product_owner_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Insert the page view
  INSERT INTO page_views (
    product_id,
    user_id,
    visitor_id,
    referrer,
    user_agent,
    ip_address,
    path,
    created_at
  ) VALUES (
    product_uuid,
    product_owner_id,
    visitor_uuid,
    referrer_url,
    user_agent_string,
    ip_addr,
    page_path,
    NOW()
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to create a new order
CREATE OR REPLACE FUNCTION create_order(
  product_uuid UUID,
  customer_name_input TEXT,
  customer_email_input TEXT,
  amount_input NUMERIC,
  currency_input TEXT DEFAULT 'USD',
  shipping_address_input JSONB DEFAULT NULL,
  billing_address_input JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_order_id UUID;
  product_owner_id UUID;
  order_num TEXT;
BEGIN
  -- Get the product owner's user_id
  SELECT user_id INTO product_owner_id FROM products WHERE id = product_uuid;
  
  IF product_owner_id IS NULL THEN
    RAISE EXCEPTION 'Product not found';
  END IF;

  -- Generate order number
  SELECT 'ORD-' || SUBSTRING(uuid_generate_v4()::TEXT, 1, 8) INTO order_num;

  -- Insert the order
  INSERT INTO orders (
    order_number,
    product_id,
    user_id,
    customer_name,
    customer_email,
    amount,
    currency,
    status,
    shipping_address,
    billing_address,
    created_at,
    updated_at
  ) VALUES (
    order_num,
    product_uuid,
    product_owner_id,
    customer_name_input,
    customer_email_input,
    amount_input,
    currency_input,
    'processing',
    shipping_address_input,
    billing_address_input,
    NOW(),
    NOW()
  ) RETURNING id INTO new_order_id;
  
  RETURN new_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RLS policies for page_views table
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own page views" ON page_views;
DROP POLICY IF EXISTS "Users can insert page views" ON page_views;

CREATE POLICY "Users can view their own page views"
  ON page_views FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert page views"
  ON page_views FOR INSERT
  WITH CHECK (true);  -- Allow inserts from API

-- Create RLS policies for orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);  -- Allow inserts from API

CREATE POLICY "Users can update their own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id);

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_dashboard_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION track_page_view TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_order TO anon, authenticated;

-- Add comments for documentation
COMMENT ON TABLE page_views IS 'Tracks page views for product showcase sites';
COMMENT ON TABLE orders IS 'Stores orders for products';
COMMENT ON FUNCTION get_dashboard_analytics IS 'Returns analytics data for the dashboard';
COMMENT ON FUNCTION track_page_view IS 'Records a page view for a product';
COMMENT ON FUNCTION create_order IS 'Creates a new order for a product';
