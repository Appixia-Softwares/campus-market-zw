-- Storage buckets configuration for Supabase Storage
-- Run this after setting up the main schema

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('accommodation-images', 'accommodation-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('product-images', 'product-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', false, 20971520, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('message-attachments', 'message-attachments', false, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'text/plain']),
  ('verification-documents', 'verification-documents', false, 10485760, ARRAY['image/jpeg', 'image/png', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for accommodation images bucket
CREATE POLICY "Accommodation images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'accommodation-images');

CREATE POLICY "Accommodation owners can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'accommodation-images'
  AND EXISTS (
    SELECT 1 FROM accommodations 
    WHERE id::text = (storage.foldername(name))[1] 
    AND owner_id = auth.uid()
  )
);

CREATE POLICY "Accommodation owners can update images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'accommodation-images'
  AND EXISTS (
    SELECT 1 FROM accommodations 
    WHERE id::text = (storage.foldername(name))[1] 
    AND owner_id = auth.uid()
  )
);

CREATE POLICY "Accommodation owners can delete images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'accommodation-images'
  AND EXISTS (
    SELECT 1 FROM accommodations 
    WHERE id::text = (storage.foldername(name))[1] 
    AND owner_id = auth.uid()
  )
);

-- Storage policies for product images bucket
CREATE POLICY "Product images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Product sellers can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1 FROM products 
    WHERE id::text = (storage.foldername(name))[1] 
    AND seller_id = auth.uid()
  )
);

CREATE POLICY "Product sellers can update images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1 FROM products 
    WHERE id::text = (storage.foldername(name))[1] 
    AND seller_id = auth.uid()
  )
);

CREATE POLICY "Product sellers can delete images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1 FROM products 
    WHERE id::text = (storage.foldername(name))[1] 
    AND seller_id = auth.uid()
  )
);

-- Storage policies for documents bucket (private)
CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for message attachments bucket (private)
CREATE POLICY "Users can view message attachments they have access to" ON storage.objects
FOR SELECT USING (
  bucket_id = 'message-attachments'
  AND EXISTS (
    SELECT 1 FROM messages 
    WHERE id::text = (storage.foldername(name))[1]
    AND (sender_id = auth.uid() OR recipient_id = auth.uid())
  )
);

CREATE POLICY "Users can upload message attachments" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'message-attachments'
  AND EXISTS (
    SELECT 1 FROM messages 
    WHERE id::text = (storage.foldername(name))[1]
    AND sender_id = auth.uid()
  )
);

-- Storage policies for verification documents bucket (private)
CREATE POLICY "Users can view their own verification documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'verification-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all verification documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'verification-documents'
  AND EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Users can upload their own verification documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'verification-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own verification documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'verification-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own verification documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'verification-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
