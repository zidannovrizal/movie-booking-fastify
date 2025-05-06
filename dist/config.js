import "dotenv/config";
export const config = {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
    jwtSecret: process.env.JWT_SECRET || "fallback-secret-key",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    databaseUrl: process.env.DATABASE_URL || "",
};
// Validate required environment variables
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}
//# sourceMappingURL=config.js.map