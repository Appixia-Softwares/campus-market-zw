-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant basic permissions to authenticated users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'pending', 'inactive');
CREATE TYPE accommodation_status AS ENUM ('available', 'pending', 'occupied', 'maintenance');
CREATE TYPE product_status AS ENUM ('active', 'pending', 'sold', 'removed');
CREATE TYPE product_condition AS ENUM ('New', 'Like New', 'Good', 'Fair', 'Poor');

-- Create tables
-- Universities table
CREATE TABLE universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    location TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    university_id UUID REFERENCES universities(id),
    role user_role NOT NULL DEFAULT 'user',
    status user_status NOT NULL DEFAULT 'pending',
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Locations table
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    city TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Accommodation types table
CREATE TABLE accommodation_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Amenities table
CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    icon TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Accommodations table
CREATE TABLE accommodations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    location_id UUID NOT NULL REFERENCES locations(id),
    type_id UUID NOT NULL REFERENCES accommodation_types(id),
    owner_id UUID NOT NULL REFERENCES users(id),
    status accommodation_status NOT NULL DEFAULT 'pending',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    rating SMALLINT,
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Accommodation amenities junction table
CREATE TABLE accommodation_amenities (
    accommodation_id UUID REFERENCES accommodations(id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (accommodation_id, amenity_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Accommodation images table
CREATE TABLE accommodation_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    accommodation_id UUID NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product categories table
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id UUID NOT NULL REFERENCES product_categories(id),
    condition product_condition NOT NULL,
    seller_id UUID NOT NULL REFERENCES users(id),
    status product_status NOT NULL DEFAULT 'pending',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product images table
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews table (polymorphic - can be for products or accommodations)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    -- Polymorphic relationship fields
    reviewable_type TEXT NOT NULL CHECK (reviewable_type IN ('product', 'accommodation')),
    reviewable_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Ensure a user can only review an item once
    UNIQUE (user_id, reviewable_type, reviewable_id)
);

-- Messages table for communication between users
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Saved items table (polymorphic - can be products or accommodations)
CREATE TABLE saved_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    -- Polymorphic relationship fields
    saveable_type TEXT NOT NULL CHECK (saveable_type IN ('product', 'accommodation')),
    saveable_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Ensure a user can only save an item once
    UNIQUE (user_id, saveable_type, saveable_id)
);

-- Create indexes for performance
CREATE INDEX idx_accommodations_location ON accommodations(location_id);
CREATE INDEX idx_accommodations_type ON accommodations(type_id);
CREATE INDEX idx_accommodations_owner ON accommodations(owner_id);
CREATE INDEX idx_accommodations_status ON accommodations(status);
CREATE INDEX idx_accommodations_featured ON accommodations(featured);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);

CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_polymorphic ON reviews(reviewable_type, reviewable_id);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);

CREATE INDEX idx_saved_items_user ON saved_items(user_id);
CREATE INDEX idx_saved_items_polymorphic ON saved_items(saveable_type, saveable_id);

-- Insert initial data
-- Insert universities
INSERT INTO universities (name, location) VALUES
('University of Zimbabwe', 'Harare'),
('National University of Science and Technology', 'Bulawayo'),
('Midlands State University', 'Gweru'),
('Harare Institute of Technology', 'Harare'),
('Chinhoyi University of Technology', 'Chinhoyi');

-- Insert locations
INSERT INTO locations (name, city) VALUES
('Mount Pleasant', 'Harare'),
('Avondale', 'Harare'),
('Bulawayo CBD', 'Bulawayo'),
('Senga', 'Gweru'),
('Mkoba', 'Gweru'),
('Hillside', 'Bulawayo'),
('Avenues', 'Harare'),
('Eastlea', 'Harare');

-- Insert accommodation types
INSERT INTO accommodation_types (name, description) VALUES
('Single Room', 'A room for one person'),
('Shared Room', 'A room shared by multiple people'),
('Studio Apartment', 'A self-contained small apartment'),
('1-Bedroom Apartment', 'An apartment with one bedroom'),
('2-Bedroom Apartment', 'An apartment with two bedrooms'),
('House', 'A full house');

-- Insert amenities
INSERT INTO amenities (name, icon) VALUES
('Wi-Fi', 'wifi'),
('Water', 'droplet'),
('Electricity', 'zap'),
('Security', 'shield'),
('Furnished', 'sofa'),
('Parking', 'car'),
('Laundry', 'shirt'),
('Kitchen', 'utensils');

-- Insert product categories
INSERT INTO product_categories (name, description) VALUES
('Textbooks', 'Academic textbooks and study materials'),
('Electronics', 'Electronic devices and accessories'),
('Furniture', 'Furniture for home or dorm'),
('Clothing', 'Clothing items and accessories'),
('Stationery', 'Stationery and office supplies'),
('Kitchen Appliances', 'Appliances for kitchen use'),
('Sports Equipment', 'Equipment for sports and fitness'),
('Other', 'Miscellaneous items');

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all active users" ON users;
DROP POLICY IF EXISTS "Allow user creation during signup" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Universities are viewable by everyone" ON universities;
DROP POLICY IF EXISTS "Locations are viewable by everyone" ON locations;
DROP POLICY IF EXISTS "Accommodation types are viewable by everyone" ON accommodation_types;
DROP POLICY IF EXISTS "Amenities are viewable by everyone" ON amenities;
DROP POLICY IF EXISTS "Accommodations are viewable by everyone if available" ON accommodations;
DROP POLICY IF EXISTS "Users can create their own accommodations" ON accommodations;
DROP POLICY IF EXISTS "Users can update their own accommodations" ON accommodations;
DROP POLICY IF EXISTS "Product categories are viewable by everyone" ON product_categories;
DROP POLICY IF EXISTS "Products are viewable by everyone if active" ON products;
DROP POLICY IF EXISTS "Users can create their own products" ON products;
DROP POLICY IF EXISTS "Users can update their own products" ON products;
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
DROP POLICY IF EXISTS "Users can create their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view messages they sent or received" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can view their own saved items" ON saved_items;
DROP POLICY IF EXISTS "Users can save items" ON saved_items;

-- Create RLS policies
-- Users policies
CREATE POLICY "Users can view all active users"
ON users FOR SELECT
USING (status = 'active');

-- Allow user creation during signup
CREATE POLICY "Allow user creation during signup"
ON users FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Universities policies (public read access)
CREATE POLICY "Universities are viewable by everyone"
ON universities FOR SELECT
TO authenticated
USING (true);

-- Locations policies (public read access)
CREATE POLICY "Locations are viewable by everyone"
ON locations FOR SELECT
TO authenticated
USING (true);

-- Accommodation types policies (public read access)
CREATE POLICY "Accommodation types are viewable by everyone"
ON accommodation_types FOR SELECT
TO authenticated
USING (true);

-- Amenities policies (public read access)
CREATE POLICY "Amenities are viewable by everyone"
ON amenities FOR SELECT
TO authenticated
USING (true);

-- Accommodations policies
CREATE POLICY "Accommodations are viewable by everyone if available"
ON accommodations FOR SELECT
TO authenticated
USING (status = 'available' OR owner_id = auth.uid());

CREATE POLICY "Users can create their own accommodations"
ON accommodations FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own accommodations"
ON accommodations FOR UPDATE
USING (owner_id = auth.uid());

-- Product categories policies (public read access)
CREATE POLICY "Product categories are viewable by everyone"
ON product_categories FOR SELECT
TO authenticated
USING (true);

-- Products policies
CREATE POLICY "Products are viewable by everyone if active"
ON products FOR SELECT
TO authenticated
USING (status = 'active' OR seller_id = auth.uid());

CREATE POLICY "Users can create their own products"
ON products FOR INSERT
TO authenticated
WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Users can update their own products"
ON products FOR UPDATE
USING (seller_id = auth.uid());

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
ON reviews FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create their own reviews"
ON reviews FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view messages they sent or received"
ON messages FOR SELECT
TO authenticated
USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages"
ON messages FOR INSERT
TO authenticated
WITH CHECK (sender_id = auth.uid());

-- Saved items policies
CREATE POLICY "Users can view their own saved items"
ON saved_items FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can save items"
ON saved_items FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Create functions
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE products
    SET views = views + 1
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION toggle_product_like(product_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    liked BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM saved_items
        WHERE user_id = toggle_product_like.user_id
        AND saveable_type = 'product'
        AND saveable_id = toggle_product_like.product_id
    ) INTO liked;
    
    IF liked THEN
        DELETE FROM saved_items
        WHERE user_id = toggle_product_like.user_id
        AND saveable_type = 'product'
        AND saveable_id = toggle_product_like.product_id;
        
        UPDATE products
        SET likes = likes - 1
        WHERE id = toggle_product_like.product_id;
        
        RETURN FALSE;
    ELSE
        INSERT INTO saved_items (user_id, saveable_type, saveable_id)
        VALUES (toggle_product_like.user_id, 'product', toggle_product_like.product_id);
        
        UPDATE products
        SET likes = likes + 1
        WHERE id = toggle_product_like.product_id;
        
        RETURN TRUE;
    END IF;
END;
$$ LANGUAGE plpgsql;
