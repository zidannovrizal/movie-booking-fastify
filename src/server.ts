import app from "./app.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

const start = async () => {
  try {
    await app.listen({ port: Number(PORT), host: HOST });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
