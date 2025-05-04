"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieController = void 0;
const client_1 = require("@prisma/client");
const types_1 = require("../types");
class MovieController {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async getAllMovies() {
        return this.prisma.movie.findMany({
            orderBy: {
                releaseDate: "desc",
            },
        });
    }
    async getMovieById(id) {
        return this.prisma.movie.findUnique({
            where: { id },
            include: {
                showTimes: {
                    include: {
                        theater: true,
                    },
                },
            },
        });
    }
    async getNowShowingMovies() {
        return this.prisma.movie.findMany({
            where: {
                status: types_1.MovieStatus.NOW_SHOWING,
            },
            orderBy: {
                releaseDate: "desc",
            },
        });
    }
    async getComingSoonMovies() {
        return this.prisma.movie.findMany({
            where: {
                status: types_1.MovieStatus.COMING_SOON,
            },
            orderBy: {
                releaseDate: "asc",
            },
        });
    }
    async createMovie(data) {
        return this.prisma.movie.create({
            data,
        });
    }
    async updateMovie(id, data) {
        return this.prisma.movie.update({
            where: { id },
            data,
        });
    }
    async deleteMovie(id) {
        return this.prisma.movie.delete({
            where: { id },
        });
    }
}
exports.MovieController = MovieController;
