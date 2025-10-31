-- Create events table for storing live caption events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  creator_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on uid for fast lookups
CREATE INDEX IF NOT EXISTS idx_events_uid ON events(uid);

-- Create index on creator_id for user's events
CREATE INDEX IF NOT EXISTS idx_events_creator_id ON events(creator_id);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all events
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

-- Policy: Users can insert their own events
CREATE POLICY "Users can create events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Policy: Users can update their own events
CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  USING (auth.uid() = creator_id);

-- Policy: Users can delete their own events
CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  USING (auth.uid() = creator_id);
