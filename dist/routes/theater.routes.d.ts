import { FastifyInstance } from "fastify";
declare module "fastify" {
    interface FastifyInstance {
        authenticate: any;
        requireAdmin: any;
    }
}
export declare function theaterRoutes(fastify: FastifyInstance): Promise<void>;
