-- Drop existing policy
DROP POLICY IF EXISTS "Universities are viewable by everyone" ON universities;

-- Create new policy that allows both authenticated and anonymous users to view universities
CREATE POLICY "Universities are viewable by everyone"
ON universities FOR SELECT
TO authenticated, anon
USING (true);
