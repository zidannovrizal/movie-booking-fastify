import { PrismaClient } from "@prisma/client";
import { CreateTheaterDto, UpdateTheaterDto } from "../types";

export class TheaterController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllTheaters() {
    return this.prisma.theater.findMany({
      include: {
        showTimes: true,
      },
    });
  }

  async getTheaterById(id: string) {
    return this.prisma.theater.findUnique({
      where: { id },
      include: {
        showTimes: true,
      },
    });
  }

  async getTheatersByCity(city: string) {
    return this.prisma.theater.findMany({
      where: {
        city: city,
      },
      include: {
        showTimes: true,
      },
    });
  }

  async getTheaterShowtimes(id: string, date?: string) {
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
        theater: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });
  }

  async createTheater(data: CreateTheaterDto) {
    // Set default capacity if not provided
    const theaterData = {
      ...data,
      capacity: data.capacity || 100, // Default capacity of 100 seats
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
