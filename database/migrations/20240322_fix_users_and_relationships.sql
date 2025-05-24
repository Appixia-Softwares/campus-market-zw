-- Enable RLS on users table
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users are viewable by everyone" ON auth.users;

-- Create policy for users table
CREATE POLICY "Users are viewable by everyone"
ON auth.users
FOR SELECT
TO authenticated, anon
USING (true);

-- Grant necessary permissions
GRANT SELECT ON auth.users TO authenticated, anon;

-- Create a view for public user data
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT 
    id,
    email,
    raw_user_meta_data->>'full_name' as full_name,
    raw_user_meta_data->>'avatar_url' as avatar_url,
    created_at,
    updated_at
FROM auth.users;

-- Grant access to the view
GRANT SELECT ON public.user_profiles TO authenticated, anon;

-- Update products table to use the view
ALTER TABLE products
DROP CONSTRAINT IF EXISTS products_seller_id_fkey,
ADD CONSTRAINT products_seller_id_fkey
    FOREIGN KEY (seller_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Update accommodations table to use the view
ALTER TABLE accommodations
DROP CONSTRAINT IF EXISTS accommodations_owner_id_fkey,
ADD CONSTRAINT accommodations_owner_id_fkey
    FOREIGN KEY (owner_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Create RLS policies for the relationships
CREATE POLICY "Products can be viewed with seller info"
ON products
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Accommodations can be viewed with owner info"
ON accommodations
FOR SELECT
TO authenticated, anon
USING (true);
