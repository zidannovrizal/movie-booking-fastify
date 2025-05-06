import { PrismaClient } from "@prisma/client";
import moment from "moment";
import axios from "axios";

const prisma = new PrismaClient();
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

interface TMDBMovie {
  id: number;
  title: string;
}

interface TMDBResponse {
  results: TMDBMovie[];
}

async function getNowPlayingMovies() {
  try {
    const response = await axios.get<TMDBResponse>(
      `${TMDB_BASE_URL}/movie/now_playing`,
      {
        params: {
          api_key: TMDB_API_KEY,
          language: "en-US",
          page: 1,
        },
      }
    );
    return response.data.results
      .slice(0, 10)
      .map((movie: TMDBMovie) => movie.id);
  } catch (error) {
    console.error("Error fetching movies from TMDB:", error);
    throw error;
  }
}

async function createTestShowtimes() {
  try {
    // Create multiple theaters
    const theaters = [
      {
        name: "Cineplex Downtown",
        location: "Downtown",
        city: "Jakarta",
        address: "123 Main St",
        facilities: ["IMAX", "Dolby Sound", "VIP Seats"],
        capacity: 200,
      },
      {
        name: "IMAX City Center",
        location: "City Center",
        city: "Jakarta",
        address: "456 Park Ave",
        facilities: ["IMAX", "4DX", "Premium Seats"],
        capacity: 180,
      },
      {
        name: "MovieMax Mall",
        location: "Shopping Mall",
        city: "Jakarta",
        address: "789 Mall Road",
        facilities: ["Regular", "Dolby Sound"],
        capacity: 150,
      },
    ];

    // Create or update theaters
    const createdTheaters = await Promise.all(
      theaters.map(async (theaterData) => {
        const existing = await prisma.theater.findFirst({
          where: { name: theaterData.name },
        });

        if (existing) {
          return existing;
        }

        return prisma.theater.create({
          data: theaterData,
        });
      })
    );

    console.log(
      "Theaters created:",
      createdTheaters.map((t) => t.name).join(", ")
    );

    // Get movie IDs from TMDB now playing
    console.log("Fetching now playing movies from TMDB...");
    const movieIds = await getNowPlayingMovies();
    console.log("Using movie IDs:", movieIds);

    const showTimes = [
      { time: "11:00", price: 8.99 },
      { time: "14:00", price: 9.99 },
      { time: "17:00", price: 9.99 },
      { time: "20:00", price: 10.99 },
      { time: "22:30", price: 10.99 },
    ];

    // Delete existing showtimes that are in the future
    await prisma.showTime.deleteMany({
      where: {
        startTime: {
          gte: new Date(),
        },
      },
    });

    // Create new showtimes
    for (const movieId of movieIds) {
      for (const theater of createdTheaters) {
        for (let i = 0; i < 7; i++) {
          const date = moment().add(i, "days");

          for (const { time, price } of showTimes) {
            const [hours, minutes] = time.split(":");
            const startTime = date.clone().set({
              hours: parseInt(hours),
              minutes: parseInt(minutes),
              seconds: 0,
              milliseconds: 0,
            });

            // Skip if showtime is in the past
            if (startTime.isBefore(moment())) continue;

            await prisma.showTime.create({
              data: {
                tmdbMovieId: movieId,
                theaterId: theater.id,
                startTime: startTime.toDate(),
                price,
              },
            });
          }
        }
      }
    }

    const totalShowtimes = await prisma.showTime.count({
      where: {
        startTime: {
          gte: new Date(),
        },
      },
    });

    console.log(`Created ${totalShowtimes} showtimes successfully!`);
  } catch (error) {
    console.error("Error creating test data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestShowtimes();
