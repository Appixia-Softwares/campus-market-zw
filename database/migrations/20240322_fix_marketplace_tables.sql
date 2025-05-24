-- Create product_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create product_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create accommodation_types table if it doesn't exist
CREATE TABLE IF NOT EXISTS accommodation_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create accommodation_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS accommodation_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    accommodation_id UUID REFERENCES accommodations(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create locations table if it doesn't exist
CREATE TABLE IF NOT EXISTS locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    country TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Product categories are viewable by everyone" ON product_categories;
DROP POLICY IF EXISTS "Product images are viewable by everyone" ON product_images;
DROP POLICY IF EXISTS "Accommodation types are viewable by everyone" ON accommodation_types;
DROP POLICY IF EXISTS "Accommodation images are viewable by everyone" ON accommodation_images;
DROP POLICY IF EXISTS "Locations are viewable by everyone" ON locations;
DROP POLICY IF EXISTS "Products are viewable by everyone if active" ON products;
DROP POLICY IF EXISTS "Accommodations are viewable by everyone if available" ON accommodations;

-- Create policies for product_categories
CREATE POLICY "Product categories are viewable by everyone"
ON product_categories
FOR SELECT
TO authenticated, anon
USING (true);

-- Create policies for product_images
CREATE POLICY "Product images are viewable by everyone"
ON product_images
FOR SELECT
TO authenticated, anon
USING (true);

-- Create policies for accommodation_types
CREATE POLICY "Accommodation types are viewable by everyone"
ON accommodation_types
FOR SELECT
TO authenticated, anon
USING (true);

-- Create policies for accommodation_images
CREATE POLICY "Accommodation images are viewable by everyone"
ON accommodation_images
FOR SELECT
TO authenticated, anon
USING (true);

-- Create policies for locations
CREATE POLICY "Locations are viewable by everyone"
ON locations
FOR SELECT
TO authenticated, anon
USING (true);

-- Create policies for products
CREATE POLICY "Products are viewable by everyone if active"
ON products
FOR SELECT
TO authenticated, anon
USING (status = 'active');

-- Create policies for accommodations
CREATE POLICY "Accommodations are viewable by everyone if available"
ON accommodations
FOR SELECT
TO authenticated, anon
USING (status = 'available');

-- Grant necessary permissions
GRANT SELECT ON product_categories TO authenticated, anon;
GRANT SELECT ON product_images TO authenticated, anon;
GRANT SELECT ON accommodation_types TO authenticated, anon;
GRANT SELECT ON accommodation_images TO authenticated, anon;
GRANT SELECT ON locations TO authenticated, anon;
GRANT SELECT ON products TO authenticated, anon;
GRANT SELECT ON accommodations TO authenticated, anon;

-- Insert some default categories if they don't exist
INSERT INTO product_categories (name, description)
SELECT 'Electronics', 'Electronic devices and accessories'
WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE name = 'Electronics');

INSERT INTO product_categories (name, description)
SELECT 'Books', 'Textbooks and other reading materials'
WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE name = 'Books');

INSERT INTO product_categories (name, description)
SELECT 'Furniture', 'Furniture and home decor'
WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE name = 'Furniture');

-- Insert some default accommodation types if they don't exist
INSERT INTO accommodation_types (name, description)
SELECT 'Apartment', 'Individual apartments'
WHERE NOT EXISTS (SELECT 1 FROM accommodation_types WHERE name = 'Apartment');

INSERT INTO accommodation_types (name, description)
SELECT 'Dormitory', 'University dormitories'
WHERE NOT EXISTS (SELECT 1 FROM accommodation_types WHERE name = 'Dormitory');

INSERT INTO accommodation_types (name, description)
SELECT 'House', 'Shared houses'
WHERE NOT EXISTS (SELECT 1 FROM accommodation_types WHERE name = 'House');
