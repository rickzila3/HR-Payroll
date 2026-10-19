import express, { type Express } from "express";
import cors from "cors";
import { env } from "./config/index.js";
import { requestIdMiddleware } from "./middleware/request-id.middleware.js";
import { notFoundHandler } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { healthRouter } from "./routes/health.routes.js";
import { v1Router } from "./routes/index.js";

export function createApp(): Express {
  const app = express();

  // Basic security and parsing middleware
  app.use(
    cors({
     origin: env.CORS_ORIGINS,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestIdMiddleware);

  // Health endpoints sit outside /v1 per api conventions
  app.use("/health", healthRouter);
  app.use("/healthz", healthRouter);

  // API v1 feature routes
  app.use("/v1", v1Router);

  // 404 Not Found handler
  app.use(notFoundHandler);

  // Centralized Error handler
  app.use(errorHandler);

  return app;
}

export const app: Express = createApp();
