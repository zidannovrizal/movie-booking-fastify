"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TheaterController = void 0;
const client_1 = require("@prisma/client");
class TheaterController {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async getAllTheaters() {
        return this.prisma.theater.findMany({
            include: {
                showTimes: {
                    include: {
                        movie: true,
                    },
                },
            },
        });
    }
    async getTheaterById(id) {
        return this.prisma.theater.findUnique({
            where: { id },
            include: {
                showTimes: {
                    include: {
                        movie: true,
                    },
                },
            },
        });
    }
    async getTheatersByCity(city) {
        return this.prisma.theater.findMany({
            where: {
                city: {
                    contains: city,
                    mode: "insensitive",
                },
            },
            include: {
                showTimes: {
                    include: {
                        movie: true,
                    },
                },
            },
        });
    }
    async getTheaterShowtimes(id, date) {
        const startDate = date ? new Date(date) : new Date();
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        return this.prisma.showTime.findMany({
            where: {
                theaterId: id,
                startTime: {
                    gte: startDate,
                    lt: endDate,
                },
            },
            include: {
                movie: true,
                theater: true,
            },
            orderBy: {
                startTime: "asc",
            },
        });
    }
    async createTheater(data) {
        return this.prisma.theater.create({
            data,
        });
    }
    async updateTheater(id, data) {
        return this.prisma.theater.update({
            where: { id },
            data,
        });
    }
    async deleteTheater(id) {
        return this.prisma.theater.delete({
            where: { id },
        });
    }
}
exports.TheaterController = TheaterController;
