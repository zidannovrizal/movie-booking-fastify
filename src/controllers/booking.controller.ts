import { PrismaClient, Prisma } from "@prisma/client";
import { BookingStatus } from "../types";

export class BookingController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createBooking(
    userId: string,
    data: {
      showTimeId: string;
      seats: string[];
    }
  ) {
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
        status: BookingStatus.PENDING,
      },
      include: {
        showTime: {
          include: {
            theater: true,
          },
        },
      },
    });
  }

  async getUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        showTime: {
          include: {
            theater: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getBookingById(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        showTime: {
          include: {
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

  async cancelBooking(id: string, userId: string) {
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
    if (booking.status !== BookingStatus.PENDING) {
      throw new Error("Booking cannot be cancelled");
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CANCELLED,
      },
      include: {
        showTime: {
          include: {
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
            theater: true,
          },
        },
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
        status: status as any,
      },
      include: {
        showTime: {
          include: {
            theater: true,
          },
        },
      },
    });
  }
}
