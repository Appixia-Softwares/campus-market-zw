-- Drop existing policies
DROP POLICY IF EXISTS "Products are viewable by everyone if active" ON products;
DROP POLICY IF EXISTS "Accommodations are viewable by everyone if available" ON accommodations;

-- Create new policies that allow both authenticated and anonymous users to view active products
CREATE POLICY "Products are viewable by everyone if active"
ON products
FOR SELECT
TO authenticated, anon
USING (status = 'active');

-- Create new policies that allow both authenticated and anonymous users to view available accommodations
CREATE POLICY "Accommodations are viewable by everyone if available"
ON accommodations
FOR SELECT
TO authenticated, anon
USING (status = 'available');

-- Grant necessary permissions
GRANT SELECT ON products TO authenticated, anon;
GRANT SELECT ON accommodations TO authenticated, anon; 