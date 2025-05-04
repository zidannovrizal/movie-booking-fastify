import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { MovieController } from "../controllers/movie.controller";

export async function movieRoutes(fastify: FastifyInstance) {
  const controller = new MovieController();

  // Get all movies (now playing)
  fastify.get("/", async (request, reply) => {
    return controller.getAllMovies();
  });

  // Get movie by id
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
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

  // Search movies
  fastify.get("/search", async (request, reply) => {
    const { query } = request.query as { query: string };
    if (!query) {
      reply.code(400).send({ error: "Search query is required" });
      return;
    }
    return controller.searchMovies(query);
  });

  // Get movie showtimes
  fastify.get("/:id/showtimes", async (request, reply) => {
    const { id } = request.params as { id: string };
    const movieId = parseInt(id);
    if (isNaN(movieId)) {
      reply.code(400).send({ error: "Invalid movie ID" });
      return;
    }
    return controller.getMovieShowtimes(movieId);
  });
}
