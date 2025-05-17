// swagger-config.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API Taekwondo',
    description: 'API pour la gestion des compétitions de Taekwondo avec synchronisation hors-ligne',
    version: '1.0.0',
    contact: {
      name: 'Support API Taekwondo'
    }
  },
  host: 'localhost:3001',
  basePath: '/api',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  },
  definitions: {
    // Définition de MatchConfiguration
    MatchConfiguration: {
      id: { type: 'string' },
      matchId: { type: 'string' },
      rules: { 
        type: 'string', 
        enum: ['CONVENTIONAL', 'BESTOF3'],
        description: 'Type de règles du match'
      },
      rounds: { 
        type: 'integer',
        description: 'Nombre total de rounds réguliers'
      },
      roundTime: { 
        type: 'string',
        description: 'Durée d\'un round (format MM:SS)',
        example: '02:00'
      },
      restTime: { 
        type: 'string',
        description: 'Temps de repos entre les rounds (format MM:SS)',
        example: '01:00'
      },
      injuryTime: { 
        type: 'string',
        description: 'Temps accordé en cas de blessure (format MM:SS)',
        example: '01:00'
      },
      bodyThreshold: { 
        type: 'integer',
        description: 'Seuil du PSS pour le corps'
      },
      headThreshold: { 
        type: 'integer',
        description: 'Seuil du PSS pour la tête'
      },
      homeVideoReplayQuota: { 
        type: 'integer',
        description: 'Quota de demandes vidéo pour le compétiteur à domicile'
      },
      awayVideoReplayQuota: { 
        type: 'integer',
        description: 'Quota de demandes vidéo pour le compétiteur à l\'extérieur'
      },
      goldenPointEnabled: { 
        type: 'boolean',
        description: 'Indique si le point en or est activé'
      },
      goldenPointTime: { 
        type: 'string',
        description: 'Durée du round en point en or (format MM:SS)',
        example: '01:00'
      },
      maxDifference: { 
        type: 'integer',
        description: 'Écart de points maximum déclenchant la fin du match'
      },
      maxPenalties: { 
        type: 'integer',
        description: 'Nombre maximum de pénalités autorisé'
      }
    },
    
    // Réponses communes
    Error: {
      status: { type: 'string', example: 'error' },
      statusCode: { type: 'integer', example: 400 },
      message: { type: 'string', example: 'Message d\'erreur' }
    },
    
    // Ajouter ici d'autres définitions de modèles si nécessaire
    Unauthorized: {
      description: 'Authentification requise',
      content: {
        'application/json': {
          schema: { $ref: '#/definitions/Error' }
        }
      }
    }
  }
};

const outputFile = './swagger-output.json';
// Liste des fichiers avec les routes à scanner - ajuster les chemins selon votre structure
const endpointsFiles = [
  './src/routes/index.ts',
  './src/routes/auth.routes.ts',
  './src/routes/competitions.routes.ts',
  './src/routes/participants.routes.ts',
  './src/routes/weighins.routes.ts',
  './src/routes/events.routes.ts',
  './src/routes/matches.routes.ts',
  './src/routes/sessions.routes.ts',
  './src/routes/pools.routes.ts',
  './src/routes/competitors.routes.ts',
  './src/routes/organizations.routes.ts',
  './src/routes/users.routes.ts',
  './src/routes/notifications.routes.ts',
  './src/routes/medal-winners.routes.ts',
  './src/routes/licenses.routes.ts',
  './src/routes/match-configuration.routes.ts'
];

// Génération du fichier swagger
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Documentation Swagger générée avec succès');
});