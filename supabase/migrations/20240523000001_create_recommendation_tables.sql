-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  min_price INTEGER,
  max_price INTEGER,
  min_beds INTEGER,
  min_baths INTEGER,
  preferred_locations TEXT[],
  preferred_property_types TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create browsing history table
CREATE TABLE IF NOT EXISTS browsing_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Create saved properties table
CREATE TABLE IF NOT EXISTS saved_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Add price_numeric column to properties table for easier filtering
ALTER TABLE properties ADD COLUMN IF NOT EXISTS price_numeric INTEGER;

-- Enable row-level security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE browsing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;

-- Create policies for user_preferences
DROP POLICY IF EXISTS "Users can view their own preferences" ON user_preferences;
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own preferences" ON user_preferences;
CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own preferences" ON user_preferences;
CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for browsing_history
DROP POLICY IF EXISTS "Users can view their own browsing history" ON browsing_history;
CREATE POLICY "Users can view their own browsing history"
  ON browsing_history FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own browsing history" ON browsing_history;
CREATE POLICY "Users can insert their own browsing history"
  ON browsing_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for saved_properties
DROP POLICY IF EXISTS "Users can view their own saved properties" ON saved_properties;
CREATE POLICY "Users can view their own saved properties"
  ON saved_properties FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own saved properties" ON saved_properties;
CREATE POLICY "Users can insert their own saved properties"
  ON saved_properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own saved properties" ON saved_properties;
CREATE POLICY "Users can delete their own saved properties"
  ON saved_properties FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime for these tables
alter publication supabase_realtime add table user_preferences;
alter publication supabase_realtime add table browsing_history;
alter publication supabase_realtime add table saved_properties;