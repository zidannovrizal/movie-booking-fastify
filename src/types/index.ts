export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum MovieStatus {
  COMING_SOON = "COMING_SOON",
  NOW_SHOWING = "NOW_SHOWING",
  ENDED = "ENDED",
}

export enum BookingStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number;
  releaseDate: Date;
  status: MovieStatus;
  posterUrl: string;
  trailerUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  city: string;
  address: string;
  facilities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTheaterDto {
  name: string;
  location: string;
  city: string;
  address: string;
  facilities: string[];
}

export interface UpdateTheaterDto extends Partial<CreateTheaterDto> {}

export interface CreateMovieDto {
  title: string;
  synopsis: string;
  description: string;
  duration: number;
  rating: string;
  releaseDate: Date;
  status: MovieStatus;
  posterUrl: string;
  trailerUrl?: string;
  cast: string[];
  director: string;
  genre: string[];
  language?: string;
  subtitles: string[];
}

export interface UpdateMovieDto extends Partial<CreateMovieDto> {}
