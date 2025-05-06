import { TheaterController } from "../controllers/theater.controller.js";
export async function theaterRoutes(fastify) {
    const controller = new TheaterController();
    // Get all theaters
    fastify.get("/", async () => {
        return controller.getAllTheaters();
    });
    // Get theater by ID
    fastify.get("/:id", async (request) => {
        const { id } = request.params;
        return controller.getTheaterById(id);
    });
    // Get theaters by city
    fastify.get("/city/:city", async (request) => {
        const { city } = request.params;
        return controller.getTheatersByCity(city);
    });
    // Get theater showtimes
    fastify.get("/:id/showtimes", async (request) => {
        const { id } = request.params;
        const { date } = request.query;
        return controller.getTheaterShowtimes(id, date);
    });
    // Create theater (admin only)
    fastify.post("/", {
        onRequest: [fastify.authenticate, fastify.requireAdmin],
    }, async (request) => {
        return controller.createTheater(request.body);
    });
    // Update theater (admin only)
    fastify.put("/:id", {
        onRequest: [fastify.authenticate, fastify.requireAdmin],
    }, async (request) => {
        const { id } = request.params;
        return controller.updateTheater(id, request.body);
    });
    // Delete theater (admin only)
    fastify.delete("/:id", {
        onRequest: [fastify.authenticate, fastify.requireAdmin],
    }, async (request) => {
        const { id } = request.params;
        return controller.deleteTheater(id);
    });
}
//# sourceMappingURL=theater.routes.js.map