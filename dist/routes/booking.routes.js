"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = bookingRoutes;
const booking_controller_1 = require("../controllers/booking.controller");
const types_1 = require("../types");
async function bookingRoutes(fastify) {
    const controller = new booking_controller_1.BookingController();
    // Authentication middleware
    async function authenticate(request, reply) {
        try {
            await request.jwtVerify();
        }
        catch (err) {
            reply.code(401).send({ error: "Unauthorized" });
        }
    }
    // Authorization middleware
    async function authorizeAdmin(request, reply) {
        if (!request.user || request.user.role !== "ADMIN") {
            reply.code(403).send({ error: "Forbidden" });
        }
    }
    // Get all bookings (admin only)
    fastify.get("/", {
        preHandler: [authenticate, authorizeAdmin],
    }, async (request, reply) => {
        return controller.getAllBookings();
    });
    // Get user's bookings
    fastify.get("/my-bookings", {
        preHandler: [authenticate],
    }, async (request, reply) => {
        return controller.getUserBookings(request.user.id);
    });
    // Get booking by id
    fastify.get("/:id", {
        preHandler: [authenticate],
    }, async (request, reply) => {
        const { id } = request.params;
        try {
            // If admin, allow access to any booking
            if (request.user.role === "ADMIN") {
                const booking = await controller.getBookingById(id, request.user.id);
                return booking;
            }
            // For regular users, check ownership
            const booking = await controller.getBookingById(id, request.user.id);
            return booking;
        }
        catch (err) {
            const error = err;
            if (error.message === "Unauthorized") {
                reply.code(403).send({ error: "Forbidden" });
                return;
            }
            throw err;
        }
    });
    // Create booking
    fastify.post("/", {
        preHandler: [authenticate],
    }, async (request, reply) => {
        const bookingData = request.body;
        return controller.createBooking(request.user.id, bookingData);
    });
    // Update booking status (admin only)
    fastify.patch("/:id/status", {
        preHandler: [authenticate, authorizeAdmin],
    }, async (request, reply) => {
        const { id } = request.params;
        const { status } = request.body;
        return controller.updateBookingStatus(id, status);
    });
    // Cancel booking
    fastify.delete("/:id", {
        preHandler: [authenticate],
    }, async (request, reply) => {
        const { id } = request.params;
        try {
            // If admin, allow cancellation of any booking
            if (request.user.role === "ADMIN") {
                return controller.updateBookingStatus(id, types_1.BookingStatus.CANCELLED);
            }
            // For regular users, check ownership first
            const booking = await controller.getBookingById(id, request.user.id);
            return controller.updateBookingStatus(id, types_1.BookingStatus.CANCELLED);
        }
        catch (err) {
            const error = err;
            if (error.message === "Unauthorized") {
                reply.code(403).send({ error: "Forbidden" });
                return;
            }
            throw err;
        }
    });
}
