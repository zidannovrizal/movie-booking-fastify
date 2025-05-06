import app from "./app.js";
import { config } from "./config.js";

const start = async () => {
  try {
    await app.listen({
      port: Number(config.port),
      host: config.host,
    });

    console.log(`Server is running at http://${config.host}:${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
