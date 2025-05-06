export interface TMDBMovie {
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
export interface TMDBMovieDetails extends TMDBMovie {
    genres: {
        id: number;
        name: string;
    }[];
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
export interface TMDBResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}
export interface FormattedMovie {
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
declare class TMDBService {
    private api;
    private accessToken;
    private imageBaseUrl;
    constructor();
    private get;
    private getImageUrl;
    getNowPlayingMovies(): Promise<FormattedMovie[]>;
    getUpcomingMovies(): Promise<FormattedMovie[]>;
    getMovieDetails(movieId: number): Promise<FormattedMovie>;
    searchMovies(query: string): Promise<FormattedMovie[]>;
    private formatMovieData;
}
export declare const tmdbService: TMDBService;
export {};
