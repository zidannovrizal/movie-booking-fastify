import app from "./app.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

const start = async () => {
  try {
    // Add startup logging
    app.log.info(`Starting server with configuration:
      - PORT: ${PORT}
      - HOST: ${HOST}
      - NODE_ENV: ${process.env.NODE_ENV}
      - Database connected: ${Boolean(process.env.DATABASE_URL)}
    `);

    await app.listen({ port: Number(PORT), host: HOST });
    app.log.info(`Server is running on port ${PORT}`);
  } catch (err) {
    app.log.error("Server failed to start:");
    app.log.error(err);
    process.exit(1);
  }
};

// Add global error handler
process.on("unhandledRejection", (err) => {
  app.log.error("Unhandled Promise Rejection:");
  app.log.error(err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  app.log.error("Uncaught Exception:");
  app.log.error(err);
  process.exit(1);
});

start();
