import { UserRole } from "./index";

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
