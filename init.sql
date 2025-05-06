-- Create UserRole enum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- Create BookingStatus enum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "profilePicture" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create Theater table
CREATE TABLE IF NOT EXISTS "Theater" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "address" TEXT NOT NULL,
    "facilities" TEXT[] NOT NULL,
    "capacity" INTEGER NOT NULL,
    "showTimes" TEXT[] NOT NULL,
    "regularPriceWeekday" DOUBLE PRECISION NOT NULL,
    "regularPriceWeekend" DOUBLE PRECISION NOT NULL,
    "vipPriceWeekday" DOUBLE PRECISION NOT NULL,
    "vipPriceWeekend" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create Booking table
CREATE TABLE IF NOT EXISTS "Booking" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "theaterId" TEXT NOT NULL,
    "tmdbMovieId" INTEGER NOT NULL,
    "posterUrl" TEXT,
    "showDate" TIMESTAMP(3) NOT NULL,
    "showTime" TEXT NOT NULL,
    "isVIP" BOOLEAN NOT NULL DEFAULT false,
    "seats" TEXT[] NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "users"("id"),
    FOREIGN KEY ("theaterId") REFERENCES "Theater"("id")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
CREATE INDEX IF NOT EXISTS "booking_userId_idx" ON "Booking"("userId");
CREATE INDEX IF NOT EXISTS "booking_theaterId_idx" ON "Booking"("theaterId"); 