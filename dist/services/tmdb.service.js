import axios from "axios";
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
if (!TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY environment variable is not set");
}
class TMDBService {
    api = axios.create({
        baseURL: TMDB_BASE_URL,
        params: {
            api_key: TMDB_API_KEY,
        },
    });
    accessToken;
    imageBaseUrl;
    constructor() {
        this.accessToken =
            "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhM2Y5N2RlMGJmMmNkYzdiZDhmYWJlNWM3MzY2YTI3MiIsIm5iZiI6MS43NDYzNDIxOTAyMDk5OTk4ZSs5LCJzdWIiOiI2ODE3MTEyZWQzOGQ2MmI0Yzc5MTMzZDgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.2EpJA9GZDMGOYisSBTt6GQVJSg6R-nXOpiX8oTPL7io";
        this.imageBaseUrl = "https://image.tmdb.org/t/p";
    }
    async get(url, params) {
        const { data } = await this.api.get(url, { params });
        return data;
    }
    getImageUrl(path, size = "original") {
        if (!path)
            return null;
        return `${this.imageBaseUrl}/${size}${path}`;
    }
    async getNowPlayingMovies() {
        const data = await this.get("/movie/now_playing");
        return Promise.all(data.results.map(async (movie) => {
            const details = await this.getMovieDetails(movie.id);
            return details;
        }));
    }
    async getUpcomingMovies() {
        const data = await this.get("/movie/upcoming");
        return Promise.all(data.results.map(async (movie) => {
            const details = await this.getMovieDetails(movie.id);
            return details;
        }));
    }
    async getMovieDetails(movieId) {
        const data = await this.get(`/movie/${movieId}`, {
            append_to_response: "credits,videos",
        });
        return this.formatMovieData(data);
    }
    async searchMovies(query) {
        const data = await this.get("/search/movie", {
            query,
        });
        return Promise.all(data.results.map(async (movie) => {
            const details = await this.getMovieDetails(movie.id);
            return details;
        }));
    }
    formatMovieData(movie) {
        const formatted = {
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
            productionCompanies: "production_companies" in movie
                ? movie.production_companies.map((company) => company.name)
                : [],
            runtime: "runtime" in movie ? movie.runtime : undefined,
            genres: "genres" in movie && movie.genres
                ? movie.genres.map((g) => g.name).join(", ")
                : undefined,
            cast: "credits" in movie
                ? movie.credits.cast.slice(0, 10).map((actor) => ({
                    id: actor.id,
                    name: actor.name,
                    character: actor.character,
                    profileUrl: this.getImageUrl(actor.profile_path, "w185"),
                }))
                : [],
            director: "credits" in movie
                ? movie.credits.crew.find((person) => person.job === "Director")
                    ?.name || "Unknown"
                : "Unknown",
            trailer: "videos" in movie &&
                movie.videos.results.length > 0 &&
                movie.videos.results.find((video) => video.type === "Trailer" && video.site === "YouTube")
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
//# sourceMappingURL=tmdb.service.js.map