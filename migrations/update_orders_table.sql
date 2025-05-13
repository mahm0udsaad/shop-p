-- Add new columns to orders table
DO $$
BEGIN
  -- Add customer_phone column if not exists
  IF NOT EXISTS (SELECT FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' 
                 AND column_name = 'customer_phone') THEN
    ALTER TABLE orders ADD COLUMN customer_phone TEXT;
  END IF;
  
  -- Add notes column if not exists
  IF NOT EXISTS (SELECT FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' 
                 AND column_name = 'notes') THEN
    ALTER TABLE orders ADD COLUMN notes TEXT;
  END IF;
  
  -- Add product_name column if not exists
  IF NOT EXISTS (SELECT FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'orders' 
                 AND column_name = 'product_name') THEN
    ALTER TABLE orders ADD COLUMN product_name TEXT;
  END IF;
END
$$; 