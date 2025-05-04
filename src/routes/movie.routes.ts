import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { MovieController } from "../controllers/movie.controller";
import { CreateMovieDto, UpdateMovieDto } from "../types";

export async function movieRoutes(fastify: FastifyInstance) {
  const controller = new MovieController();

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

  // Get all movies
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

  // Admin routes
  fastify.post(
    "/",
    {
      preHandler: [authenticate, authorizeAdmin],
    },
    async (request, reply) => {
      const movie = request.body as CreateMovieDto;
      return controller.createMovie(movie);
    }
  );

  fastify.put(
    "/:id",
    {
      preHandler: [authenticate, authorizeAdmin],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const movie = request.body as UpdateMovieDto;
      return controller.updateMovie(id, movie);
    }
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [authenticate, authorizeAdmin],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      return controller.deleteMovie(id);
    }
  );
}
