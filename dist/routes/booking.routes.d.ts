import { FastifyInstance } from "fastify";
declare module "fastify" {
    interface FastifyInstance {
        authenticate: any;
        requireAdmin: any;
    }
}
export declare function bookingRoutes(fastify: FastifyInstance): Promise<void>;
