-- Create maintenance categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS maintenance_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  icon VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance providers table if it doesn't exist
CREATE TABLE IF NOT EXISTS maintenance_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  rating NUMERIC(3,1) DEFAULT 4.5,
  reviews INTEGER DEFAULT 0,
  specialty VARCHAR(255),
  price VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS maintenance_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  provider_id UUID,
  service_type VARCHAR(255) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time VARCHAR(50) NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for maintenance categories
INSERT INTO maintenance_categories (title, description)
VALUES 
  ('Plumbing', 'Fix leaks, install fixtures, and solve drainage issues'),
  ('Electrical', 'Wiring, lighting installation, and electrical repairs'),
  ('HVAC', 'AC repair, heating systems, and ventilation services'),
  ('Painting', 'Interior and exterior painting services'),
  ('Carpentry', 'Custom woodwork, repairs, and installations'),
  ('Cleaning', 'Deep cleaning, regular maintenance, and specialized services')
ON CONFLICT DO NOTHING;

-- Insert sample data for maintenance providers
INSERT INTO maintenance_providers (name, image, rating, reviews, specialty, price)
VALUES 
  ('Ahmed Hassan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed', 4.9, 156, 'Plumbing, Electrical', 'EGP 250/hour'),
  ('Sara Mahmoud', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara', 4.8, 132, 'Painting, Cleaning', 'EGP 200/hour'),
  ('Mohamed Ali', 'https://api.dicebear.com/7.x/avataaars/svg?seed=mohamed', 4.7, 98, 'HVAC, Electrical', 'EGP 275/hour'),
  ('Fatma Ibrahim', 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatma', 4.9, 187, 'Cleaning, Organization', 'EGP 180/hour')
ON CONFLICT DO NOTHING;

-- Enable realtime
alter publication supabase_realtime add table maintenance_categories;
alter publication supabase_realtime add table maintenance_providers;
alter publication supabase_realtime add table maintenance_bookings;
