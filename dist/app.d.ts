/// <reference types="node" resolution-mode="require"/>
import fastify from "fastify";
type UserRole = "USER" | "ADMIN";
declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: {
            id: string;
            email: string;
            role: UserRole;
            iat?: number;
        };
        user: {
            id: string;
            email: string;
            role: UserRole;
            iat?: number;
        };
    }
}
declare const app: fastify.FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, fastify.FastifyBaseLogger, fastify.FastifyTypeProviderDefault> & PromiseLike<fastify.FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, fastify.FastifyBaseLogger, fastify.FastifyTypeProviderDefault>>;
export default app;
