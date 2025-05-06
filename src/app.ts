import fastify from "fastify";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";
import { movieRoutes } from "./routes/movie.routes";
import { theaterRoutes } from "./routes/theater.routes";
import { authRoutes } from "./routes/auth.routes";
import { bookingRoutes } from "./routes/booking.routes";
import { showtimeRoutes } from "./routes/showtime.routes";
import authPlugin from "./plugins/auth";
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
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
  maxAge: 86400, // 24 hours
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
  instance.register(showtimeRoutes, { prefix: "/api/showtimes" });
});

// Health check route
app.get("/health", async () => {
  return { status: "ok" };
});

export default app;
