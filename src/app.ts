import express, { Application } from "express";
import dotenvFlow from "dotenv-flow";
import cors from "cors";
import { testConnection } from "./database/database";
import routes from "./routes/routes";
import { setupDocs } from "./util/documentation";

dotenvFlow.config();

// Create express application instance
const app: Application = express();

export function setupCors() {
  // kw 2-dec-2024 - Working CORS setup without credentials. Could refactor
  app.use(
    cors({
      origin: "*",
      methods: "GET,HEAD,PUT,OPTIONS,PATCH,POST,DELETE",
      allowedHeaders: [
        "auth-token",
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
      ],
      credentials: true,
    })
  );
}
/**
 * Starts the Express server
 */
export function startServer() {
  setupCors();

  app.use(express.json());

  // Bind the routes to the application
  app.use("/api", routes);

  // Setup Swagger documentation
  setupDocs(app);

  // Test the connection to the database
  testConnection();

  // Start the server
  const PORT: number = parseInt(process.env.PORT as string) || 4000;
  app.listen(PORT, function () {
    console.log("Server is up and running on port: " + PORT);
  });
}
