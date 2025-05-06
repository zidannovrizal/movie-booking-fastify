import { BookingStatus } from "@prisma/client";
export declare class BookingController {
    private prisma;
    constructor();
    createBooking(userId: string, data: {
        movieId: number;
        theaterId: string;
        posterUrl: string;
        showDate: string;
        showTime: string;
        seats: Array<{
            seatNumber: string;
            isVIP: boolean;
            price: number;
        }>;
        totalPrice: number;
    }): Promise<{
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
    getBookedSeats(theaterId: string, showDate: string, showTime: string): Promise<string[]>;
    getUserBookings(userId: string): Promise<({
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
    })[]>;
    getBookingById(id: string): Promise<({
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
    }) | null>;
    cancelBooking(id: string, userId: string): Promise<{
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
    getAllBookings(): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
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
    })[]>;
    updateBookingStatus(id: string, status: BookingStatus): Promise<{
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
}
