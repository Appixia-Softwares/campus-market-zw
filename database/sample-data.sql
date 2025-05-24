-- Insert sample universities
INSERT INTO universities (name, location, abbreviation, website, contact_email, contact_phone) VALUES
('University of Zimbabwe', 'Harare', 'UZ', 'https://www.uz.ac.zw', 'info@uz.ac.zw', '+263-4-303211'),
('Midlands State University', 'Gweru', 'MSU', 'https://www.msu.ac.zw', 'info@msu.ac.zw', '+263-54-260404'),
('National University of Science and Technology', 'Bulawayo', 'NUST', 'https://www.nust.ac.zw', 'info@nust.ac.zw', '+263-9-282842'),
('Chinhoyi University of Technology', 'Chinhoyi', 'CUT', 'https://www.cut.ac.zw', 'info@cut.ac.zw', '+263-67-21275'),
('Bindura University of Science Education', 'Bindura', 'BUSE', 'https://www.buse.ac.zw', 'info@buse.ac.zw', '+263-71-7751'),
('Great Zimbabwe University', 'Masvingo', 'GZU', 'https://www.gzu.ac.zw', 'info@gzu.ac.zw', '+263-39-262331'),
('Lupane State University', 'Lupane', 'LSU', 'https://www.lsu.ac.zw', 'info@lsu.ac.zw', '+263-881-236'),
('Manicaland State University of Applied Sciences', 'Mutare', 'MSUAS', 'https://www.msuas.ac.zw', 'info@msuas.ac.zw', '+263-20-64175')
ON CONFLICT (name) DO NOTHING;

-- Insert sample locations
INSERT INTO locations (name, city, province, country, latitude, longitude, description) VALUES
('Avondale', 'Harare', 'Harare', 'Zimbabwe', -17.8047, 31.0669, 'Upmarket residential area near UZ'),
('Mount Pleasant', 'Harare', 'Harare', 'Zimbabwe', -17.7840, 31.0946, 'Popular student accommodation area'),
('Newlands', 'Harare', 'Harare', 'Zimbabwe', -17.7731, 31.1026, 'Quiet residential suburb'),
('Belvedere', 'Harare', 'Harare', 'Zimbabwe', -17.8200, 31.0400, 'Affordable student housing area'),
('Senga', 'Gweru', 'Midlands', 'Zimbabwe', -19.4500, 29.8167, 'Near MSU campus'),
('Ascot', 'Bulawayo', 'Bulawayo', 'Zimbabwe', -20.1500, 28.5833, 'Close to NUST'),
('Suburbs', 'Bulawayo', 'Bulawayo', 'Zimbabwe', -20.1667, 28.5833, 'Central Bulawayo area'),
('Chinhoyi Town', 'Chinhoyi', 'Mashonaland West', 'Zimbabwe', -17.3667, 30.2000, 'Near CUT campus')
ON CONFLICT (name, city) DO NOTHING;

-- Insert accommodation types
INSERT INTO accommodation_types (name, description, icon) VALUES
('Single Room', 'Private single occupancy room', 'bed-single'),
('Shared Room', 'Shared room with other students', 'users'),
('Studio Apartment', 'Self-contained studio unit', 'home'),
('One Bedroom Flat', 'One bedroom apartment', 'building'),
('Two Bedroom Flat', 'Two bedroom apartment', 'building-2'),
('House Share', 'Shared house with multiple rooms', 'home-heart'),
('Hostel Bed', 'Bed in student hostel', 'bed'),
('Cottage', 'Small independent house', 'house')
ON CONFLICT (name) DO NOTHING;

-- Insert amenities
INSERT INTO amenities (name, description, icon, category) VALUES
('WiFi', 'High-speed internet connection', 'wifi', 'connectivity'),
('Air Conditioning', 'Climate control system', 'snowflake', 'comfort'),
('Parking', 'Dedicated parking space', 'car', 'transport'),
('Kitchen', 'Fully equipped kitchen', 'chef-hat', 'facilities'),
('Laundry', 'Washing machine and dryer', 'shirt', 'facilities'),
('Security', '24/7 security service', 'shield', 'safety'),
('Swimming Pool', 'Shared swimming pool', 'waves', 'recreation'),
('Gym', 'Fitness center access', 'dumbbell', 'recreation'),
('Study Room', 'Quiet study area', 'book-open', 'academic'),
('Common Room', 'Shared social space', 'users', 'social'),
('Balcony', 'Private or shared balcony', 'home', 'comfort'),
('Garden', 'Access to garden area', 'trees', 'outdoor')
ON CONFLICT (name) DO NOTHING;

-- Insert product categories
INSERT INTO product_categories (name, description, icon, sort_order) VALUES
('Electronics', 'Phones, laptops, gadgets', 'smartphone', 1),
('Books & Study Materials', 'Textbooks, notes, stationery', 'book', 2),
('Furniture', 'Desks, chairs, storage', 'armchair', 3),
('Clothing & Fashion', 'Clothes, shoes, accessories', 'shirt', 4),
('Sports & Recreation', 'Sports equipment, games', 'football', 5),
('Kitchen & Appliances', 'Cooking equipment, small appliances', 'chef-hat', 6),
('Transport', 'Bicycles, car accessories', 'bike', 7),
('Health & Beauty', 'Personal care, cosmetics', 'heart', 8),
('Music & Entertainment', 'Instruments, games, media', 'music', 9),
('Other', 'Miscellaneous items', 'package', 10)
ON CONFLICT (name) DO NOTHING;

-- Insert subcategories for Electronics
INSERT INTO product_categories (name, description, icon, parent_id, sort_order) 
SELECT 'Smartphones', 'Mobile phones and accessories', 'smartphone', id, 1 FROM product_categories WHERE name = 'Electronics'
ON CONFLICT (name) DO NOTHING;

INSERT INTO product_categories (name, description, icon, parent_id, sort_order) 
SELECT 'Laptops & Computers', 'Computers and accessories', 'laptop', id, 2 FROM product_categories WHERE name = 'Electronics'
ON CONFLICT (name) DO NOTHING;

INSERT INTO product_categories (name, description, icon, parent_id, sort_order) 
SELECT 'Audio & Headphones', 'Speakers, headphones, audio equipment', 'headphones', id, 3 FROM product_categories WHERE name = 'Electronics'
ON CONFLICT (name) DO NOTHING;
