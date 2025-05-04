import fastify from "fastify";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";
import { movieRoutes } from "./routes/movie.routes.js";
import { theaterRoutes } from "./routes/theater.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { bookingRoutes } from "./routes/booking.routes.js";
import authPlugin from "./plugins/auth.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fastifyStatic from "@fastify/static";

// Get the directory path for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const UPLOAD_DIR = join(__dirname, "..", "uploads");

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

const app = fastify({
  logger: true,
});

// Register core plugins first
app.register(cors, {
  origin: ["http://localhost:3000", "http://localhost:5173"], // Allow both Vite dev and production ports
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

app.register(jwt, {
  secret: process.env.JWT_SECRET || "supersecret",
});

// Serve uploaded files statically
app.register(fastifyStatic, {
  root: UPLOAD_DIR,
  prefix: "/uploads/",
  decorateReply: false,
});

// Register auth plugin before routes
app.register(authPlugin);

// Register routes after auth plugin is ready
app.register(async (instance) => {
  instance.register(movieRoutes, { prefix: "/api/movies" });
  instance.register(theaterRoutes, { prefix: "/api/theaters" });
  instance.register(authRoutes, { prefix: "/api/auth" });
  instance.register(bookingRoutes, { prefix: "/api/bookings" });
});

// Health check route
app.get("/health", async () => {
  return { status: "ok" };
});

export default app;
