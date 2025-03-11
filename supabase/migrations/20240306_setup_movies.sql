-- First, drop existing tables if they exist
DROP TABLE IF EXISTS user_watchlist;
DROP TABLE IF EXISTS movies;

-- Create movies table
CREATE TABLE movies (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    video_url TEXT,
    release_year INTEGER,
    duration INTEGER,
    genre VARCHAR(100)[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create watchlist table
CREATE TABLE user_watchlist (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id BIGINT REFERENCES movies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(user_id, movie_id)
);

-- Enable RLS
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_watchlist ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access for authenticated users" 
    ON movies FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Users can manage their own watchlist"
    ON user_watchlist
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Insert sample movies
INSERT INTO movies (title, description, thumbnail_url, video_url, release_year, duration, genre) VALUES
(
    'Inception',
    'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    'https://example.com/inception.mp4',
    2010,
    148,
    ARRAY['Science Fiction', 'Action', 'Thriller']
),
(
    'The Dark Knight',
    'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
    'https://example.com/dark-knight.mp4',
    2008,
    152,
    ARRAY['Action', 'Crime', 'Drama']
),
(
    'Interstellar',
    'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.',
    'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    'https://example.com/interstellar.mp4',
    2014,
    169,
    ARRAY['Science Fiction', 'Adventure', 'Drama']
),
(
    'The Matrix',
    'A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.',
    'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
    'https://example.com/matrix.mp4',
    1999,
    136,
    ARRAY['Science Fiction', 'Action']
),
(
    'Pulp Fiction',
    'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    'https://example.com/pulp-fiction.mp4',
    1994,
    154,
    ARRAY['Crime', 'Drama']
); 