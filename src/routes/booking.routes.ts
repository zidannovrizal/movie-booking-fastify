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
      try {
        const bookings = await controller.getAllBookings();
        return bookings;
      } catch (error) {
        reply.code(500).send({ error: "Failed to fetch bookings" });
      }
    }
  );

  // Get user's bookings
  fastify.get(
    "/user",
    {
      preHandler: [authenticate],
    },
    async (request, reply) => {
      try {
        const bookings = await controller.getUserBookings(request.user.id);
        return bookings;
      } catch (error) {
        reply.code(500).send({ error: "Failed to fetch user bookings" });
      }
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
        const booking = await controller.getBookingById(id, request.user.id);
        return booking;
      } catch (error) {
        const err = error as BookingError;
        if (err.message === "Unauthorized") {
          reply.code(403).send({ error: "Forbidden" });
          return;
        }
        if (err.message === "Booking not found") {
          reply.code(404).send({ error: "Booking not found" });
          return;
        }
        reply.code(500).send({ error: "Failed to fetch booking" });
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
      try {
        const userId = request.user.id;
        const booking = await controller.createBooking(
          userId,
          request.body as any
        );
        return booking;
      } catch (error: any) {
        console.error("Error creating booking:", error);
        if (error.message.includes("already booked")) {
          reply.code(400).send({ error: error.message });
        } else {
          reply.code(500).send({ error: "Failed to create booking" });
        }
      }
    }
  );

  // Update booking status (admin only)
  fastify.patch(
    "/:id/status",
    {
      preHandler: [authenticate, authorizeAdmin],
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const { status } = request.body as { status: BookingStatus };
        const booking = await controller.updateBookingStatus(id, status);
        return booking;
      } catch (error) {
        reply.code(500).send({ error: "Failed to update booking status" });
      }
    }
  );

  // Cancel booking
  fastify.delete(
    "/:id",
    {
      preHandler: [authenticate],
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const userId = request.user.id;
        const booking = await controller.cancelBooking(id, userId);
        return booking;
      } catch (error: any) {
        console.error("Error cancelling booking:", error);
        if (error.message === "Unauthorized") {
          reply.code(403).send({ error: "Unauthorized" });
        } else if (error.message === "Booking not found") {
          reply.code(404).send({ error: "Booking not found" });
        } else {
          reply.code(500).send({ error: "Failed to cancel booking" });
        }
      }
    }
  );

  // Get booked seats for a theater, date and time
  fastify.get("/seats/:theaterId/:date/:time", async (request, reply) => {
    try {
      const { theaterId, date, time } = request.params as {
        theaterId: string;
        date: string;
        time: string;
      };

      const bookedSeats = await controller.getBookedSeats(
        theaterId,
        date,
        time
      );
      return bookedSeats;
    } catch (error) {
      console.error("Error fetching booked seats:", error);
      reply.code(500).send({ error: "Failed to fetch booked seats" });
    }
  });
}
