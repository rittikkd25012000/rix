-- Create movies table
CREATE TABLE movies (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    video_url TEXT,
    release_year INTEGER,
    duration INTEGER, -- in minutes
    genre VARCHAR(100)[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create RLS (Row Level Security) policies
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Allow read access for authenticated users" 
    ON movies FOR SELECT 
    TO authenticated 
    USING (true);

-- Create watchlist table for users
CREATE TABLE user_watchlist (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id BIGINT REFERENCES movies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(user_id, movie_id)
);

-- Enable RLS for watchlist
ALTER TABLE user_watchlist ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own watchlist
CREATE POLICY "Users can manage their own watchlist"
    ON user_watchlist
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id); 