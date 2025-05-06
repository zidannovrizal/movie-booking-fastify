export declare class AuthController {
    private prisma;
    constructor();
    register(data: {
        email: string;
        password: string;
        name: string;
        phoneNumber?: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    login(credentials: {
        email: string;
        password: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phoneNumber: string | null;
        profilePicture: string | null;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    getCurrentUser(userId: string): Promise<{
        id: string;
        name: string;
        bookings: ({
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
        })[];
        email: string;
        phoneNumber: string | null;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
}
