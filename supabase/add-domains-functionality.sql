-- Create extension for UUID generation if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create domains table to track unique subdomains
CREATE TABLE IF NOT EXISTS domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subdomain TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  CONSTRAINT subdomain_format CHECK (subdomain ~* '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$')
);

-- Create index for faster domain lookups
CREATE INDEX IF NOT EXISTS domains_subdomain_idx ON domains(subdomain);
CREATE INDEX IF NOT EXISTS domains_user_id_idx ON domains(user_id);

-- Add domain_id column to products table
ALTER TABLE products 
ADD COLUMN domain_id UUID REFERENCES domains(id) ON DELETE SET NULL;

-- Create index for faster product lookups by domain
CREATE INDEX IF NOT EXISTS products_domain_id_idx ON products(domain_id);

-- Add additional columns to products table for expanded product data
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS template_data JSONB DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS seo JSONB DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS brand JSONB DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS testimonials JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '{"images": [], "video": ""}'::JSONB,
ADD COLUMN IF NOT EXISTS benefits TEXT,
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS call_to_action JSONB DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS theme JSONB DEFAULT '{}'::JSONB;

-- Add domain_id column to stores table
ALTER TABLE stores 
ADD COLUMN domain_id UUID REFERENCES domains(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS theme JSONB DEFAULT '{}'::JSONB;

-- Create index for faster store lookups by domain
CREATE INDEX IF NOT EXISTS stores_domain_id_idx ON stores(domain_id);

-- Create RLS policies for domains table
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own domains" ON domains;
DROP POLICY IF EXISTS "Users can insert their own domains" ON domains;
DROP POLICY IF EXISTS "Users can update their own domains" ON domains;
DROP POLICY IF EXISTS "Users can delete their own domains" ON domains;

CREATE POLICY "Users can view their own domains"
  ON domains FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own domains"
  ON domains FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own domains"
  ON domains FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own domains"
  ON domains FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to register a new domain
CREATE OR REPLACE FUNCTION register_domain(subdomain_name TEXT, user_uuid UUID)
RETURNS UUID AS $$
DECLARE
  new_domain_id UUID;
BEGIN
  -- Check if domain already exists
  IF EXISTS (SELECT 1 FROM domains WHERE subdomain = subdomain_name) THEN
    RAISE EXCEPTION 'Domain % already exists', subdomain_name;
  END IF;
  
  -- Insert new domain
  INSERT INTO domains (subdomain, user_id)
  VALUES (subdomain_name, user_uuid)
  RETURNING id INTO new_domain_id;
  
  RETURN new_domain_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to publish a product with domain
CREATE OR REPLACE FUNCTION publish_product_with_domain(
  product_uuid UUID,
  subdomain_name TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  domain_id UUID;
  product_user_id UUID;
BEGIN
  -- Get product user_id
  SELECT user_id INTO product_user_id FROM products WHERE id = product_uuid;
  
  -- Check if user owns the product
  IF product_user_id != auth.uid() THEN
    RAISE EXCEPTION 'User does not own this product';
  END IF;
  
  -- Get or create domain
  SELECT id INTO domain_id FROM domains WHERE subdomain = subdomain_name;
  
  IF domain_id IS NULL THEN
    domain_id := register_domain(subdomain_name, auth.uid());
  ELSE
    -- Check if user owns the domain
    IF NOT EXISTS (SELECT 1 FROM domains WHERE id = domain_id AND user_id = auth.uid()) THEN
      RAISE EXCEPTION 'User does not own this domain';
    END IF;
  END IF;
  
  -- Update product with domain and set to published
  UPDATE products
  SET domain_id = domain_id, published = TRUE, updated_at = NOW()
  WHERE id = product_uuid;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get product by domain
CREATE OR REPLACE FUNCTION get_product_by_domain(domain_name TEXT)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  description TEXT,
  price NUMERIC,
  currency TEXT,
  template TEXT,
  slug TEXT,
  published BOOLEAN,
  product_type TEXT,
  domain_id UUID,
  template_data JSONB,
  seo JSONB,
  brand JSONB,
  testimonials JSONB,
  faq JSONB,
  media JSONB,
  features TEXT[],
  benefits TEXT,
  tagline TEXT,
  call_to_action JSONB,
  colors JSONB,
  sizes JSONB,
  theme JSONB,
  subdomain TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id, p.user_id, p.name, p.description, p.price, p.currency, p.template, p.slug, p.published, p.product_type,
    p.domain_id, p.template_data, p.seo, p.brand, p.testimonials, p.faq, p.media, p.features, p.benefits,
    p.tagline, p.call_to_action, p.colors, p.sizes, p.theme, d.subdomain, p.created_at, p.updated_at
  FROM products p
  JOIN domains d ON p.domain_id = d.id
  WHERE d.subdomain = domain_name AND p.published = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get store by domain
CREATE OR REPLACE FUNCTION get_store_by_domain(domain_name TEXT)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  description TEXT,
  about TEXT,
  tagline TEXT,
  category TEXT,
  footer_content TEXT,
  contact_email TEXT,
  color TEXT,
  accent_color TEXT,
  theme JSONB,
  template TEXT,
  subdomain TEXT,
  products JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id, s.user_id, s.name, s.description, s.about, s.tagline, s.category, s.footer_content, 
    s.contact_email, s.color, s.accent_color, s.theme, s.template, d.subdomain,
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'name', p.name,
          'description', p.description,
          'price', p.price,
          'currency', p.currency,
          'category', p.category,
          'features', p.features,
          'images', p.images
        )
      )
      FROM products p
      WHERE p.store_id = s.id
    ) AS products,
    s.created_at, s.updated_at
  FROM stores s
  JOIN domains d ON s.domain_id = d.id
  WHERE d.subdomain = domain_name AND s.published = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create API endpoint for accessing products by domain
CREATE OR REPLACE FUNCTION public.get_product_showcase(domain_name TEXT)
RETURNS JSONB AS $$
DECLARE
  product_data JSONB;
  store_data JSONB;
BEGIN
  -- Try to get single product data
  SELECT jsonb_build_object(
    'type', 'single',
    'product', jsonb_build_object(
      'id', p.id,
      'name', p.name,
      'tagline', p.tagline,
      'description', p.description,
      'features', p.features,
      'benefits', p.benefits,
      'price', jsonb_build_object(
        'currency', p.currency,
        'amount', p.price,
        'monthly', (p.template_data->>'monthly_price')::numeric,
        'yearly', (p.template_data->>'yearly_price')::numeric,
        'discountNote', p.template_data->>'discount_note'
      ),
      'media', p.media,
      'testimonials', p.testimonials,
      'callToAction', p.call_to_action,
      'faq', p.faq,
      'colors', p.colors,
      'sizes', p.sizes,
      'images', p.images
    ),
    'brand', p.brand,
    'seo', p.seo,
    'theme', p.theme,
    'template', p.template
  ) INTO product_data
  FROM products p
  JOIN domains d ON p.domain_id = d.id
  WHERE d.subdomain = domain_name AND p.published = TRUE;

  -- If product found, return it
  IF product_data IS NOT NULL THEN
    RETURN product_data;
  END IF;

  -- Try to get store data
  SELECT jsonb_build_object(
    'type', 'multi',
    'store', jsonb_build_object(
      'id', s.id,
      'name', s.name,
      'description', s.description,
      'about', s.about,
      'tagline', s.tagline,
      'category', s.category,
      'footerContent', s.footer_content,
      'contactEmail', s.contact_email,
      'color', s.color,
      'accentColor', s.accent_color
    ),
    'products', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'name', p.name,
          'description', p.description,
          'price', p.price,
          'currency', p.currency,
          'category', p.category,
          'features', p.features,
          'images', p.images
        )
      )
      FROM products p
      WHERE p.store_id = s.id
    ),
    'theme', s.theme,
    'template', s.template
  ) INTO store_data
  FROM stores s
  JOIN domains d ON s.domain_id = d.id
  WHERE d.subdomain = domain_name AND s.published = TRUE;

  -- If store found, return it
  IF store_data IS NOT NULL THEN
    RETURN store_data;
  END IF;

  -- If nothing found, return empty object
  RETURN '{"error": "No product or store found for this domain"}'::JSONB;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow anonymous access to the get_product_showcase function
GRANT EXECUTE ON FUNCTION public.get_product_showcase TO anon;

-- Create a function to check if a domain is available
CREATE OR REPLACE FUNCTION check_domain_availability(subdomain_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (SELECT 1 FROM domains WHERE subdomain = subdomain_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow authenticated users to check domain availability
GRANT EXECUTE ON FUNCTION public.check_domain_availability TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_domain_availability TO anon;

COMMENT ON FUNCTION get_product_showcase IS 'Get product or store data by domain name for the product showcase site';
COMMENT ON FUNCTION publish_product_with_domain IS 'Publish a product with a specific domain name';
COMMENT ON FUNCTION register_domain IS 'Register a new domain for a user';
COMMENT ON FUNCTION check_domain_availability IS 'Check if a domain is available for registration';
COMMENT ON TABLE domains IS 'Stores subdomain information for product showcase sites';
