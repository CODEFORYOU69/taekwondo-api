import WebSocket from "ws";
import { PssService } from "../services/pss.service";
import { validatePssMessage } from "../dto/pss";
import { logger } from "../utils/logger";

export class PssSocketManager {
  private wss: WebSocket.Server;
  private pssService: PssService;

  constructor(port: number = 8080) {
    this.wss = new WebSocket.Server({ port });
    this.pssService = new PssService();
    this.init();
    logger.info(`PSS WebSocket server démarré sur le port ${port}`);
  }

  private init() {
    this.wss.on("connection", (ws) => {
      logger.info("Nouvelle connexion PSS établie");

      ws.on("message", async (message: WebSocket.Data) => {
        try {
          const parsedMessage = JSON.parse(message.toString());
          const validatedMessage = validatePssMessage(parsedMessage);

          switch (validatedMessage.event) {
            case "match:start":
              await this.pssService.handleMatchStart(validatedMessage.data);
              break;
            case "match:stop":
              await this.pssService.handleMatchStop(validatedMessage.data);
              break;
            case "match:action":
              await this.pssService.handleMatchAction(validatedMessage.data);
              break;
            case "match:config":
              await this.pssService.handleMatchConfig(validatedMessage.data);
              break;
            default:
              logger.warn(
                `Événement PSS non reconnu: ${validatedMessage.event}`
              );
          }
        } catch (error) {
          logger.error("Erreur lors du traitement du message PSS:", error);
        }
      });

      ws.on("close", () => {
        logger.info("Connexion PSS fermée");
      });
    });
  }
}
