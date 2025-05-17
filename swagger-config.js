// swagger-config.js
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "API Taekwondo",
    description:
      "API pour la gestion des compétitions de Taekwondo avec synchronisation hors-ligne",
    version: "1.0.0",
    contact: {
      name: "Support API Taekwondo",
    },
  },
  host: "localhost:3001",
  basePath: "/api",
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
  definitions: {
    // Utilisateur
    User: {
      id: { type: "string", example: "clg7h9bk40000apcgf4jkld5n" },
      email: { type: "string", format: "email", example: "user@example.com" },
      role: {
        type: "string",
        enum: [
          "super_admin",
          "admin",
          "federation",
          "club",
          "coach",
          "spectator",
        ],
        example: "club",
      },
      firstName: { type: "string", example: "John" },
      lastName: { type: "string", example: "Doe" },
      language: { type: "string", example: "fr" },
      organizationId: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },

    // Erreur
    Error: {
      status: { type: "string", example: "error" },
      statusCode: { type: "integer", example: 400 },
      message: { type: "string", example: "Message d'erreur" },
    },

    // Compétition
    Competition: {
      id: { type: "string", example: "clg7h9bk40001apcgf4jkld5n" },
      name: { type: "string", example: "Championnat de France 2024" },
      hostCity: { type: "string", example: "Paris" },
      hostCountry: {
        type: "string",
        enum: [
          "FRA",
          "KOR",
          "USA",
          "ESP",
          "GER",
          "ITA",
          "GBR",
          "TUR",
          "BRA",
          "CAN",
        ],
        example: "FRA",
      },
      location: { type: "string", example: "AccorHotels Arena" },
      startDate: {
        type: "string",
        format: "date-time",
        example: "2024-07-10T09:00:00Z",
      },
      endDate: {
        type: "string",
        format: "date-time",
        example: "2024-07-12T18:00:00Z",
      },
      dateFormat: { type: "string", example: "EEE dd MMM yyyy" },
      discipline: { type: "string", example: "Taekwondo Kyorugi" },
      grade: { type: "string", example: "G1" },
      isWT: { type: "boolean", example: false },
      isPublic: { type: "boolean", example: true },
      organizerId: { type: "string" },
      createdById: { type: "string" },
    },

    // Participant
    Participant: {
      id: { type: "string" },
      licenseNumber: { type: "string", example: "FRA-12345" },
      galNumber: { type: "string", example: "KOR-9876" },
      source: {
        type: "string",
        enum: ["WT_GMS", "INTERNAL"],
        example: "INTERNAL",
      },
      passportGivenName: { type: "string", example: "Marie" },
      passportFamilyName: { type: "string", example: "DUPONT" },
      preferredGivenName: { type: "string", example: "Marie" },
      preferredFamilyName: { type: "string", example: "Dupont" },
      printName: { type: "string", example: "DUPONT Marie" },
      printInitialName: { type: "string", example: "DUPONT M." },
      tvName: { type: "string", example: "Marie DUPONT" },
      tvInitialName: { type: "string", example: "M. DUPONT" },
      scoreboardName: { type: "string", example: "DUPONT M." },
      gender: {
        type: "string",
        enum: ["MALE", "FEMALE", "MIXED"],
        example: "FEMALE",
      },
      birthDate: {
        type: "string",
        format: "date-time",
        example: "2000-01-15T00:00:00Z",
      },
      mainRole: { type: "string", example: "ATHLETE" },
      country: {
        type: "string",
        enum: [
          "FRA",
          "KOR",
          "USA",
          "ESP",
          "GER",
          "ITA",
          "GBR",
          "TUR",
          "BRA",
          "CAN",
        ],
        example: "FRA",
      },
      status: {
        type: "string",
        enum: ["REGISTERED", "WITHDRAWN", "DISQUALIFIED", "INJURED", "NO_SHOW"],
        example: "REGISTERED",
      },
      organizationId: { type: "string" },
    },

    // Competitor
    Competitor: {
      id: { type: "string" },
      competitorType: {
        type: "string",
        enum: ["A", "T"],
        example: "A",
        description: "A pour Athlete (individuel), T pour Team",
      },
      printName: { type: "string", example: "DUPONT Marie" },
      printInitialName: { type: "string", example: "DUPONT M." },
      tvName: { type: "string", example: "Marie DUPONT" },
      tvInitialName: { type: "string", example: "M. DUPONT" },
      scoreboardName: { type: "string", example: "DUPONT M." },
      rank: { type: "integer", example: 5 },
      seed: { type: "integer", example: 3 },
      country: {
        type: "string",
        enum: [
          "FRA",
          "KOR",
          "USA",
          "ESP",
          "GER",
          "ITA",
          "GBR",
          "TUR",
          "BRA",
          "CAN",
        ],
        example: "FRA",
      },
      eventId: { type: "string" },
      organizationId: { type: "string" },
    },

    // Event
    Event: {
      id: { type: "string" },
      discipline: {
        type: "string",
        enum: ["TKW_K", "TKW_P", "TKW_F", "TKW_T", "PTKW_K", "PTKW_P", "TKW_B"],
        example: "TKW_K",
      },
      division: {
        type: "string",
        enum: [
          "OLYMPIC",
          "SENIORS",
          "YOUTH_OLYMPIC",
          "JUNIORS",
          "CADETS",
          "UNDER_21",
          "KIDS",
          "UNDER_30",
          "UNDER_40",
          "UNDER_50",
          "UNDER_60",
          "OVER_65",
          "OVER_30",
          "UNDER_17",
          "OVER_17",
        ],
        example: "SENIORS",
      },
      gender: {
        type: "string",
        enum: ["MALE", "FEMALE", "MIXED"],
        example: "MALE",
      },
      name: { type: "string", example: "Men -68kg" },
      abbreviation: { type: "string", example: "M -68kg" },
      weightCategory: { type: "string", example: "M -68kg" },
      sportClass: { type: "string", example: "K44" },
      category: { type: "string", example: "Individual" },
      role: { type: "string", example: "ATHLETE" },
      competitionId: { type: "string" },
      competitionType: {
        type: "string",
        enum: ["ELIMINATION", "POOL", "POOL_ELIMINATION"],
        example: "ELIMINATION",
      },
    },

    // Session
    Session: {
      id: { type: "string" },
      name: { type: "string", example: "Session matinale - Jour 1" },
      startTime: { type: "string", format: "date-time" },
      endTime: { type: "string", format: "date-time" },
      scheduleStatus: {
        type: "string",
        enum: [
          "SCHEDULED",
          "GETTING_READY",
          "RUNNING",
          "FINISHED",
          "DELAYED",
          "CANCELLED",
          "POSTPONED",
          "RESCHEDULED",
          "INTERRUPTED",
        ],
        example: "SCHEDULED",
      },
      competitionId: { type: "string" },
    },

    // Match
    Match: {
      id: { type: "string" },
      mat: { type: "integer", example: 1 },
      number: { type: "string", example: "101" },
      phase: {
        type: "string",
        enum: [
          "F",
          "SF",
          "QF",
          "R16",
          "R32",
          "R64",
          "R128",
          "BMC",
          "GMC",
          "RP",
        ],
        example: "QF",
      },
      positionReference: { type: "string", example: "QF-1" },
      scheduleStatus: {
        type: "string",
        enum: [
          "SCHEDULED",
          "GETTING_READY",
          "RUNNING",
          "FINISHED",
          "DELAYED",
          "CANCELLED",
          "POSTPONED",
          "RESCHEDULED",
          "INTERRUPTED",
        ],
        example: "SCHEDULED",
      },
      resultStatus: {
        type: "string",
        enum: [
          "LIVE",
          "INTERMEDIATE",
          "UNCONFIRMED",
          "UNOFFICIAL",
          "OFFICIAL",
          "PROTESTED",
        ],
        example: "LIVE",
      },
      resultDecision: {
        type: "string",
        enum: ["PTF", "PTG", "GDP", "RSC", "SUP", "WDR", "DSQ", "PUN", "DQB"],
        example: "PTF",
      },
      round: { type: "integer", example: 1 },
      roundTime: { type: "string", example: "01:45" },
      homeScore: { type: "integer", example: 5 },
      awayScore: { type: "integer", example: 3 },
      homePenalties: { type: "integer", example: 1 },
      awayPenalties: { type: "integer", example: 0 },
      scheduledStart: { type: "string", format: "date-time" },
      estimatedStart: { type: "string", format: "date-time" },
      actualStart: { type: "string", format: "date-time" },
      eventId: { type: "string" },
      sessionId: { type: "string" },
      homeCompetitorId: { type: "string" },
      awayCompetitorId: { type: "string" },
    },

    // Configuration de match
    MatchConfiguration: {
      id: { type: "string" },
      matchId: { type: "string" },
      rules: {
        type: "string",
        enum: ["CONVENTIONAL", "BESTOF3"],
        example: "CONVENTIONAL",
        description: "Type de règles du match",
      },
      rounds: {
        type: "integer",
        example: 3,
        description: "Nombre total de rounds réguliers",
      },
      roundTime: {
        type: "string",
        example: "02:00",
        description: "Durée d'un round (format MM:SS)",
      },
      restTime: {
        type: "string",
        example: "01:00",
        description: "Temps de repos entre les rounds (format MM:SS)",
      },
      injuryTime: {
        type: "string",
        example: "01:00",
        description: "Temps accordé en cas de blessure (format MM:SS)",
      },
      bodyThreshold: {
        type: "integer",
        example: 20,
        description: "Seuil du PSS pour le corps",
      },
      headThreshold: {
        type: "integer",
        example: 10,
        description: "Seuil du PSS pour la tête",
      },
      homeVideoReplayQuota: {
        type: "integer",
        example: 1,
        description: "Quota de demandes vidéo pour le compétiteur à domicile",
      },
      awayVideoReplayQuota: {
        type: "integer",
        example: 1,
        description:
          "Quota de demandes vidéo pour le compétiteur à l'extérieur",
      },
      goldenPointEnabled: {
        type: "boolean",
        example: true,
        description: "Indique si le point en or est activé",
      },
      goldenPointTime: {
        type: "string",
        example: "01:00",
        description: "Durée du round en point en or (format MM:SS)",
      },
      maxDifference: {
        type: "integer",
        example: 20,
        description: "Écart de points maximum déclenchant la fin du match",
      },
      maxPenalties: {
        type: "integer",
        example: 10,
        description: "Nombre maximum de pénalités autorisé",
      },
    },

    // Assignation des arbitres
    MatchRefereeAssignment: {
      id: { type: "string" },
      matchId: { type: "string" },
      refJ1Id: { type: "string" },
      refJ2Id: { type: "string" },
      refJ3Id: { type: "string" },
      refCRId: { type: "string" },
      refRJId: { type: "string" },
      refTAId: { type: "string" },
      assignedAt: { type: "string", format: "date-time" },
    },

    // Action de match
    MatchAction: {
      id: { type: "string" },
      matchId: { type: "string" },
      action: {
        type: "string",
        enum: [
          "MATCH_LOADED",
          "MATCH_START",
          "ROUND_START",
          "MATCH_TIME",
          "MATCH_TIMEOUT",
          "MATCH_RESUME",
          "ROUND_END",
          "MATCH_END",
          "SCORE_HOME_PUNCH",
          "SCORE_HOME_KICK",
          "SCORE_HOME_TKICK",
          "SCORE_HOME_SKICK",
          "SCORE_HOME_HEAD",
          "SCORE_HOME_THEAD",
          "PENALTY_HOME",
          "SCORE_AWAY_PUNCH",
          "SCORE_AWAY_KICK",
          "SCORE_AWAY_TKICK",
          "SCORE_AWAY_SKICK",
          "SCORE_AWAY_HEAD",
          "SCORE_AWAY_THEAD",
          "PENALTY_AWAY",
          "INVALIDATE_SCORE",
          "ADJUST_SCORE",
          "ADJUST_PENALTY",
          "VR_HOME_REQUEST",
          "VR_HOME_ACCEPTED",
          "VR_HOME_REJECTED",
          "VR_AWAY_REQUEST",
          "VR_AWAY_ACCEPTED",
          "VR_AWAY_REJECTED",
        ],
        example: "SCORE_HOME_KICK",
      },
      hitlevel: { type: "integer", example: 25 },
      round: { type: "integer", example: 1 },
      roundTime: { type: "string", example: "01:45" },
      position: { type: "integer", example: 5 },
      homeScore: { type: "integer", example: 5 },
      awayScore: { type: "integer", example: 3 },
      homePenalties: { type: "integer", example: 1 },
      awayPenalties: { type: "integer", example: 0 },
      description: { type: "string" },
      source: {
        type: "string",
        enum: ["HOME", "AWAY", "CR"],
        example: "HOME",
      },
      timestamp: { type: "string", format: "date-time" },
    },

    // Résultat de match
    MatchResult: {
      id: { type: "string" },
      matchId: { type: "string" },
      status: {
        type: "string",
        enum: [
          "LIVE",
          "INTERMEDIATE",
          "UNCONFIRMED",
          "UNOFFICIAL",
          "OFFICIAL",
          "PROTESTED",
        ],
        example: "OFFICIAL",
      },
      round: { type: "integer", example: 3 },
      position: { type: "integer", example: 1 },
      decision: {
        type: "string",
        enum: ["PTF", "PTG", "GDP", "RSC", "SUP", "WDR", "DSQ", "PUN", "DQB"],
        example: "PTF",
      },
      homeType: {
        type: "string",
        enum: ["WIN", "LOSS", "TIE"],
        example: "WIN",
      },
      awayType: {
        type: "string",
        enum: ["WIN", "LOSS", "TIE"],
        example: "LOSS",
      },
      homeScore: { type: "integer", example: 15 },
      awayScore: { type: "integer", example: 9 },
      homePenalties: { type: "integer", example: 2 },
      awayPenalties: { type: "integer", example: 3 },
      description: { type: "string" },
      timestamp: { type: "string", format: "date-time" },
    },

    // MedalWinner
    MedalWinner: {
      id: { type: "string" },
      eventId: { type: "string" },
      competitorId: { type: "string" },
      medalType: {
        type: "string",
        enum: ["GOLD", "SILVER", "BRONZE"],
        example: "GOLD",
      },
      position: { type: "integer", example: 1 },
    },

    // Organization
    Organization: {
      id: { type: "string" },
      name: { type: "string", example: "French Taekwondo Federation" },
      country: {
        type: "string",
        enum: [
          "FRA",
          "KOR",
          "USA",
          "ESP",
          "GER",
          "ITA",
          "GBR",
          "TUR",
          "BRA",
          "CAN",
        ],
        example: "FRA",
      },
      billingEmail: { type: "string", format: "email" },
      billingAddress: { type: "string" },
      vatNumber: { type: "string" },
    },

    // WeighIn
    WeighIn: {
      id: { type: "string" },
      participantId: { type: "string" },
      competitionId: { type: "string" },
      weight: { type: "number", format: "float", example: 67.8 },
      status: {
        type: "string",
        enum: [
          "NOT_ATTEMPTED",
          "FIRST_FAILED",
          "SECOND_FAILED",
          "VALIDATED",
          "SURCLASSED",
        ],
        example: "VALIDATED",
      },
      attemptDate: { type: "string", format: "date-time" },
      userId: { type: "string" },
      random: { type: "boolean", example: false },
    },

    // Pool
    Pool: {
      id: { type: "string" },
      eventId: { type: "string" },
      name: { type: "string", example: "Pool A" },
      maxAthletes: { type: "integer", example: 5 },
      matchesPerAthlete: { type: "integer", example: 4 },
      pointsForWin: { type: "integer", example: 3 },
      pointsForDraw: { type: "integer", example: 1 },
      pointsForLoss: { type: "integer", example: 0 },
      qualifyingPlaces: { type: "integer", example: 2 },
    },

    // PoolStanding
    PoolStanding: {
      id: { type: "string" },
      poolId: { type: "string" },
      competitorId: { type: "string" },
      matchesPlayed: { type: "integer", example: 4 },
      wins: { type: "integer", example: 3 },
      draws: { type: "integer", example: 0 },
      losses: { type: "integer", example: 1 },
      pointsFor: { type: "integer", example: 25 },
      pointsAgainst: { type: "integer", example: 15 },
      pointsDifference: { type: "integer", example: 10 },
      totalPoints: { type: "integer", example: 9 },
      rank: { type: "integer", example: 1 },
      qualified: { type: "boolean", example: true },
    },

    // Notification
    Notification: {
      id: { type: "string" },
      userId: { type: "string" },
      type: {
        type: "string",
        enum: ["FIGHT_SOON", "FIGHT_RESULT", "RANDOM_WEIGHTIN", "INFO"],
        example: "FIGHT_SOON",
      },
      title: {
        type: "string",
        example: "Votre match commence dans 15 minutes",
      },
      body: {
        type: "string",
        example:
          "Préparez-vous pour votre match M-68kg contre Kim Lee sur le tapis 2",
      },
      seen: { type: "boolean", example: false },
      createdAt: { type: "string", format: "date-time" },
    },

    // License
    License: {
      id: { type: "string" },
      key: { type: "string" },
      type: {
        type: "string",
        enum: ["ENTERPRISE", "PROFESSIONAL", "CLUB", "PARTNER"],
        example: "PROFESSIONAL",
      },
      status: {
        type: "string",
        enum: ["ACTIVE", "EXPIRED", "SUSPENDED", "CANCELLED"],
        example: "ACTIVE",
      },
      machineId: { type: "string" },
      activatedAt: { type: "string", format: "date-time" },
      expiresAt: { type: "string", format: "date-time" },
      maxEvents: { type: "integer", example: 5 },
      maxParticipants: { type: "integer", example: 200 },
      maxUsers: { type: "integer", example: 10 },
      features: { type: "object" },
      organizationId: { type: "string" },
    },

    // Paramètres de requêtes et réponses communes
    CreateParticipantDto: {
      licenseNumber: { type: "string", example: "FRA-12345" },
      passportGivenName: { type: "string", example: "Marie" },
      passportFamilyName: { type: "string", example: "DUPONT" },
      preferredGivenName: { type: "string", example: "Marie" },
      preferredFamilyName: { type: "string", example: "Dupont" },
      gender: {
        type: "string",
        enum: ["MALE", "FEMALE", "MIXED"],
        example: "FEMALE",
      },
      birthDate: {
        type: "string",
        format: "date-time",
        example: "2000-01-15T00:00:00Z",
      },
      mainRole: { type: "string", example: "ATHLETE" },
      country: {
        type: "string",
        enum: [
          "FRA",
          "KOR",
          "USA",
          "ESP",
          "GER",
          "ITA",
          "GBR",
          "TUR",
          "BRA",
          "CAN",
        ],
        example: "FRA",
      },
      organizationId: { type: "string" },
      galNumber: { type: "string", example: "KOR-9876" },
      source: {
        type: "string",
        enum: ["WT_GMS", "INTERNAL"],
        example: "INTERNAL",
      },
      status: {
        type: "string",
        enum: ["REGISTERED", "WITHDRAWN", "DISQUALIFIED", "INJURED", "NO_SHOW"],
        example: "REGISTERED",
      },
    },

    CreateEventDto: {
      discipline: {
        type: "string",
        enum: ["TKW_K", "TKW_P", "TKW_F", "TKW_T", "PTKW_K", "PTKW_P", "TKW_B"],
        example: "TKW_K",
      },
      division: {
        type: "string",
        enum: [
          "OLYMPIC",
          "SENIORS",
          "YOUTH_OLYMPIC",
          "JUNIORS",
          "CADETS",
          "UNDER_21",
          "KIDS",
          "UNDER_30",
          "UNDER_40",
          "UNDER_50",
          "UNDER_60",
          "OVER_65",
          "OVER_30",
          "UNDER_17",
          "OVER_17",
        ],
        example: "SENIORS",
      },
      gender: {
        type: "string",
        enum: ["MALE", "FEMALE", "MIXED"],
        example: "MALE",
      },
      name: { type: "string", example: "Men -68kg" },
      abbreviation: { type: "string", example: "M -68kg" },
      weightCategory: { type: "string", example: "M -68kg" },
      sportClass: { type: "string", example: "K44" },
      category: { type: "string", example: "Individual" },
      role: { type: "string", example: "ATHLETE" },
      competitionId: { type: "string" },
      competitionType: {
        type: "string",
        enum: ["ELIMINATION", "POOL", "POOL_ELIMINATION"],
        example: "ELIMINATION",
      },
    },

    CreateMatchDto: {
      mat: { type: "integer", example: 1 },
      number: { type: "string", example: "101" },
      phase: {
        type: "string",
        enum: [
          "F",
          "SF",
          "QF",
          "R16",
          "R32",
          "R64",
          "R128",
          "BMC",
          "GMC",
          "RP",
        ],
        example: "QF",
      },
      positionReference: { type: "string", example: "QF-1" },
      scheduleStatus: {
        type: "string",
        enum: [
          "SCHEDULED",
          "GETTING_READY",
          "RUNNING",
          "FINISHED",
          "DELAYED",
          "CANCELLED",
          "POSTPONED",
          "RESCHEDULED",
          "INTERRUPTED",
        ],
        example: "SCHEDULED",
      },
      scheduledStart: { type: "string", format: "date-time" },
      eventId: { type: "string" },
      sessionId: { type: "string" },
      homeCompetitorId: { type: "string" },
      awayCompetitorId: { type: "string" },
    },

    UpdateMatchDto: {
      mat: { type: "integer", example: 1 },
      number: { type: "string", example: "101" },
      scheduleStatus: {
        type: "string",
        enum: [
          "SCHEDULED",
          "GETTING_READY",
          "RUNNING",
          "FINISHED",
          "DELAYED",
          "CANCELLED",
          "POSTPONED",
          "RESCHEDULED",
          "INTERRUPTED",
        ],
        example: "SCHEDULED",
      },
      scheduledStart: { type: "string", format: "date-time" },
      sessionId: { type: "string" },
    },

    // Réponses communes
    Unauthorized: {
      description: "Authentification requise",
      content: {
        "application/json": {
          schema: { $ref: "#/definitions/Error" },
        },
      },
    },
  },
};

const outputFile = "./swagger-output.json";
// Liste des fichiers avec les routes à scanner - ajuster les chemins selon votre structure
const endpointsFiles = [
  "./src/routes/index.ts",
  "./src/routes/auth.routes.ts",
  "./src/routes/competition.routes.ts",
  "./src/routes/participants.routes.ts",
  "./src/routes/weighins.routes.ts",
  "./src/routes/events.routes.ts",
  "./src/routes/matches.routes.ts",
  "./src/routes/sessions.routes.ts",
  "./src/routes/pools.routes.ts",
  "./src/routes/competitors.routes.ts",
  "./src/routes/organizations.routes.ts",
  "./src/routes/users.routes.ts",
  "./src/routes/notifications.routes.ts",
  "./src/routes/medal-winners.routes.ts",
  "./src/routes/licenses.routes.ts",
  "./src/routes/match-configuration.routes.ts",
];

// Génération du fichier swagger
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("Documentation Swagger générée avec succès");
});
