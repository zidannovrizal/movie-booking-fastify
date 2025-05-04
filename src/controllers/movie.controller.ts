import { PrismaClient } from "@prisma/client";
import { CreateMovieDto, MovieStatus, UpdateMovieDto } from "../types";

export class MovieController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllMovies() {
    return this.prisma.movie.findMany({
      orderBy: {
        releaseDate: "desc",
      },
    });
  }

  async getMovieById(id: string) {
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
        status: MovieStatus.NOW_SHOWING,
      },
      orderBy: {
        releaseDate: "desc",
      },
    });
  }

  async getComingSoonMovies() {
    return this.prisma.movie.findMany({
      where: {
        status: MovieStatus.COMING_SOON,
      },
      orderBy: {
        releaseDate: "asc",
      },
    });
  }

  async createMovie(data: CreateMovieDto) {
    return this.prisma.movie.create({
      data,
    });
  }

  async updateMovie(id: string, data: UpdateMovieDto) {
    return this.prisma.movie.update({
      where: { id },
      data,
    });
  }

  async deleteMovie(id: string) {
    return this.prisma.movie.delete({
      where: { id },
    });
  }
}
