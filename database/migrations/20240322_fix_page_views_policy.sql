-- Drop existing policies
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.page_views;
DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.page_views;

-- Create new policies that allow both authenticated and anonymous users
CREATE POLICY "Allow insert for all users"
ON public.page_views
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Allow read for all users"
ON public.page_views
FOR SELECT
TO authenticated, anon
USING (true);

-- Grant necessary permissions
GRANT INSERT, SELECT ON public.page_views TO authenticated, anon; 