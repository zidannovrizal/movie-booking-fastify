"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const client_1 = require("@prisma/client");
const types_1 = require("../types");
class BookingController {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async createBooking(userId, data) {
        // Get showtime details to calculate price
        const showTime = await this.prisma.showTime.findUnique({
            where: { id: data.showTimeId },
        });
        if (!showTime) {
            throw new Error("Show time not found");
        }
        // Calculate total price
        const totalPrice = showTime.price * data.seats.length;
        // Create booking
        return this.prisma.booking.create({
            data: {
                userId,
                showTimeId: data.showTimeId,
                seats: data.seats,
                totalPrice,
                status: types_1.BookingStatus.PENDING,
            },
            include: {
                showTime: {
                    include: {
                        movie: true,
                        theater: true,
                    },
                },
            },
        });
    }
    async getUserBookings(userId) {
        return this.prisma.booking.findMany({
            where: { userId },
            include: {
                showTime: {
                    include: {
                        movie: true,
                        theater: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getBookingById(id, userId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                showTime: {
                    include: {
                        movie: true,
                        theater: true,
                    },
                },
            },
        });
        if (!booking) {
            throw new Error("Booking not found");
        }
        // Check if the booking belongs to the user
        if (booking.userId !== userId) {
            throw new Error("Unauthorized");
        }
        return booking;
    }
    async cancelBooking(id, userId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
        });
        if (!booking) {
            throw new Error("Booking not found");
        }
        // Check if the booking belongs to the user
        if (booking.userId !== userId) {
            throw new Error("Unauthorized");
        }
        // Check if the booking can be cancelled
        if (booking.status !== types_1.BookingStatus.PENDING) {
            throw new Error("Booking cannot be cancelled");
        }
        return this.prisma.booking.update({
            where: { id },
            data: {
                status: types_1.BookingStatus.CANCELLED,
            },
            include: {
                showTime: {
                    include: {
                        movie: true,
                        theater: true,
                    },
                },
            },
        });
    }
    async getAllBookings() {
        return this.prisma.booking.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                showTime: {
                    include: {
                        movie: true,
                        theater: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async updateBookingStatus(id, status) {
        return this.prisma.booking.update({
            where: { id },
            data: {
                status: status,
            },
            include: {
                showTime: {
                    include: {
                        movie: true,
                        theater: true,
                    },
                },
            },
        });
    }
}
exports.BookingController = BookingController;
