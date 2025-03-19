-- Create furniture table if it doesn't exist
CREATE TABLE IF NOT EXISTS furniture (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price VARCHAR(255) NOT NULL,
  price_numeric NUMERIC DEFAULT 0,
  category VARCHAR(255),
  image VARCHAR(255),
  rating NUMERIC(3,1) DEFAULT 4.5,
  reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for furniture
INSERT INTO furniture (title, description, price, price_numeric, category, image, rating, reviews)
VALUES 
  ('Modern Sofa', 'Comfortable modern sofa with premium fabric', 'EGP 15,000', 15000, 'Living Room', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', 4.8, 124),
  ('Dining Table Set', 'Elegant dining table with 6 chairs', 'EGP 22,500', 22500, 'Dining Room', 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80', 4.6, 98),
  ('King Size Bed', 'Luxurious king size bed with storage', 'EGP 18,900', 18900, 'Bedroom', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80', 4.9, 156),
  ('Office Desk', 'Modern office desk with drawers', 'EGP 7,500', 7500, 'Office', 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&q=80', 4.7, 87),
  ('Bookshelf', 'Spacious bookshelf with adjustable shelves', 'EGP 5,200', 5200, 'Living Room', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80', 4.5, 62),
  ('Accent Chair', 'Stylish accent chair for living room', 'EGP 4,800', 4800, 'Living Room', 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&q=80', 4.6, 73),
  ('Coffee Table', 'Modern coffee table with storage', 'EGP 6,300', 6300, 'Living Room', 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80', 4.7, 91),
  ('Wardrobe', 'Spacious wardrobe with mirror', 'EGP 12,700', 12700, 'Bedroom', 'https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=800&q=80', 4.8, 104)
ON CONFLICT DO NOTHING;

-- Enable realtime
alter publication supabase_realtime add table furniture;
