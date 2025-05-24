-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;

-- Create policy for users table
CREATE POLICY "Users are viewable by everyone"
ON users
FOR SELECT
TO authenticated, anon
USING (true);

-- Grant necessary permissions
GRANT SELECT ON users TO authenticated, anon;

-- Create policy for profiles table if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
        
        CREATE POLICY "Profiles are viewable by everyone"
        ON profiles
        FOR SELECT
        TO authenticated, anon
        USING (true);
        
        GRANT SELECT ON profiles TO authenticated, anon;
    END IF;
END $$; 