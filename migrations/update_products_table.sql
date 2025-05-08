-- Update products table to handle template data properly
ALTER TABLE products
-- Add template field if not exists
ADD COLUMN IF NOT EXISTS template VARCHAR(50) DEFAULT 'modern',
-- Add product_type field if not exists
ADD COLUMN IF NOT EXISTS product_type VARCHAR(50) DEFAULT 'single',
-- Add published field if not exists
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true,
-- Add featured field if not exists
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
-- Add currency field if not exists
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD',
-- Add template_data as JSONB if not exists
ADD COLUMN IF NOT EXISTS template_data JSONB DEFAULT '{}',
-- Add seo as JSONB if not exists
ADD COLUMN IF NOT EXISTS seo JSONB DEFAULT '{}',
-- Add brand as JSONB if not exists
ADD COLUMN IF NOT EXISTS brand JSONB DEFAULT '{}',
-- Add testimonials as JSONB if not exists
ADD COLUMN IF NOT EXISTS testimonials JSONB DEFAULT '[]',
-- Add faq as JSONB if not exists
ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]',
-- Add media as JSONB if not exists
ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '{"images": [], "video": ""}',
-- Add benefits as JSONB if not exists
ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '[]',
-- Add tagline as TEXT if not exists
ADD COLUMN IF NOT EXISTS tagline TEXT,
-- Add call_to_action as JSONB if not exists
ADD COLUMN IF NOT EXISTS call_to_action JSONB DEFAULT '{"text": "", "url": ""}',
-- Add theme as JSONB if not exists
ADD COLUMN IF NOT EXISTS theme JSONB DEFAULT '{"primaryColor": "", "secondaryColor": ""}';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_template ON products(template);
CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(published);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

-- Add comments for documentation
COMMENT ON COLUMN products.template IS 'The template used for the product page';
COMMENT ON COLUMN products.product_type IS 'Type of product (single or multi)';
COMMENT ON COLUMN products.published IS 'Whether the product is published';
COMMENT ON COLUMN products.featured IS 'Whether the product is featured';
COMMENT ON COLUMN products.currency IS 'Currency code for the product price';
COMMENT ON COLUMN products.template_data IS 'Template-specific data in JSON format';
COMMENT ON COLUMN products.seo IS 'SEO metadata in JSON format';
COMMENT ON COLUMN products.brand IS 'Brand information in JSON format';
COMMENT ON COLUMN products.testimonials IS 'Product testimonials in JSON format';
COMMENT ON COLUMN products.faq IS 'Frequently asked questions in JSON format';
COMMENT ON COLUMN products.media IS 'Media files (images and video) in JSON format';
COMMENT ON COLUMN products.benefits IS 'Product benefits in JSON format';
COMMENT ON COLUMN products.tagline IS 'Product tagline';
COMMENT ON COLUMN products.call_to_action IS 'Call to action data in JSON format';
COMMENT ON COLUMN products.theme IS 'Theme settings in JSON format'; 