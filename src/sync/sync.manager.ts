import { config } from '../config/env';
import prisma from '../config/database';

class SyncManager {
  private syncInterval: NodeJS.Timeout | null = null;

  /**
   * Initialiser le gestionnaire de synchronisation
   */
  public initialize(): void {
    if (config.SYNC_ENABLED && config.SYNC_INTERVAL > 0) {
      console.log(`Initialisation du système de synchronisation (intervalle: ${config.SYNC_INTERVAL} minutes)`);
      this.startSyncInterval();
    }
  }

  /**
   * Démarrer l'intervalle de synchronisation
   */
  private startSyncInterval(): void {
    // Nettoyer l'intervalle existant si présent
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    // Configurer le nouvel intervalle
    this.syncInterval = setInterval(
      () => this.performSync(),
      config.SYNC_INTERVAL * 60 * 1000 // Convertir les minutes en millisecondes
    );

    // Exécuter une synchronisation immédiate au démarrage
    this.performSync();
  }

  /**
   * Effectuer la synchronisation
   */
  private async performSync(): Promise<void> {
    try {
      console.log(`[SYNC] Démarrage de la synchronisation - ${new Date().toISOString()}`);
      
      // Récupérer les configurations de synchronisation
      const syncConfigs = await prisma.syncConfig.findMany({
        where: { enabled: true }
      });

      // Traiter chaque modèle configuré pour la synchronisation
      for (const config of syncConfigs) {
        try {
          console.log(`[SYNC] Traitement du modèle ${config.modelName}`);
          
          // Implémentation de la synchronisation selon le modèle
          // À compléter avec la logique spécifique à chaque modèle
          
          // Mettre à jour la date de dernière synchronisation
          await prisma.syncConfig.update({
            where: { id: config.id },
            data: { lastSyncedAt: new Date() }
          });
        } catch (error) {
          console.error(`[SYNC ERROR] Modèle ${config.modelName}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
          
          // Enregistrer l'erreur dans les logs de synchronisation
          await prisma.syncLog.create({
            data: {
              modelName: config.modelName,
              recordId: 'BATCH',
              direction: 'BIDIRECTIONAL',
              status: 'ERROR',
              errorMessage: error instanceof Error ? error.message : 'Erreur inconnue'
            }
          });
        }
      }

      console.log(`[SYNC] Synchronisation terminée - ${new Date().toISOString()}`);
    } catch (error) {
      console.error(`[SYNC ERROR] Erreur globale: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Arrêter le gestionnaire de synchronisation
   */
  public stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('[SYNC] Gestionnaire de synchronisation arrêté');
    }
  }
}

export const syncManager = new SyncManager();
