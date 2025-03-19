CREATE TABLE IF NOT EXISTS maintenance_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image_url TEXT,
  rating NUMERIC DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  specialties TEXT[],
  hourly_rate NUMERIC,
  phone TEXT,
  email TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS service_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES service_providers(id) ON DELETE SET NULL,
  category_id UUID REFERENCES maintenance_categories(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

DROP POLICY IF EXISTS "Public maintenance_categories access";
CREATE POLICY "Public maintenance_categories access"
  ON maintenance_categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public service_providers access";
CREATE POLICY "Public service_providers access"
  ON service_providers FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can view their own bookings";
CREATE POLICY "Users can view their own bookings"
  ON service_bookings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own bookings";
CREATE POLICY "Users can insert their own bookings"
  ON service_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own bookings";
CREATE POLICY "Users can update their own bookings"
  ON service_bookings FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own bookings";
CREATE POLICY "Users can delete their own bookings"
  ON service_bookings FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Providers can view their assigned bookings";
CREATE POLICY "Providers can view their assigned bookings"
  ON service_bookings FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM service_providers WHERE id = provider_id
  ));

alter publication supabase_realtime add table maintenance_categories;
alter publication supabase_realtime add table service_providers;
alter publication supabase_realtime add table service_bookings;