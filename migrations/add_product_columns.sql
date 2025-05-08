-- Add new columns to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS features TEXT,
ADD COLUMN IF NOT EXISTS color VARCHAR(7),
ADD COLUMN IF NOT EXISTS accent_color VARCHAR(7),
ADD COLUMN IF NOT EXISTS subdomain VARCHAR(255) UNIQUE;

-- Add index for subdomain for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_subdomain ON products(subdomain);

-- Add comment to explain the columns
COMMENT ON COLUMN products.features IS 'Product features as a text field';
COMMENT ON COLUMN products.color IS 'Primary color in hex format (e.g., #6F4E37)';
COMMENT ON COLUMN products.accent_color IS 'Accent color in hex format (e.g., #ECB176)';
COMMENT ON COLUMN products.subdomain IS 'Unique subdomain for the product landing page'; 