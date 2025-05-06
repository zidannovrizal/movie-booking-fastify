import { UserRole } from "./index.ts";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
      email: string;
      role: UserRole;
      iat?: number;
    };
  }
}
