export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export interface Movie {
  id: number; // TMDB Movie ID
  title: string;
  description: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  rating: number;
  runtime?: number;
  genres?: string;
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  city: string;
  address: string;
  facilities: string[];
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTheaterDto {
  name: string;
  location: string;
  city: string;
  address: string;
  facilities: string[];
  capacity: number;
}

export interface UpdateTheaterDto extends Partial<CreateTheaterDto> {}

export interface ShowTime {
  id: string;
  tmdbMovieId: number;
  theaterId: string;
  startTime: Date;
  price: number;
  theater?: Theater;
}

export interface Booking {
  id: string;
  userId: string;
  showTimeId: string;
  seats: string[];
  totalPrice: number;
  status: BookingStatus;
  showTime?: ShowTime;
  createdAt: Date;
  updatedAt: Date;
}
