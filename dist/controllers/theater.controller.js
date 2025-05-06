import { PrismaClient } from "@prisma/client";
export class TheaterController {
    prisma;
    constructor() {
        this.prisma = new PrismaClient();
    }
    async getAllTheaters() {
        return this.prisma.theater.findMany();
    }
    async getTheaterById(id) {
        return this.prisma.theater.findUnique({
            where: { id },
        });
    }
    async getTheatersByCity(city) {
        return this.prisma.theater.findMany({
            where: {
                city: city,
            },
        });
    }
    async getTheaterShowtimes(id, date) {
        const theater = await this.prisma.theater.findUnique({
            where: { id },
        });
        if (!theater) {
            throw new Error("Theater not found");
        }
        return theater.showTimes;
    }
    async createTheater(data) {
        // Set default values if not provided
        const theaterData = {
            ...data,
            capacity: data.capacity || 100, // Default capacity of 100 seats
            country: data.country || "Indonesia", // Default country
            regularPriceWeekday: data.regularPriceWeekday || 50000, // Default weekday price
            regularPriceWeekend: data.regularPriceWeekend || 75000, // Default weekend price
            vipPriceWeekday: data.vipPriceWeekday || 75000, // Default VIP weekday price
            vipPriceWeekend: data.vipPriceWeekend || 100000, // Default VIP weekend price
        };
        return this.prisma.theater.create({
            data: theaterData,
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
//# sourceMappingURL=theater.controller.js.map