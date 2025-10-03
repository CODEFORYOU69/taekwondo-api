import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { config } from "../src/config/env";
import { errorMiddleware } from "../src/middleware/error.middleware";
import { routerManager } from "../src/routes";

// Initialiser l'application Express pour Vercel serverless
const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(helmet());
app.use(compression());

// Routes API
app.use("/api", routerManager);

// Documentation Swagger
if (config.NODE_ENV !== "production") {
  const swaggerUi = require("swagger-ui-express");
  const swaggerDocument = require("../swagger/openapi.json");
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Middleware de gestion d'erreurs
app.use(errorMiddleware);

// Export pour Vercel serverless
export default app;
