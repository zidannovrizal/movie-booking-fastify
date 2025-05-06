import { BookingController } from "../controllers/booking.controller.js";
export async function bookingRoutes(fastify) {
    const controller = new BookingController();
    // Get all bookings (admin only)
    fastify.get("/", {
        onRequest: [fastify.authenticate, fastify.requireAdmin],
    }, async () => {
        return controller.getAllBookings();
    });
    // Get user's bookings
    fastify.get("/user", {
        onRequest: [fastify.authenticate],
    }, async (request) => {
        return controller.getUserBookings(request.user.id);
    });
    // Get booking by id
    fastify.get("/:id", {
        onRequest: [fastify.authenticate],
    }, async (request) => {
        const { id } = request.params;
        return controller.getBookingById(id);
    });
    // Create booking
    fastify.post("/", {
        onRequest: [fastify.authenticate],
    }, async (request) => {
        const userId = request.user.id;
        return controller.createBooking(userId, request.body);
    });
    // Update booking status (admin only)
    fastify.patch("/:id/status", {
        onRequest: [fastify.authenticate, fastify.requireAdmin],
    }, async (request) => {
        const { id } = request.params;
        const { status } = request.body;
        return controller.updateBookingStatus(id, status);
    });
    // Cancel booking
    fastify.delete("/:id", {
        onRequest: [fastify.authenticate],
    }, async (request) => {
        const { id } = request.params;
        const userId = request.user.id;
        return controller.cancelBooking(id, userId);
    });
    // Get booked seats for a theater, date and time
    fastify.get("/seats/:theaterId/:date/:time", async (request) => {
        const { theaterId, date, time } = request.params;
        return controller.getBookedSeats(theaterId, date, time);
    });
}
//# sourceMappingURL=booking.routes.js.map