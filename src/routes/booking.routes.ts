import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { BookingController } from "../controllers/booking.controller";
import { BookingStatus } from "../types";

interface BookingError extends Error {
  message: string;
}

export async function bookingRoutes(fastify: FastifyInstance) {
  const controller = new BookingController();

  // Authentication middleware
  async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  }

  // Authorization middleware
  async function authorizeAdmin(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user || request.user.role !== "ADMIN") {
      reply.code(403).send({ error: "Forbidden" });
    }
  }

  // Get all bookings (admin only)
  fastify.get(
    "/",
    {
      preHandler: [authenticate, authorizeAdmin],
    },
    async (request, reply) => {
      return controller.getAllBookings();
    }
  );

  // Get user's bookings
  fastify.get(
    "/my-bookings",
    {
      preHandler: [authenticate],
    },
    async (request, reply) => {
      return controller.getUserBookings(request.user.id);
    }
  );

  // Get booking by id
  fastify.get(
    "/:id",
    {
      preHandler: [authenticate],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      try {
        // If admin, allow access to any booking
        if (request.user.role === "ADMIN") {
          const booking = await controller.getBookingById(id, request.user.id);
          return booking;
        }

        // For regular users, check ownership
        const booking = await controller.getBookingById(id, request.user.id);
        return booking;
      } catch (err) {
        const error = err as BookingError;
        if (error.message === "Unauthorized") {
          reply.code(403).send({ error: "Forbidden" });
          return;
        }
        throw err;
      }
    }
  );

  // Create booking
  fastify.post(
    "/",
    {
      preHandler: [authenticate],
    },
    async (request, reply) => {
      const bookingData = request.body as {
        showTimeId: string;
        seats: string[];
      };
      return controller.createBooking(request.user.id, bookingData);
    }
  );

  // Update booking status (admin only)
  fastify.patch(
    "/:id/status",
    {
      preHandler: [authenticate, authorizeAdmin],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: BookingStatus };
      return controller.updateBookingStatus(id, status);
    }
  );

  // Cancel booking
  fastify.delete(
    "/:id",
    {
      preHandler: [authenticate],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      try {
        // If admin, allow cancellation of any booking
        if (request.user.role === "ADMIN") {
          return controller.updateBookingStatus(id, BookingStatus.CANCELLED);
        }

        // For regular users, check ownership first
        const booking = await controller.getBookingById(id, request.user.id);
        return controller.updateBookingStatus(id, BookingStatus.CANCELLED);
      } catch (err) {
        const error = err as BookingError;
        if (error.message === "Unauthorized") {
          reply.code(403).send({ error: "Forbidden" });
          return;
        }
        throw err;
      }
    }
  );
}
