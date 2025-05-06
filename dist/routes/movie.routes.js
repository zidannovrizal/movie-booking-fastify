import { MovieController } from "../controllers/movie.controller.js";
const movieController = new MovieController();
export async function movieRoutes(fastify) {
    // Get all movies
    fastify.get("/", async (request, reply) => {
        try {
            return await movieController.getAllMovies();
        }
        catch (error) {
            console.error("Error getting all movies:", error);
            reply.status(500).send({
                error: "Internal Server Error",
                message: error?.message || "Failed to get movies",
            });
        }
    });
    // Get movie by ID
    fastify.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            return await movieController.getMovieById(id);
        }
        catch (error) {
            console.error("Error getting movie by id:", error);
            reply.status(500).send({
                error: "Internal Server Error",
                message: error?.message || "Failed to get movie",
            });
        }
    });
    // Get theaters and their showtimes for a specific movie
    fastify.get("/:id/theaters", async (request, reply) => {
        try {
            const { id } = request.params;
            return await movieController.getMovieTheaters(parseInt(id));
        }
        catch (error) {
            console.error("Error getting movie theaters:", error);
            reply.status(500).send({
                error: "Internal Server Error",
                message: error?.message || "Failed to get theaters",
            });
        }
    });
    // Get now showing movies
    fastify.get("/now-showing", async (request, reply) => {
        try {
            return await movieController.getNowShowingMovies();
        }
        catch (error) {
            console.error("Error getting now showing movies:", error);
            reply.status(500).send({
                error: "Internal Server Error",
                message: error?.message || "Failed to get now showing movies",
            });
        }
    });
    // Get coming soon movies
    fastify.get("/coming-soon", async (request, reply) => {
        try {
            return await movieController.getComingSoonMovies();
        }
        catch (error) {
            console.error("Error getting coming soon movies:", error);
            reply.status(500).send({
                error: "Internal Server Error",
                message: error?.message || "Failed to get coming soon movies",
            });
        }
    });
    // Search movies
    fastify.get("/search", async (request) => {
        const { query } = request.query;
        return movieController.searchMovies(query);
    });
}
//# sourceMappingURL=movie.routes.js.map