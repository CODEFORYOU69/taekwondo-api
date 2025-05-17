import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { config } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";
import { PssSocketManager } from "./pss/pssSocket";
import { routerManager } from "./routes";
import { syncManager } from "./sync/sync.manager";

// Initialiser l'application Express
const app = express();
const PORT = config.PORT || 3001;
const pssManager = new PssSocketManager(
  process.env.PSS_PORT ? parseInt(process.env.PSS_PORT) : 8080
);

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

// Démarrer le serveur
const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT} en mode ${config.NODE_ENV}`);

  // Démarrer le gestionnaire de synchronisation si activé
  if (config.SYNC_ENABLED) {
    syncManager.initialize();
    console.log(
      `Synchronisation activée avec un intervalle de ${config.SYNC_INTERVAL} minutes`
    );
  }
});

// Gestion de l'arrêt propre
process.on("SIGTERM", () => {
  console.log("SIGTERM signal reçu: fermeture du serveur HTTP");
  server.close(() => {
    console.log("Serveur HTTP fermé");
    process.exit(0);
  });
});

export default app;
