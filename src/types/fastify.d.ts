import { UserRole } from "./index.ts";
import { FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
      email: string;
      role: UserRole;
      iat?: number;
    };
  }

  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    requireAdmin: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}
