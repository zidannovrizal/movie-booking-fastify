import { ShowTimeController } from "../controllers/showtime.controller.ts";
export async function showtimeRoutes(fastify) {
    const controller = new ShowTimeController();
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
    // Create showtime (admin only)
    fastify.post("/", {
        preHandler: [authenticate, authorizeAdmin],
    }, async (request, reply) => {
        try {
            const data = request.body;
            const showtime = await controller.createShowTime({
                ...data,
                startTime: new Date(data.startTime),
            });
            return showtime;
        }
        catch (error) {
            console.error("Error creating showtime:", error);
            reply.code(500).send({ error: "Failed to create showtime" });
        }
    });
    // Get showtimes by movie
    fastify.get("/movie/:movieId", async (request, reply) => {
        try {
            const { movieId } = request.params;
            const showtimes = await controller.getShowTimesByMovie(parseInt(movieId));
            return showtimes;
        }
        catch (error) {
            console.error("Error fetching showtimes:", error);
            reply.code(500).send({ error: "Failed to fetch showtimes" });
        }
    });
    // Get showtime by id
    fastify.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const showtime = await controller.getShowTimeById(id);
            if (!showtime) {
                reply.code(404).send({ error: "Showtime not found" });
                return;
            }
            return showtime;
        }
        catch (error) {
            console.error("Error fetching showtime:", error);
            reply.code(500).send({ error: "Failed to fetch showtime" });
        }
    });
    // Get available seats for a showtime
    fastify.get("/:id/seats", async (request, reply) => {
        try {
            const { id } = request.params;
            const bookedSeats = await controller.getAvailableSeats(id);
            return { bookedSeats };
        }
        catch (error) {
            console.error("Error fetching available seats:", error);
            reply.code(500).send({ error: "Failed to fetch available seats" });
        }
    });
}
//# sourceMappingURL=showtime.routes.js.map