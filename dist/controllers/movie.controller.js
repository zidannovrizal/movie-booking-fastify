import { PrismaClient } from "@prisma/client";
import { tmdbService } from "../services/tmdb.service.js";
export class MovieController {
    prisma;
    static instance;
    constructor() {
        if (!MovieController.instance) {
            this.prisma = new PrismaClient({
                log: ["query", "error", "warn"],
            });
            MovieController.instance = this;
        }
        else {
            return MovieController.instance;
        }
    }
    async getAllMovies() {
        return tmdbService.getNowPlayingMovies();
    }
    async getMovieById(id) {
        const movieId = parseInt(id);
        if (isNaN(movieId)) {
            throw new Error("Invalid movie ID");
        }
        return tmdbService.getMovieDetails(movieId);
    }
    async getNowShowingMovies() {
        return tmdbService.getNowPlayingMovies();
    }
    async getComingSoonMovies() {
        return tmdbService.getUpcomingMovies();
    }
    async searchMovies(query) {
        return tmdbService.searchMovies(query);
    }
    // Get theaters and their showtimes for a specific movie
    async getMovieTheaters(movieId) {
        try {
            console.log("Attempting to fetch theaters for movie:", movieId);
            // Test database connection
            await this.prisma.$connect();
            console.log("Database connection successful");
            // Get all theaters
            const theaters = await this.prisma.theater.findMany({
                orderBy: {
                    name: "asc",
                },
            });
            if (!theaters || theaters.length === 0) {
                return {
                    theaters: [],
                    message: "No theaters available",
                };
            }
            // Get existing bookings for this movie to check seat availability
            const bookings = await this.prisma.booking.findMany({
                where: {
                    tmdbMovieId: movieId,
                    showDate: {
                        // Get bookings for today and future dates
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
                select: {
                    theaterId: true,
                    showDate: true,
                    showTime: true,
                    seats: true,
                },
            });
            // Process theaters with booking information
            const theatersWithAvailability = theaters.map((theater) => {
                const theaterBookings = bookings.filter((b) => b.theaterId === theater.id);
                // Group bookings by date and time
                const bookingsByDateTime = {};
                theaterBookings.forEach((booking) => {
                    const key = `${booking.showDate.toISOString().split("T")[0]}_${booking.showTime}`;
                    if (!bookingsByDateTime[key]) {
                        bookingsByDateTime[key] = [];
                    }
                    bookingsByDateTime[key].push(...booking.seats);
                });
                return {
                    ...theater,
                    bookings: bookingsByDateTime,
                };
            });
            console.log("Successfully fetched theaters with availability");
            return {
                theaters: theatersWithAvailability,
                count: theaters.length,
            };
        }
        catch (error) {
            console.error("Error fetching theaters:", error);
            throw new Error(`Failed to fetch theaters: ${error?.message || "Unknown error"}`);
        }
        finally {
            await this.prisma.$disconnect();
        }
    }
    // Create a new booking
    async createBooking(userId, theaterId, movieId, showDate, showTime, seats, isVIP) {
        try {
            await this.prisma.$connect();
            // Validate theater exists
            const theater = await this.prisma.theater.findUnique({
                where: { id: theaterId },
            });
            if (!theater) {
                throw new Error(`Theater with ID ${theaterId} not found`);
            }
            // Check if the showTime is valid
            if (!theater.showTimes.includes(showTime)) {
                throw new Error(`Invalid show time ${showTime} for theater ${theater.name}`);
            }
            // Check if seats are already booked
            const existingBooking = await this.prisma.booking.findFirst({
                where: {
                    theaterId,
                    showDate,
                    showTime,
                    seats: {
                        hasSome: seats,
                    },
                },
            });
            if (existingBooking) {
                throw new Error("One or more selected seats are already booked");
            }
            // Calculate total price based on day of week and seat type
            const isWeekend = [0, 6].includes(showDate.getDay()); // 0 is Sunday, 6 is Saturday
            const pricePerSeat = isWeekend
                ? isVIP
                    ? theater.vipPriceWeekend
                    : theater.regularPriceWeekend
                : isVIP
                    ? theater.vipPriceWeekday
                    : theater.regularPriceWeekday;
            const totalPrice = pricePerSeat * seats.length;
            // Create the booking
            return await this.prisma.booking.create({
                data: {
                    userId,
                    theaterId,
                    tmdbMovieId: movieId,
                    showDate,
                    showTime,
                    seats,
                    isVIP,
                    totalPrice,
                    status: "PENDING",
                },
                include: {
                    theater: true,
                    user: true,
                },
            });
        }
        catch (error) {
            console.error("Error creating booking:", error);
            throw new Error(`Failed to create booking: ${error?.message || "Unknown error"}`);
        }
        finally {
            await this.prisma.$disconnect();
        }
    }
    // Delete a booking
    async deleteBooking(id) {
        try {
            await this.prisma.$connect();
            return await this.prisma.booking.delete({
                where: { id },
            });
        }
        catch (error) {
            console.error("Error deleting booking:", error);
            throw new Error(`Failed to delete booking: ${error?.message || "Unknown error"}`);
        }
        finally {
            await this.prisma.$disconnect();
        }
    }
}
//# sourceMappingURL=movie.controller.js.map