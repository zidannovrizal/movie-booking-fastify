"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
async function authPlugin(fastify) {
    // Add authentication decorator
    fastify.decorate("authenticate", async function (request, reply) {
        try {
            await request.jwtVerify();
        }
        catch (err) {
            reply.code(401).send({ error: "Unauthorized" });
        }
    });
    // Add admin authorization decorator
    fastify.decorate("authorizeAdmin", async function (request, reply) {
        const user = request.user;
        if (!user || user.role !== types_1.UserRole.ADMIN) {
            reply.code(403).send({ error: "Forbidden" });
        }
    });
}
exports.default = (0, fastify_plugin_1.default)(authPlugin, {
    name: "auth-plugin",
    dependencies: ["@fastify/jwt"],
});
