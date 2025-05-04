"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cors_1 = __importDefault(require("@fastify/cors"));
const movie_routes_1 = require("./routes/movie.routes");
const theater_routes_1 = require("./routes/theater.routes");
const auth_routes_1 = require("./routes/auth.routes");
const booking_routes_1 = require("./routes/booking.routes");
const auth_1 = __importDefault(require("./plugins/auth"));
const app = (0, fastify_1.default)({
    logger: true,
});
// Register core plugins first
app.register(cors_1.default, {
    origin: ["http://localhost:3000", "http://localhost:5173"], // Allow both Vite dev and production ports
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
});
app.register(jwt_1.default, {
    secret: process.env.JWT_SECRET || "supersecret",
});
// Register auth plugin before routes
app.register(auth_1.default);
// Register routes after auth plugin is ready
app.register(async (instance) => {
    instance.register(movie_routes_1.movieRoutes, { prefix: "/api/movies" });
    instance.register(theater_routes_1.theaterRoutes, { prefix: "/api/theaters" });
    instance.register(auth_routes_1.authRoutes, { prefix: "/api/auth" });
    instance.register(booking_routes_1.bookingRoutes, { prefix: "/api/bookings" });
});
// Health check route
app.get("/health", async () => {
    return { status: "ok" };
});
exports.default = app;
