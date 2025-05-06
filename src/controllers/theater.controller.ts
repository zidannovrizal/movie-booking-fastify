import { PrismaClient } from "@prisma/client";
import { CreateTheaterDto, UpdateTheaterDto } from "../types/index.js";

export class TheaterController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllTheaters() {
    return this.prisma.theater.findMany();
  }

  async getTheaterById(id: string) {
    return this.prisma.theater.findUnique({
      where: { id },
    });
  }

  async getTheatersByCity(city: string) {
    return this.prisma.theater.findMany({
      where: {
        city: city,
      },
    });
  }

  async getTheaterShowtimes(id: string, date?: string) {
    const theater = await this.prisma.theater.findUnique({
      where: { id },
    });

    if (!theater) {
      throw new Error("Theater not found");
    }

    return theater.showTimes;
  }

  async createTheater(data: CreateTheaterDto) {
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

  async updateTheater(id: string, data: UpdateTheaterDto) {
    return this.prisma.theater.update({
      where: { id },
      data,
    });
  }

  async deleteTheater(id: string) {
    return this.prisma.theater.delete({
      where: { id },
    });
  }
}
