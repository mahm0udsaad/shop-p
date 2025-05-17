-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  data JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON notifications(read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on notifications
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate order notification
CREATE OR REPLACE FUNCTION create_order_notification()
RETURNS TRIGGER AS $$
DECLARE
  product_name TEXT;
  customer_name TEXT;
  amount_with_currency TEXT;
BEGIN
  -- Get product name
  SELECT p.name INTO product_name
  FROM products p
  WHERE p.id = NEW.product_id;

  -- Format customer name and amount with currency
  customer_name := NEW.customer_name;
  amount_with_currency := NEW.amount || ' ' || NEW.currency;
  
  -- Insert notification
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    data
  )
  VALUES (
    NEW.user_id,
    'New Order Received',
    'You received a new order for ' || product_name || ' from ' || customer_name || ' for ' || amount_with_currency,
    'order',
    jsonb_build_object(
      'order_id', NEW.id,
      'order_number', NEW.order_number,
      'product_id', NEW.product_id,
      'product_name', product_name,
      'customer_name', customer_name,
      'amount', NEW.amount,
      'currency', NEW.currency
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to create notification when order is created
CREATE TRIGGER order_notification_trigger
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION create_order_notification(); 