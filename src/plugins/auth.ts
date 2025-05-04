import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { UserRole } from "../types";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    authorizeAdmin: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
}

async function authPlugin(fastify: FastifyInstance) {
  // Add authentication decorator
  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ error: "Unauthorized" });
      }
    }
  );

  // Add admin authorization decorator
  fastify.decorate(
    "authorizeAdmin",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const user = request.user;
      if (!user || user.role !== UserRole.ADMIN) {
        reply.code(403).send({ error: "Forbidden" });
      }
    }
  );
}

export default fp(authPlugin, {
  name: "auth-plugin",
  dependencies: ["@fastify/jwt"],
});
