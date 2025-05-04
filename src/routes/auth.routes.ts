import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface SignupBody {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export const authRoutes = async function (fastify: FastifyInstance) {
  fastify.log.info("Registering auth routes");

  // Sign Up Route
  fastify.post<{ Body: SignupBody }>("/signup", async (request, reply) => {
    fastify.log.info("Received signup request");
    const { email, password, name, phoneNumber } = request.body;

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return reply.status(400).send({
          error: "User with this email already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phoneNumber,
        },
        select: {
          id: true,
          email: true,
          name: true,
          phoneNumber: true,
          role: true,
        },
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      return reply.status(201).send({
        user,
        token,
      });
    } catch (error) {
      console.error("Signup error:", error);
      return reply.status(500).send({
        error: "Internal server error during signup",
      });
    }
  });

  // Login Route
  fastify.post<{ Body: LoginBody }>("/login", async (request, reply) => {
    fastify.log.info("Received login request");
    const { email, password } = request.body;

    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return reply.status(401).send({
          error: "Invalid email or password",
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return reply.status(401).send({
          error: "Invalid email or password",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Return user data (excluding password) and token
      const { password: _, ...userWithoutPassword } = user;

      return reply.send({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      return reply.status(500).send({
        error: "Internal server error during login",
      });
    }
  });

  // Add a test route to verify registration
  fastify.get("/test", async () => {
    return { status: "Auth routes registered successfully" };
  });

  // Get current user profile
  fastify.get("/me", { onRequest: [fastify.authenticate] }, async (request) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: request.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          phoneNumber: true,
          role: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  });
};
