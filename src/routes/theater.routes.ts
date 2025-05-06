import { FastifyInstance } from "fastify";
import { TheaterController } from "../controllers/theater.controller.js";
import { CreateTheaterDto, UpdateTheaterDto } from "../types/index.js";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
    requireAdmin: any;
  }
}

export async function theaterRoutes(fastify: FastifyInstance) {
  const controller = new TheaterController();

  // Get all theaters
  fastify.get("/", async () => {
    return controller.getAllTheaters();
  });

  // Get theater by ID
  fastify.get("/:id", async (request) => {
    const { id } = request.params as { id: string };
    return controller.getTheaterById(id);
  });

  // Get theaters by city
  fastify.get("/city/:city", async (request) => {
    const { city } = request.params as { city: string };
    return controller.getTheatersByCity(city);
  });

  // Get theater showtimes
  fastify.get("/:id/showtimes", async (request) => {
    const { id } = request.params as { id: string };
    const { date } = request.query as { date?: string };
    return controller.getTheaterShowtimes(id, date);
  });

  // Create theater (admin only)
  fastify.post<{ Body: CreateTheaterDto }>(
    "/",
    {
      onRequest: [fastify.authenticate, fastify.requireAdmin],
    },
    async (request) => {
      return controller.createTheater(request.body);
    }
  );

  // Update theater (admin only)
  fastify.put<{ Params: { id: string }; Body: UpdateTheaterDto }>(
    "/:id",
    {
      onRequest: [fastify.authenticate, fastify.requireAdmin],
    },
    async (request) => {
      const { id } = request.params;
      return controller.updateTheater(id, request.body);
    }
  );

  // Delete theater (admin only)
  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    {
      onRequest: [fastify.authenticate, fastify.requireAdmin],
    },
    async (request) => {
      const { id } = request.params;
      return controller.deleteTheater(id);
    }
  );
}
