"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.theaterRoutes = theaterRoutes;
const theater_controller_1 = require("../controllers/theater.controller");
async function theaterRoutes(fastify) {
    const controller = new theater_controller_1.TheaterController();
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
    // Get all theaters
    fastify.get("/", async (request, reply) => {
        return controller.getAllTheaters();
    });
    // Get theater by id
    fastify.get("/:id", async (request, reply) => {
        const { id } = request.params;
        return controller.getTheaterById(id);
    });
    // Get theaters by city
    fastify.get("/city/:city", async (request, reply) => {
        const { city } = request.params;
        return controller.getTheatersByCity(city);
    });
    // Get theater showtimes
    fastify.get("/:id/showtimes", async (request, reply) => {
        const { id } = request.params;
        const { date } = request.query;
        return controller.getTheaterShowtimes(id, date);
    });
    // Admin routes
    fastify.post("/", {
        preHandler: [authenticate, authorizeAdmin],
    }, async (request, reply) => {
        const theater = request.body;
        return controller.createTheater(theater);
    });
    fastify.put("/:id", {
        preHandler: [authenticate, authorizeAdmin],
    }, async (request, reply) => {
        const { id } = request.params;
        const theater = request.body;
        return controller.updateTheater(id, theater);
    });
    fastify.delete("/:id", {
        preHandler: [authenticate, authorizeAdmin],
    }, async (request, reply) => {
        const { id } = request.params;
        return controller.deleteTheater(id);
    });
}
