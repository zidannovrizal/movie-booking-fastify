import { PrismaClient } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";
import { tmdbService } from "../services/tmdb.service";

export class MovieController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllMovies() {
    return tmdbService.getNowPlayingMovies();
  }

  async getMovieById(id: string) {
    const movieId = parseInt(id);
    if (isNaN(movieId)) {
      throw new Error("Invalid movie ID");
    }
    return tmdbService.getMovieDetails(movieId);
  }

  async getNowShowingMovies() {
    return tmdbService.getNowPlayingMovies();
  }

  async getComingSoonMovies() {
    return tmdbService.getUpcomingMovies();
  }

  async searchMovies(query: string) {
    return tmdbService.searchMovies(query);
  }

  // Get showtimes for a specific movie
  async getMovieShowtimes(movieId: number) {
    return this.prisma.showTime.findMany({
      where: {
        tmdbMovieId: movieId,
      },
      include: {
        theater: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });
  }

  // Create a new showtime for a movie
  async createShowtime(
    movieId: number,
    theaterId: string,
    startTime: Date,
    price: number
  ) {
    return this.prisma.showTime.create({
      data: {
        tmdbMovieId: movieId,
        theaterId,
        startTime,
        price,
      },
      include: {
        theater: true,
      },
    });
  }

  // Delete a showtime
  async deleteShowtime(id: string) {
    return this.prisma.showTime.delete({
      where: { id },
    });
  }
}
