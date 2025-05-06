import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import { MultipartFile } from "@fastify/multipart";
import { pipeline } from "stream/promises";
import { createWriteStream } from "fs";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Get the directory path for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const UPLOAD_DIR = join(__dirname, "..", "..", "uploads");

// Create uploads directory if it doesn't exist
try {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
} catch (error) {
  console.error("Failed to create uploads directory:", error);
}

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

interface UpdateProfileBody {
  name?: string;
  email?: string;
  phoneNumber?: string;
}

interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

export const authRoutes = async function (fastify: FastifyInstance) {
  fastify.log.info("Registering auth routes");

  // Register form parser
  await fastify.register(import("@fastify/formbody"));

  // Register multipart support for file uploads
  await fastify.register(import("@fastify/multipart"), {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    attachFieldsToBody: true,
  });

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
      // Enhanced error logging
      console.error("Login error details:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        email: email,
        prismaConnected: await prisma
          .$connect()
          .then(() => true)
          .catch(() => false),
        jwt_secret_length: JWT_SECRET?.length || 0,
      });

      return reply.status(500).send({
        error: "Internal server error during login",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
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
          profilePicture: true,
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

  // Update profile
  fastify.put<{ Body: UpdateProfileBody }>(
    "/profile",
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const { name, email, phoneNumber } = request.body;
        const userId = request.user.id;

        // Check if any data was provided
        if (!name && !email && !phoneNumber) {
          return reply.status(400).send({
            error: "No data provided",
          });
        }

        // Check if email is being changed and if it's already taken
        if (email) {
          const existingUser = await prisma.user.findFirst({
            where: {
              email,
              NOT: {
                id: userId,
              },
            },
          });

          if (existingUser) {
            return reply.status(400).send({
              error: "Email is already taken",
            });
          }
        }

        // Update user profile
        const user = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            ...(name && { name }),
            ...(email && { email }),
            ...(phoneNumber && { phoneNumber }),
          },
          select: {
            id: true,
            email: true,
            name: true,
            phoneNumber: true,
            profilePicture: true,
            role: true,
          },
        });

        return user;
      } catch (error) {
        console.error("Update profile error:", error);
        throw error;
      }
    }
  );

  // Change password
  fastify.put<{ Body: ChangePasswordBody }>(
    "/change-password",
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const { currentPassword, newPassword } = request.body;
        const userId = request.user.id;

        // Get user with password
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          return reply.status(404).send({
            error: "User not found",
          });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(
          currentPassword,
          user.password
        );

        if (!isValidPassword) {
          return reply.status(400).send({
            error: "Current password is incorrect",
          });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
          where: { id: userId },
          data: {
            password: hashedPassword,
          },
        });

        return { message: "Password updated successfully" };
      } catch (error) {
        console.error("Change password error:", error);
        throw error;
      }
    }
  );

  // Upload profile picture
  fastify.post(
    "/profile-picture",
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const data = await request.file();
        if (!data) {
          throw new Error("No file uploaded");
        }

        // Validate file type
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedMimeTypes.includes(data.mimetype)) {
          throw new Error(
            "Invalid file type. Only JPEG, PNG and WebP are allowed"
          );
        }

        // Generate unique filename
        const fileExt = data.filename.split(".").pop();
        const filename = `${randomUUID()}.${fileExt}`;
        const filepath = join(UPLOAD_DIR, filename);

        // Save file
        await pipeline(data.file, createWriteStream(filepath));

        // Update user profile with new picture URL
        const user = await prisma.user.update({
          where: { id: request.user.id },
          data: {
            profilePicture: `/uploads/${filename}`,
          },
          select: {
            id: true,
            email: true,
            name: true,
            phoneNumber: true,
            profilePicture: true,
            role: true,
          },
        });

        return user;
      } catch (error) {
        console.error("Profile picture upload error:", error);
        throw error;
      }
    }
  );
};
