-- Create properties table if it doesn't exist
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  price_numeric INTEGER,
  location TEXT NOT NULL,
  beds INTEGER NOT NULL,
  baths INTEGER NOT NULL,
  area TEXT NOT NULL,
  image TEXT NOT NULL,
  property_type TEXT NOT NULL,
  features TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for properties table
alter publication supabase_realtime add table properties;
