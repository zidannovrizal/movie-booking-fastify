import { FastifyInstance } from "fastify";
import { BookingController } from "../controllers/booking.controller.js";
import { BookingStatus } from "../types/index.js";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
    requireAdmin: any;
  }
}

interface BookingError extends Error {
  message: string;
}

export async function bookingRoutes(fastify: FastifyInstance) {
  const controller = new BookingController();

  // Get all bookings (admin only)
  fastify.get(
    "/",
    {
      onRequest: [fastify.authenticate, fastify.requireAdmin],
    },
    async () => {
      return controller.getAllBookings();
    }
  );

  // Get user's bookings
  fastify.get(
    "/user",
    {
      onRequest: [fastify.authenticate],
    },
    async (request) => {
      return controller.getUserBookings(request.user.id);
    }
  );

  // Get booking by id
  fastify.get(
    "/:id",
    {
      onRequest: [fastify.authenticate],
    },
    async (request) => {
      const { id } = request.params as { id: string };
      return controller.getBookingById(id);
    }
  );

  // Create booking
  fastify.post(
    "/",
    {
      onRequest: [fastify.authenticate],
    },
    async (request) => {
      const userId = request.user.id;
      return controller.createBooking(userId, request.body as any);
    }
  );

  // Update booking status (admin only)
  fastify.patch(
    "/:id/status",
    {
      onRequest: [fastify.authenticate, fastify.requireAdmin],
    },
    async (request) => {
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: BookingStatus };
      return controller.updateBookingStatus(id, status);
    }
  );

  // Cancel booking
  fastify.delete(
    "/:id",
    {
      onRequest: [fastify.authenticate],
    },
    async (request) => {
      const { id } = request.params as { id: string };
      const userId = request.user.id;
      return controller.cancelBooking(id, userId);
    }
  );

  // Get booked seats for a theater, date and time
  fastify.get("/seats/:theaterId/:date/:time", async (request) => {
    const { theaterId, date, time } = request.params as {
      theaterId: string;
      date: string;
      time: string;
    };

    return controller.getBookedSeats(theaterId, date, time);
  });
}
