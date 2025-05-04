"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieRoutes = movieRoutes;
const movie_controller_1 = require("../controllers/movie.controller");
async function movieRoutes(fastify) {
    const controller = new movie_controller_1.MovieController();
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
    // Get all movies
    fastify.get("/", async (request, reply) => {
        return controller.getAllMovies();
    });
    // Get movie by id
    fastify.get("/:id", async (request, reply) => {
        const { id } = request.params;
        return controller.getMovieById(id);
    });
    // Get now showing movies
    fastify.get("/now-showing", async (request, reply) => {
        return controller.getNowShowingMovies();
    });
    // Get coming soon movies
    fastify.get("/coming-soon", async (request, reply) => {
        return controller.getComingSoonMovies();
    });
    // Admin routes
    fastify.post("/", {
        preHandler: [authenticate, authorizeAdmin],
    }, async (request, reply) => {
        const movie = request.body;
        return controller.createMovie(movie);
    });
    fastify.put("/:id", {
        preHandler: [authenticate, authorizeAdmin],
    }, async (request, reply) => {
        const { id } = request.params;
        const movie = request.body;
        return controller.updateMovie(id, movie);
    });
    fastify.delete("/:id", {
        preHandler: [authenticate, authorizeAdmin],
    }, async (request, reply) => {
        const { id } = request.params;
        return controller.deleteMovie(id);
    });
}
