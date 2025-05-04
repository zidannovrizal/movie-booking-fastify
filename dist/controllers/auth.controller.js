"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthController {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async register(data) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
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
        const isValidPassword = await bcrypt_1.default.compare(credentials.password, user.password);
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
                        showTime: {
                            include: {
                                movie: true,
                                theater: true,
                            },
                        },
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
exports.AuthController = AuthController;
