-- Drop existing tables and types if they exist
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS showtimes CASCADE;
DROP TABLE IF EXISTS theaters CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS movie_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- 1. Create enum types first
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
CREATE TYPE movie_status AS ENUM ('COMING_SOON', 'NOW_SHOWING', 'ENDED');
CREATE TYPE booking_status AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'COMPLETED');

-- 2. Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. Create users table and its trigger
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255),
    role user_role NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Create movies table and its trigger
CREATE TABLE movies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    synopsis TEXT NOT NULL,
    duration INTEGER NOT NULL,
    rating VARCHAR(10) NOT NULL,
    release_date TIMESTAMP WITH TIME ZONE NOT NULL,
    poster_url TEXT NOT NULL,
    trailer_url TEXT,
    actors TEXT[],
    director VARCHAR(255) NOT NULL,
    genre TEXT[],
    language VARCHAR(50) DEFAULT 'Indonesian',
    subtitles TEXT[],
    status movie_status DEFAULT 'NOW_SHOWING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_movies_updated_at
    BEFORE UPDATE ON movies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Create theaters table and its trigger
CREATE TABLE theaters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    facilities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_theaters_updated_at
    BEFORE UPDATE ON theaters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Create showtimes table and its trigger
CREATE TABLE showtimes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id UUID NOT NULL,
    theater_id UUID NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    hall_number VARCHAR(50) NOT NULL,
    seating_map JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id),
    FOREIGN KEY (theater_id) REFERENCES theaters(id)
);

CREATE TRIGGER update_showtimes_updated_at
    BEFORE UPDATE ON showtimes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Create bookings table and its trigger
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    showtime_id UUID NOT NULL,
    seats TEXT[] NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status booking_status DEFAULT 'PENDING',
    payment_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (showtime_id) REFERENCES showtimes(id)
);

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Create indexes
CREATE INDEX idx_movies_status ON movies(status);
CREATE INDEX idx_theaters_city ON theaters(city);
CREATE INDEX idx_showtimes_movie_id ON showtimes(movie_id);
CREATE INDEX idx_showtimes_theater_id ON showtimes(theater_id);
CREATE INDEX idx_showtimes_start_time ON showtimes(start_time);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_showtime_id ON bookings(showtime_id);
CREATE INDEX idx_bookings_status ON bookings(status); 