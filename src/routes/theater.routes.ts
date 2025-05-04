import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TheaterController } from "../controllers/theater.controller";
import { CreateTheaterDto, UpdateTheaterDto } from "../types";

export async function theaterRoutes(fastify: FastifyInstance) {
  const controller = new TheaterController();

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

  // Get all theaters
  fastify.get("/", async (request, reply) => {
    return controller.getAllTheaters();
  });

  // Get theater by id
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    return controller.getTheaterById(id);
  });

  // Get theaters by city
  fastify.get("/city/:city", async (request, reply) => {
    const { city } = request.params as { city: string };
    return controller.getTheatersByCity(city);
  });

  // Get theater showtimes
  fastify.get("/:id/showtimes", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { date } = request.query as { date?: string };
    return controller.getTheaterShowtimes(id, date);
  });

  // Admin routes
  fastify.post(
    "/",
    {
      preHandler: [authenticate, authorizeAdmin],
    },
    async (request, reply) => {
      const theater = request.body as CreateTheaterDto;
      return controller.createTheater(theater);
    }
  );

  fastify.put(
    "/:id",
    {
      preHandler: [authenticate, authorizeAdmin],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const theater = request.body as UpdateTheaterDto;
      return controller.updateTheater(id, theater);
    }
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [authenticate, authorizeAdmin],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      return controller.deleteTheater(id);
    }
  );
}
