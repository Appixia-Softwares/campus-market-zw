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
CREATE TYPE user_status AS ENUM ('active', 'pending', 'inactive', 'suspended');
CREATE TYPE product_status AS ENUM ('active', 'pending', 'sold', 'removed', 'draft');
CREATE TYPE product_condition AS ENUM ('New', 'Like New', 'Good', 'Fair', 'Poor');
CREATE TYPE notification_type AS ENUM ('message', 'system', 'review', 'product');

-- Universities table
CREATE TABLE universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    location TEXT NOT NULL,
    abbreviation TEXT,
    website TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    university_id UUID REFERENCES universities(id),
    role user_role NOT NULL DEFAULT 'user',
    status user_status NOT NULL DEFAULT 'pending',
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    avatar_url TEXT,
    bio TEXT,
    date_of_birth DATE,
    student_id TEXT,
    year_of_study INTEGER,
    course TEXT,
    preferences JSONB DEFAULT '{}',
    last_active TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Locations table
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT,
    country TEXT DEFAULT 'Zimbabwe',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(name, city)
);

-- Product categories table
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    parent_id UUID REFERENCES product_categories(id),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    category_id UUID NOT NULL REFERENCES product_categories(id),
    condition product_condition NOT NULL,
    seller_id UUID NOT NULL REFERENCES users(id),
    status product_status NOT NULL DEFAULT 'pending',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    brand TEXT,
    model TEXT,
    year_purchased INTEGER,
    location TEXT,
    tags TEXT[],
    specifications JSONB DEFAULT '{}',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product images table
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews table for products
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    product_id UUID NOT NULL REFERENCES products(id),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title TEXT,
    comment TEXT,
    pros TEXT,
    cons TEXT,
    helpful_count INTEGER DEFAULT 0,
    verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

-- Review helpfulness tracking
CREATE TABLE review_helpfulness (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (review_id, user_id)
);

-- Messages table for communication between users
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    attachment_url TEXT,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_1_id UUID NOT NULL REFERENCES users(id),
    participant_2_id UUID NOT NULL REFERENCES users(id),
    last_message_id UUID REFERENCES messages(id),
    last_message_at TIMESTAMPTZ,
    product_id UUID REFERENCES products(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (participant_1_id, participant_2_id, product_id)
);

-- User favorites table
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    product_id UUID NOT NULL REFERENCES products(id),
    type TEXT DEFAULT 'product',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Analytics tables
CREATE TABLE page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    page_path TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    session_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    activity_type TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reports table for user reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES users(id),
    reported_type TEXT NOT NULL CHECK (reported_type IN ('user', 'product', 'review', 'message')),
    reported_id UUID NOT NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_university ON users(university_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_condition ON products(condition);

CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_read ON messages(read);

CREATE INDEX idx_conversations_participants ON conversations(participant_1_id, participant_2_id);

CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_product ON user_favorites(product_id);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Insert initial data
INSERT INTO universities (name, location, abbreviation, website) VALUES
('University of Zimbabwe', 'Harare', 'UZ', 'https://www.uz.ac.zw'),
('National University of Science and Technology', 'Bulawayo', 'NUST', 'https://www.nust.ac.zw'),
('Midlands State University', 'Gweru', 'MSU', 'https://www.msu.ac.zw'),
('Harare Institute of Technology', 'Harare', 'HIT', 'https://www.hit.ac.zw'),
('Chinhoyi University of Technology', 'Chinhoyi', 'CUT', 'https://www.cut.ac.zw'),
('Africa University', 'Mutare', 'AU', 'https://www.africau.edu'),
('Bindura University of Science Education', 'Bindura', 'BUSE', 'https://www.buse.ac.zw'),
('Great Zimbabwe University', 'Masvingo', 'GZU', 'https://www.gzu.ac.zw');

INSERT INTO locations (name, city, province, latitude, longitude) VALUES
('Mount Pleasant', 'Harare', 'Harare', -17.7833, 31.0500),
('Avondale', 'Harare', 'Harare', -17.7947, 31.0364),
('Belgravia', 'Harare', 'Harare', -17.8167, 31.0333),
('Newlands', 'Harare', 'Harare', -17.7833, 31.0667),
('Borrowdale', 'Harare', 'Harare', -17.7500, 31.0833),
('Bulawayo CBD', 'Bulawayo', 'Bulawayo', -20.1500, 28.5833),
('Hillside', 'Bulawayo', 'Bulawayo', -20.1167, 28.6000),
('Suburbs', 'Bulawayo', 'Bulawayo', -20.1333, 28.6167),
('Senga', 'Gweru', 'Midlands', -19.4500, 29.8167),
('Mkoba', 'Gweru', 'Midlands', -19.4333, 29.8000),
('Mutare CBD', 'Mutare', 'Manicaland', -18.9667, 32.6667),
('Dangamvura', 'Mutare', 'Manicaland', -18.9833, 32.6500),
('Masvingo CBD', 'Masvingo', 'Masvingo', -20.0667, 30.8333),
('Rujeko', 'Masvingo', 'Masvingo', -20.0833, 30.8167);

INSERT INTO product_categories (name, description, icon) VALUES
('Textbooks', 'Academic textbooks and study materials', 'book'),
('Electronics', 'Electronic devices and accessories', 'smartphone'),
('Furniture', 'Furniture for home or dorm', 'sofa'),
('Clothing', 'Clothing items and accessories', 'shirt'),
('Stationery', 'Stationery and office supplies', 'pen-tool'),
('Kitchen Appliances', 'Appliances for kitchen use', 'utensils'),
('Sports Equipment', 'Equipment for sports and fitness', 'dumbbell'),
('Musical Instruments', 'Musical instruments and accessories', 'music'),
('Art Supplies', 'Art and craft supplies', 'palette'),
('Transportation', 'Bicycles, scooters, and vehicle accessories', 'bike'),
('Health & Beauty', 'Health and beauty products', 'heart'),
('Other', 'Miscellaneous items', 'package');

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpfulness ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view active users" ON users FOR SELECT USING (status = 'active' OR id = auth.uid());
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Universities are viewable by everyone" ON universities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Locations are viewable by everyone" ON locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Product categories are viewable by everyone" ON product_categories FOR SELECT TO authenticated USING (true);

CREATE POLICY "Products are viewable by everyone if active" ON products FOR SELECT TO authenticated USING (status IN ('active', 'sold') OR seller_id = auth.uid());
CREATE POLICY "Users can create their own products" ON products FOR INSERT TO authenticated WITH CHECK (seller_id = auth.uid());
CREATE POLICY "Users can update their own products" ON products FOR UPDATE USING (seller_id = auth.uid());
CREATE POLICY "Users can delete their own products" ON products FOR DELETE USING (seller_id = auth.uid());

CREATE POLICY "Product images are viewable by everyone" ON product_images FOR SELECT TO authenticated USING (true);
CREATE POLICY "Product sellers can manage images" ON product_images FOR ALL TO authenticated USING (
    product_id IN (SELECT id FROM products WHERE seller_id = auth.uid())
);

CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create their own reviews" ON reviews FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own reviews" ON reviews FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Review helpfulness is viewable by everyone" ON review_helpfulness FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage their own review helpfulness" ON review_helpfulness FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can view messages they sent or received" ON messages FOR SELECT TO authenticated USING (sender_id = auth.uid() OR recipient_id = auth.uid());
CREATE POLICY "Users can send messages" ON messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update their own messages" ON messages FOR UPDATE USING (sender_id = auth.uid());

CREATE POLICY "Users can view their own conversations" ON conversations FOR SELECT TO authenticated USING (participant_1_id = auth.uid() OR participant_2_id = auth.uid());
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT TO authenticated WITH CHECK (participant_1_id = auth.uid() OR participant_2_id = auth.uid());

CREATE POLICY "Users can view their own favorites" ON user_favorites FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own favorites" ON user_favorites FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Anyone can insert page views" ON page_views FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can view their own activities" ON user_activities FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can create their own activities" ON user_activities FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own reports" ON reports FOR SELECT TO authenticated USING (reporter_id = auth.uid());
CREATE POLICY "Users can create reports" ON reports FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid());

-- Create functions
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE products
    SET views = views + 1, updated_at = NOW()
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION toggle_product_like(product_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    liked BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM user_favorites
        WHERE user_id = toggle_product_like.user_id
        AND product_id = toggle_product_like.product_id
    ) INTO liked;
    
    IF liked THEN
        DELETE FROM user_favorites
        WHERE user_id = toggle_product_like.user_id
        AND product_id = toggle_product_like.product_id;
        
        UPDATE products
        SET likes = likes - 1, updated_at = NOW()
        WHERE id = toggle_product_like.product_id;
        
        RETURN FALSE;
    ELSE
        INSERT INTO user_favorites (user_id, product_id)
        VALUES (toggle_product_like.user_id, toggle_product_like.product_id);
        
        UPDATE products
        SET likes = likes + 1, updated_at = NOW()
        WHERE id = toggle_product_like.product_id;
        
        RETURN TRUE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations
    SET 
        last_message_id = NEW.id,
        last_message_at = NEW.created_at,
        updated_at = NOW()
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_last_message_trigger
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_last_message();

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_universities_updated_at BEFORE UPDATE ON universities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON product_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
