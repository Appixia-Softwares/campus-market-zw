-- Complete setup migration for Campus Market ZW
-- This migration sets up the entire database schema and storage

-- First, run the main schema
\i database/schema.sql

-- Then set up storage buckets
\i database/storage-buckets.sql

-- Create some sample data for testing
INSERT INTO users (id, full_name, email, university_id, role, status, verified, email_verified)
SELECT 
  gen_random_uuid(),
  'Test User',
  'test@example.com',
  (SELECT id FROM universities WHERE name = 'University of Zimbabwe' LIMIT 1),
  'user',
  'active',
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'test@example.com');

-- Create admin user
INSERT INTO users (id, full_name, email, role, status, verified, email_verified)
SELECT 
  gen_random_uuid(),
  'Admin User',
  'admin@campusmarket.co.zw',
  'admin',
  'active',
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@campusmarket.co.zw');

-- Add some sample accommodations
DO $$
DECLARE
    test_user_id UUID;
    location_id UUID;
    type_id UUID;
BEGIN
    -- Get test user ID
    SELECT id INTO test_user_id FROM users WHERE email = 'test@example.com' LIMIT 1;
    
    -- Get location and type IDs
    SELECT id INTO location_id FROM locations WHERE name = 'Mount Pleasant' LIMIT 1;
    SELECT id INTO type_id FROM accommodation_types WHERE name = 'Single Room' LIMIT 1;
    
    -- Insert sample accommodation if user exists
    IF test_user_id IS NOT NULL THEN
        INSERT INTO accommodations (
            title, description, price, location_id, type_id, owner_id, status, featured
        ) VALUES (
            'Cozy Single Room near UZ',
            'A comfortable single room perfect for students, located just 5 minutes from University of Zimbabwe campus.',
            150.00,
            location_id,
            type_id,
            test_user_id,
            'available',
            true
        ) ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Add some sample products
DO $$
DECLARE
    test_user_id UUID;
    category_id UUID;
    location_id UUID;
BEGIN
    -- Get test user ID
    SELECT id INTO test_user_id FROM users WHERE email = 'test@example.com' LIMIT 1;
    
    -- Get category and location IDs
    SELECT id INTO category_id FROM product_categories WHERE name = 'Textbooks' LIMIT 1;
    SELECT id INTO location_id FROM locations WHERE name = 'Mount Pleasant' LIMIT 1;
    
    -- Insert sample product if user exists
    IF test_user_id IS NOT NULL THEN
        INSERT INTO products (
            title, description, price, category_id, condition, seller_id, status, location_id
        ) VALUES (
            'Engineering Mathematics Textbook',
            'Comprehensive engineering mathematics textbook in excellent condition. Perfect for first and second year engineering students.',
            25.00,
            category_id,
            'Like New',
            test_user_id,
            'active',
            location_id
        ) ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Grant necessary permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
