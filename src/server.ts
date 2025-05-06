import app from "./app.ts";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;

app
  .listen({ port: Number(PORT), host: "0.0.0.0" })
  .then(() => {
    console.log(`Server running at http://localhost:${PORT}`);
  })
  .catch((err: Error) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });
