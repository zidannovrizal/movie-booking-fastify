import { PrismaClient } from "@prisma/client";

export class ShowTimeController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createShowTime(data: {
    tmdbMovieId: number;
    theaterId: string;
    startTime: Date;
    price: number;
  }) {
    return this.prisma.showTime.create({
      data,
      include: {
        theater: true,
      },
    });
  }

  async getShowTimesByMovie(tmdbMovieId: number) {
    return this.prisma.showTime.findMany({
      where: {
        tmdbMovieId,
      },
      include: {
        theater: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });
  }

  async getShowTimeById(id: string) {
    return this.prisma.showTime.findUnique({
      where: { id },
      include: {
        theater: true,
      },
    });
  }

  async getAvailableSeats(showTimeId: string) {
    // Get all bookings for this showtime
    const bookings = await this.prisma.booking.findMany({
      where: {
        showTimeId,
        status: "CONFIRMED",
      },
      select: {
        seats: true,
      },
    });

    // Combine all booked seats
    const bookedSeats = bookings.flatMap((booking) => booking.seats);
    return bookedSeats;
  }
}
