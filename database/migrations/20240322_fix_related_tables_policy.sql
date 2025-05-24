-- Enable RLS on related tables
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

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

-- Grant necessary permissions
GRANT SELECT ON product_categories TO authenticated, anon;
GRANT SELECT ON product_images TO authenticated, anon;
GRANT SELECT ON accommodation_types TO authenticated, anon;
GRANT SELECT ON accommodation_images TO authenticated, anon;
GRANT SELECT ON locations TO authenticated, anon; 