import { UserRole } from "../types/index.js";
import fp from "fastify-plugin";
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
    fastify.decorate("requireAdmin", async function (request, reply) {
        const user = request.user;
        if (!user || user.role !== UserRole.ADMIN) {
            reply.code(403).send({ error: "Forbidden" });
        }
    });
}
export default fp(authPlugin, {
    name: "auth-plugin",
    dependencies: ["@fastify/jwt"],
});
//# sourceMappingURL=auth.js.map