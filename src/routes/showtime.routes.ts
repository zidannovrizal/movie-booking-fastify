import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ShowTimeController } from "../controllers/showtime.controller.ts";

export async function showtimeRoutes(fastify: FastifyInstance) {
  const controller = new ShowTimeController();

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

  // Create showtime (admin only)
  fastify.post(
    "/",
    {
      preHandler: [authenticate, authorizeAdmin],
    },
    async (request, reply) => {
      try {
        const data = request.body as {
          tmdbMovieId: number;
          theaterId: string;
          startTime: string;
          price: number;
        };

        const showtime = await controller.createShowTime({
          ...data,
          startTime: new Date(data.startTime),
        });
        return showtime;
      } catch (error) {
        console.error("Error creating showtime:", error);
        reply.code(500).send({ error: "Failed to create showtime" });
      }
    }
  );

  // Get showtimes by movie
  fastify.get("/movie/:movieId", async (request, reply) => {
    try {
      const { movieId } = request.params as { movieId: string };
      const showtimes = await controller.getShowTimesByMovie(parseInt(movieId));
      return showtimes;
    } catch (error) {
      console.error("Error fetching showtimes:", error);
      reply.code(500).send({ error: "Failed to fetch showtimes" });
    }
  });

  // Get showtime by id
  fastify.get("/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const showtime = await controller.getShowTimeById(id);
      if (!showtime) {
        reply.code(404).send({ error: "Showtime not found" });
        return;
      }
      return showtime;
    } catch (error) {
      console.error("Error fetching showtime:", error);
      reply.code(500).send({ error: "Failed to fetch showtime" });
    }
  });

  // Get available seats for a showtime
  fastify.get("/:id/seats", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const bookedSeats = await controller.getAvailableSeats(id);
      return { bookedSeats };
    } catch (error) {
      console.error("Error fetching available seats:", error);
      reply.code(500).send({ error: "Failed to fetch available seats" });
    }
  });
}
