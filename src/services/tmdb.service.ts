import axios from "axios";
import { PrismaClient } from "@prisma/client";

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  original_language: string;
  genre_ids: number[];
  adult: boolean;
  original_title: string;
  video: boolean;
}

interface TMDBMovieDetails extends TMDBMovie {
  genres: { id: number; name: string }[];
  runtime: number;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  homepage: string | null;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  spoken_languages: {
    iso_639_1: string;
    name: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
      order: number;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      department: string;
      profile_path: string | null;
    }[];
  };
  videos: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
}

interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

interface FormattedMovie {
  id: number;
  title: string;
  originalTitle: string;
  description: string;
  tagline: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  rating: number;
  runtime?: number;
  genres?: string;
  status: string;
  language: string;
  budget: number;
  revenue: number;
  homepage: string | null;
  productionCompanies: string[];
  cast: {
    id: number;
    name: string;
    character: string;
    profileUrl: string | null;
  }[];
  director: string;
  trailer: {
    key: string;
    site: string;
  } | null;
}

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY environment variable is not set");
}

class TMDBService {
  private api = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
      api_key: TMDB_API_KEY,
    },
  });

  private accessToken: string;
  private imageBaseUrl: string;

  constructor() {
    this.accessToken =
      "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhM2Y5N2RlMGJmMmNkYzdiZDhmYWJlNWM3MzY2YTI3MiIsIm5iZiI6MS43NDYzNDIxOTAyMDk5OTk4ZSs5LCJzdWIiOiI2ODE3MTEyZWQzOGQ2MmI0Yzc5MTMzZDgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.2EpJA9GZDMGOYisSBTt6GQVJSg6R-nXOpiX8oTPL7io";
    this.imageBaseUrl = "https://image.tmdb.org/t/p";
  }

  private async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const { data } = await this.api.get<T>(url, { params });
    return data;
  }

  private getImageUrl(
    path: string | null,
    size: string = "original"
  ): string | null {
    if (!path) return null;
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  async getNowPlayingMovies(): Promise<FormattedMovie[]> {
    const data = await this.get<TMDBResponse<TMDBMovie>>("/movie/now_playing");
    return Promise.all(
      data.results.map(async (movie) => {
        const details = await this.getMovieDetails(movie.id);
        return details;
      })
    );
  }

  async getUpcomingMovies(): Promise<FormattedMovie[]> {
    const data = await this.get<TMDBResponse<TMDBMovie>>("/movie/upcoming");
    return Promise.all(
      data.results.map(async (movie) => {
        const details = await this.getMovieDetails(movie.id);
        return details;
      })
    );
  }

  async getMovieDetails(movieId: number): Promise<FormattedMovie> {
    const data = await this.get<TMDBMovieDetails>(`/movie/${movieId}`, {
      append_to_response: "credits,videos",
    });
    return this.formatMovieData(data);
  }

  async searchMovies(query: string): Promise<FormattedMovie[]> {
    const data = await this.get<TMDBResponse<TMDBMovie>>("/search/movie", {
      query,
    });
    return Promise.all(
      data.results.map(async (movie) => {
        const details = await this.getMovieDetails(movie.id);
        return details;
      })
    );
  }

  private formatMovieData(movie: TMDBMovie | TMDBMovieDetails): FormattedMovie {
    const formatted: FormattedMovie = {
      id: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      description: movie.overview,
      tagline: "tagline" in movie ? movie.tagline : "",
      posterUrl: this.getImageUrl(movie.poster_path, "w500"),
      backdropUrl: this.getImageUrl(movie.backdrop_path, "original"),
      releaseDate: movie.release_date,
      rating: movie.vote_average,
      status: "status" in movie ? movie.status : "Released",
      language: movie.original_language.toUpperCase(),
      budget: "budget" in movie ? movie.budget : 0,
      revenue: "revenue" in movie ? movie.revenue : 0,
      homepage: "homepage" in movie ? movie.homepage : null,
      productionCompanies:
        "production_companies" in movie
          ? movie.production_companies.map((company) => company.name)
          : [],
      runtime: "runtime" in movie ? movie.runtime : undefined,
      genres:
        "genres" in movie && movie.genres
          ? movie.genres.map((g) => g.name).join(", ")
          : undefined,
      cast:
        "credits" in movie
          ? movie.credits.cast.slice(0, 10).map((actor) => ({
              id: actor.id,
              name: actor.name,
              character: actor.character,
              profileUrl: this.getImageUrl(actor.profile_path, "w185"),
            }))
          : [],
      director:
        "credits" in movie
          ? movie.credits.crew.find((person) => person.job === "Director")
              ?.name || "Unknown"
          : "Unknown",
      trailer:
        "videos" in movie &&
        movie.videos.results.length > 0 &&
        movie.videos.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        )
          ? {
              key: movie.videos.results[0].key,
              site: movie.videos.results[0].site,
            }
          : null,
    };

    return formatted;
  }
}

export const tmdbService = new TMDBService();
