import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
export class AuthController {
    prisma;
    constructor() {
        this.prisma = new PrismaClient();
    }
    async register(data) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phoneNumber: true,
                role: true,
            },
        });
        return user;
    }
    async login(credentials) {
        const user = await this.prisma.user.findUnique({
            where: { email: credentials.email },
        });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
            throw new Error("Invalid credentials");
        }
        // Password is valid, return user data without password
        const { password, ...userData } = user;
        return userData;
    }
    async getCurrentUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                phoneNumber: true,
                role: true,
                bookings: {
                    include: {
                        theater: true,
                    },
                },
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}
//# sourceMappingURL=auth.controller.js.map