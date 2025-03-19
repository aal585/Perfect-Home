CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  price NUMERIC NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  area NUMERIC NOT NULL,
  area_unit TEXT DEFAULT 'sqm',
  property_type TEXT NOT NULL,
  year_built INTEGER,
  furnished BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS property_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  feature TEXT NOT NULL
);

DROP POLICY IF EXISTS "Public properties access";
CREATE POLICY "Public properties access"
  ON properties FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public property_images access";
CREATE POLICY "Public property_images access"
  ON property_images FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public property_features access";
CREATE POLICY "Public property_features access"
  ON property_features FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own properties";
CREATE POLICY "Users can insert their own properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own properties";
CREATE POLICY "Users can update their own properties"
  ON properties FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own properties";
CREATE POLICY "Users can delete their own properties"
  ON properties FOR DELETE
  USING (auth.uid() = user_id);

alter publication supabase_realtime add table properties;
alter publication supabase_realtime add table property_images;
alter publication supabase_realtime add table property_features;