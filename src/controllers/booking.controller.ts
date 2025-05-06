import { PrismaClient, BookingStatus } from "@prisma/client";

export class BookingController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createBooking(
    userId: string,
    data: {
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
    }
  ) {
    // Check if seats are available
    const existingBookings = await this.prisma.booking.findMany({
      where: {
        theaterId: data.theaterId,
        showDate: new Date(data.showDate),
        showTime: data.showTime,
        status: "CONFIRMED",
      },
      select: {
        seats: true,
      },
    });

    const bookedSeats = existingBookings.flatMap((booking) => booking.seats);
    const requestedSeats = data.seats.map((seat) => seat.seatNumber);

    // Check for double booking
    const doubleBookedSeats = requestedSeats.filter((seat) =>
      bookedSeats.includes(seat)
    );
    if (doubleBookedSeats.length > 0) {
      throw new Error(
        `Seats ${doubleBookedSeats.join(", ")} are already booked`
      );
    }

    // Create booking
    return this.prisma.booking.create({
      data: {
        userId,
        theaterId: data.theaterId,
        tmdbMovieId: data.movieId,
        posterUrl: data.posterUrl,
        showDate: new Date(data.showDate),
        showTime: data.showTime,
        seats: requestedSeats,
        totalPrice: data.totalPrice,
        status: "PENDING",
      },
      include: {
        theater: true,
      },
    });
  }

  async getBookedSeats(theaterId: string, showDate: string, showTime: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        theaterId,
        showDate: new Date(showDate),
        showTime,
        status: {
          in: ["CONFIRMED", "PENDING"],
        },
      },
      select: {
        seats: true,
      },
    });

    return bookings.flatMap((booking) => booking.seats);
  }

  async getUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: {
        userId,
      },
      include: {
        theater: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getBookingById(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        theater: true,
      },
    });
  }

  async cancelBooking(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
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
        theater: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async updateBookingStatus(id: string, status: BookingStatus) {
    return this.prisma.booking.update({
      where: { id },
      data: {
        status,
      },
      include: {
        theater: true,
      },
    });
  }
}
