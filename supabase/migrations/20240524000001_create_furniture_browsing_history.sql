-- Create furniture browsing history table if it doesn't exist
CREATE TABLE IF NOT EXISTS furniture_browsing_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  furniture_id UUID NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_furniture_browsing_history_furniture FOREIGN KEY (furniture_id) REFERENCES furniture(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_furniture_browsing_history_user_id ON furniture_browsing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_furniture_browsing_history_furniture_id ON furniture_browsing_history(furniture_id);

-- Create unique constraint to prevent duplicate entries
ALTER TABLE furniture_browsing_history DROP CONSTRAINT IF EXISTS unique_user_furniture;
ALTER TABLE furniture_browsing_history ADD CONSTRAINT unique_user_furniture UNIQUE (user_id, furniture_id);

-- Enable realtime
alter publication supabase_realtime add table furniture_browsing_history;
