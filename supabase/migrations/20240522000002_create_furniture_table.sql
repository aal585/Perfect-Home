CREATE TABLE IF NOT EXISTS furniture_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS furniture_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category_id UUID REFERENCES furniture_categories(id) ON DELETE CASCADE,
  image_url TEXT,
  rating NUMERIC DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS furniture_item_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  furniture_item_id UUID REFERENCES furniture_items(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

DROP POLICY IF EXISTS "Public furniture_categories access";
CREATE POLICY "Public furniture_categories access"
  ON furniture_categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public furniture_items access";
CREATE POLICY "Public furniture_items access"
  ON furniture_items FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public furniture_item_images access";
CREATE POLICY "Public furniture_item_images access"
  ON furniture_item_images FOR SELECT
  USING (true);

alter publication supabase_realtime add table furniture_categories;
alter publication supabase_realtime add table furniture_items;
alter publication supabase_realtime add table furniture_item_images;