import app from "./app.js";

const PORT = 3001; // Fixed port for backend

app
  .listen({ port: PORT, host: "0.0.0.0" })
  .then(() => {
    console.log(`Server running at http://localhost:${PORT}`);
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });
