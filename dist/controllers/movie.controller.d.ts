import type { FormattedMovie } from "../services/tmdb.service.js";
export declare class MovieController {
    private prisma;
    private static instance;
    constructor();
    getAllMovies(): Promise<FormattedMovie[]>;
    getMovieById(id: string): Promise<FormattedMovie>;
    getNowShowingMovies(): Promise<FormattedMovie[]>;
    getComingSoonMovies(): Promise<FormattedMovie[]>;
    searchMovies(query: string): Promise<FormattedMovie[]>;
    getMovieTheaters(movieId: number): Promise<{
        theaters: never[];
        message: string;
        count?: undefined;
    } | {
        theaters: {
            bookings: Record<string, string[]>;
            id: string;
            name: string;
            location: string;
            city: string;
            country: string;
            address: string;
            facilities: string[];
            capacity: number;
            showTimes: string[];
            regularPriceWeekday: number;
            regularPriceWeekend: number;
            vipPriceWeekday: number;
            vipPriceWeekend: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
        count: number;
        message?: undefined;
    }>;
    createBooking(userId: string, theaterId: string, movieId: number, showDate: Date, showTime: string, seats: string[], isVIP: boolean): Promise<{
        user: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            phoneNumber: string | null;
            profilePicture: string | null;
            role: import(".prisma/client").$Enums.UserRole;
        };
        theater: {
            id: string;
            name: string;
            location: string;
            city: string;
            country: string;
            address: string;
            facilities: string[];
            capacity: number;
            showTimes: string[];
            regularPriceWeekday: number;
            regularPriceWeekend: number;
            vipPriceWeekday: number;
            vipPriceWeekend: number;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: import(".prisma/client").$Enums.BookingStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        theaterId: string;
        tmdbMovieId: number;
        posterUrl: string | null;
        showDate: Date;
        showTime: string;
        isVIP: boolean;
        seats: string[];
        totalPrice: number;
    }>;
    deleteBooking(id: string): Promise<{
        status: import(".prisma/client").$Enums.BookingStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        theaterId: string;
        tmdbMovieId: number;
        posterUrl: string | null;
        showDate: Date;
        showTime: string;
        isVIP: boolean;
        seats: string[];
        totalPrice: number;
    }>;
}
