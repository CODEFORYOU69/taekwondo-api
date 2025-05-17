-- CreateEnum
CREATE TYPE "Role" AS ENUM ('super_admin', 'admin', 'federation', 'club', 'coach', 'spectator');

-- CreateEnum
CREATE TYPE "VictoryType" AS ENUM ('PTF', 'PTG', 'GDP', 'RSC', 'SUP', 'WDR', 'DSQ', 'PUN', 'DQB');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'MIXED');

-- CreateEnum
CREATE TYPE "ParticipantStatus" AS ENUM ('REGISTERED', 'WITHDRAWN', 'DISQUALIFIED', 'INJURED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "CompetitorType" AS ENUM ('A', 'T');

-- CreateEnum
CREATE TYPE "ScreenType" AS ENUM ('SCOREBOARD', 'SCHEDULE', 'ANNOUNCEMENTS', 'RESULTS');

-- CreateEnum
CREATE TYPE "WeighInStatus" AS ENUM ('NOT_ATTEMPTED', 'FIRST_FAILED', 'SECOND_FAILED', 'VALIDATED', 'SURCLASSED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('FIGHT_SOON', 'FIGHT_RESULT', 'RANDOM_WEIGHTIN', 'INFO');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('MATCH_SHEET', 'CERTIFICATE', 'REPORT', 'ACCREDITATION', 'BADGE');

-- CreateEnum
CREATE TYPE "OfficialRole" AS ENUM ('CR', 'J1', 'J2', 'J3', 'TA', 'RJ', 'INS', 'WEI', 'REFEREE', 'JUDGE', 'TECHNICAL_DIRECTOR', 'DOCTOR');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOCK', 'UNLOCK', 'VALIDATE', 'DISQUALIFY');

-- CreateEnum
CREATE TYPE "ResultType" AS ENUM ('WIN', 'LOSS', 'TIE');

-- CreateEnum
CREATE TYPE "MatchPhase" AS ENUM ('F', 'SF', 'QF', 'R16', 'R32', 'R64', 'R128', 'BMC', 'GMC', 'RP');

-- CreateEnum
CREATE TYPE "WTDiscipline" AS ENUM ('TKW_K', 'TKW_P', 'TKW_F', 'TKW_T', 'PTKW_K', 'PTKW_P', 'TKW_B');

-- CreateEnum
CREATE TYPE "WTDivision" AS ENUM ('OLYMPIC', 'SENIORS', 'YOUTH_OLYMPIC', 'JUNIORS', 'CADETS', 'UNDER_21', 'KIDS', 'UNDER_30', 'UNDER_40', 'UNDER_50', 'UNDER_60', 'OVER_65', 'OVER_30', 'UNDER_17', 'OVER_17');

-- CreateEnum
CREATE TYPE "PssDeviceType" AS ENUM ('KPNP', 'DAEDO');

-- CreateEnum
CREATE TYPE "CountryCode" AS ENUM ('FRA', 'KOR', 'USA', 'ESP', 'GER', 'ITA', 'GBR', 'TUR', 'BRA', 'CAN', 'MEX', 'JPN', 'CHN', 'IND', 'NED', 'SWE', 'POL', 'BEL', 'ARG', 'AUS');

-- CreateEnum
CREATE TYPE "ResultStatus" AS ENUM ('SCHEDULED', 'GETTING_READY', 'RUNNING', 'INTERMEDIATE', 'INTERRUPTED', 'FINISHED', 'OFFICIAL', 'CANCELLED', 'POSTPONED', 'RESCHEDULED', 'UNCONFIRMED', 'UNOFFICIAL', 'PROTESTED', 'LIVE', 'ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('SCHEDULED', 'GETTING_READY', 'RUNNING', 'FINISHED', 'DELAYED', 'CANCELLED', 'POSTPONED', 'RESCHEDULED', 'INTERRUPTED');

-- CreateEnum
CREATE TYPE "CompetitionType" AS ENUM ('ELIMINATION', 'POOL', 'POOL_ELIMINATION');

-- CreateEnum
CREATE TYPE "ParticipantSource" AS ENUM ('WT_GMS', 'INTERNAL');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('MATCH_LOADED', 'MATCH_START', 'ROUND_START', 'MATCH_TIME', 'MATCH_TIMEOUT', 'MATCH_RESUME', 'ROUND_END', 'MATCH_END', 'SCORE_HOME_PUNCH', 'SCORE_HOME_KICK', 'SCORE_HOME_TKICK', 'SCORE_HOME_SKICK', 'SCORE_HOME_HEAD', 'SCORE_HOME_THEAD', 'PENALTY_HOME', 'SCORE_AWAY_PUNCH', 'SCORE_AWAY_KICK', 'SCORE_AWAY_TKICK', 'SCORE_AWAY_SKICK', 'SCORE_AWAY_HEAD', 'SCORE_AWAY_THEAD', 'PENALTY_AWAY', 'INVALIDATE_SCORE', 'INVALIDATE_SCORE_HOME_PUNCH', 'INVALIDATE_SCORE_HOME_KICK', 'INVALIDATE_SCORE_HOME_TKICK', 'INVALIDATE_SCORE_HOME_SKICK', 'INVALIDATE_SCORE_HOME_HEAD', 'INVALIDATE_SCORE_HOME_THEAD', 'INVALIDATE_PENALTY_HOME', 'INVALIDATE_SCORE_AWAY_PUNCH', 'INVALIDATE_SCORE_AWAY_KICK', 'INVALIDATE_SCORE_AWAY_TKICK', 'INVALIDATE_SCORE_AWAY_SKICK', 'INVALIDATE_SCORE_AWAY_HEAD', 'INVALIDATE_SCORE_AWAY_THEAD', 'INVALIDATE_PENALTY_AWAY', 'ADJUST_SCORE', 'ADJUST_PENALTY', 'VR_HOME_REQUEST', 'VR_HOME_ACCEPTED', 'VR_HOME_REJECTED', 'VR_AWAY_REQUEST', 'VR_AWAY_ACCEPTED', 'VR_AWAY_REJECTED');

-- CreateEnum
CREATE TYPE "ActionSource" AS ENUM ('HOME', 'AWAY', 'CR');

-- CreateEnum
CREATE TYPE "MedalType" AS ENUM ('GOLD', 'SILVER', 'BRONZE');

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('ENTERPRISE', 'PROFESSIONAL', 'CLUB', 'PARTNER');

-- CreateEnum
CREATE TYPE "LicenseStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'SUSPENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'BANK_TRANSFER', 'PAYPAL', 'INVOICE');

-- CreateEnum
CREATE TYPE "BillingPeriod" AS ENUM ('MONTHLY', 'ANNUAL', 'EVENT_BASED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'PAST_DUE', 'UNPAID', 'TRIALING');

-- CreateEnum
CREATE TYPE "SupportPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "SupportStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED');

-- CreateTable
CREATE TABLE "Competition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hostCity" TEXT NOT NULL,
    "hostCountry" "CountryCode" NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "dateFormat" TEXT NOT NULL DEFAULT 'EEE dd MMM yyyy',
    "discipline" TEXT,
    "grade" TEXT,
    "isWT" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "organizerId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" "CountryCode" NOT NULL,
    "billingEmail" TEXT,
    "billingAddress" TEXT,
    "vatNumber" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "discipline" "WTDiscipline" NOT NULL,
    "division" "WTDivision" NOT NULL,
    "gender" "Gender" NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "weightCategory" TEXT,
    "sportClass" TEXT,
    "category" TEXT,
    "role" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "competitionType" "CompetitionType" NOT NULL DEFAULT 'ELIMINATION',
    "licenseId" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "scheduleStatus" "ScheduleStatus" NOT NULL,
    "competitionId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "mat" INTEGER NOT NULL,
    "number" TEXT NOT NULL,
    "phase" "MatchPhase" NOT NULL,
    "positionReference" TEXT NOT NULL,
    "scheduleStatus" TEXT NOT NULL,
    "resultStatus" "ResultStatus" NOT NULL,
    "resultDecision" "VictoryType",
    "round" INTEGER,
    "roundTime" TEXT,
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "homePenalties" INTEGER,
    "awayPenalties" INTEGER,
    "scheduledStart" TIMESTAMP(3),
    "estimatedStart" TIMESTAMP(3),
    "actualStart" TIMESTAMP(3),
    "eventId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "homeCompetitorId" TEXT NOT NULL,
    "awayCompetitorId" TEXT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchConfiguration" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "rules" TEXT NOT NULL,
    "rounds" INTEGER NOT NULL,
    "roundTime" TEXT NOT NULL,
    "restTime" TEXT NOT NULL,
    "injuryTime" TEXT NOT NULL,
    "bodyThreshold" INTEGER NOT NULL,
    "headThreshold" INTEGER NOT NULL,
    "homeVideoReplayQuota" INTEGER NOT NULL,
    "awayVideoReplayQuota" INTEGER NOT NULL,
    "goldenPointEnabled" BOOLEAN NOT NULL,
    "goldenPointTime" TEXT NOT NULL,
    "maxDifference" INTEGER NOT NULL,
    "maxPenalties" INTEGER NOT NULL,

    CONSTRAINT "MatchConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchResult" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "status" "ResultStatus" NOT NULL,
    "round" INTEGER,
    "position" INTEGER NOT NULL,
    "winnerId" TEXT,
    "loserId" TEXT,
    "decision" "VictoryType",
    "homeType" "ResultType",
    "awayType" "ResultType",
    "homeScore" INTEGER NOT NULL,
    "awayScore" INTEGER NOT NULL,
    "homePenalties" INTEGER NOT NULL,
    "awayPenalties" INTEGER NOT NULL,
    "description" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchAction" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "competitorId" TEXT,
    "action" "ActionType" NOT NULL,
    "type" TEXT,
    "source" TEXT,
    "value" INTEGER,
    "target" TEXT,
    "hitlevel" INTEGER,
    "round" INTEGER NOT NULL,
    "roundTime" TEXT,
    "position" INTEGER,
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "homePenalties" INTEGER,
    "awayPenalties" INTEGER,
    "description" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchRefereeAssignment" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "refereeId" TEXT,
    "role" "OfficialRole" NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refJ1Id" TEXT,
    "refJ2Id" TEXT,
    "refJ3Id" TEXT,
    "refCRId" TEXT,
    "refRJId" TEXT,
    "refTAId" TEXT,

    CONSTRAINT "MatchRefereeAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefereeAssignmentLog" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "refereeId" TEXT NOT NULL,
    "role" "OfficialRole" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefereeAssignmentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchEquipmentAssignment" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "competitorId" TEXT NOT NULL,
    "chestSensorId" TEXT NOT NULL,
    "headSensorId" TEXT NOT NULL,
    "deviceType" "PssDeviceType",

    CONSTRAINT "MatchEquipmentAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competitor" (
    "id" TEXT NOT NULL,
    "competitorType" "CompetitorType" NOT NULL,
    "printName" TEXT NOT NULL,
    "printInitialName" TEXT NOT NULL,
    "tvName" TEXT NOT NULL,
    "tvInitialName" TEXT NOT NULL,
    "scoreboardName" TEXT NOT NULL,
    "rank" INTEGER,
    "seed" INTEGER,
    "country" "CountryCode" NOT NULL,
    "eventId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Competitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "galNumber" TEXT,
    "source" "ParticipantSource" NOT NULL DEFAULT 'INTERNAL',
    "externalId" TEXT,
    "givenName" TEXT,
    "familyName" TEXT,
    "passportGivenName" TEXT NOT NULL,
    "passportFamilyName" TEXT NOT NULL,
    "preferredGivenName" TEXT NOT NULL,
    "preferredFamilyName" TEXT NOT NULL,
    "printName" TEXT NOT NULL,
    "printInitialName" TEXT NOT NULL,
    "tvName" TEXT NOT NULL,
    "tvInitialName" TEXT NOT NULL,
    "scoreboardName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "mainRole" TEXT NOT NULL,
    "country" "CountryCode" NOT NULL,
    "organizationId" TEXT NOT NULL,
    "status" "ParticipantStatus" NOT NULL DEFAULT 'REGISTERED',

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeighIn" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "status" "WeighInStatus" NOT NULL,
    "weight" DOUBLE PRECISION,
    "attemptDate" TIMESTAMP(3) NOT NULL,
    "random" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,

    CONSTRAINT "WeighIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedalWinner" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "competitorId" TEXT NOT NULL,
    "medalType" "MedalType" NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "MedalWinner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "deviceToken" TEXT,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),
    "organizationId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "country" "CountryCode" NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pool" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "maxAthletes" INTEGER NOT NULL,
    "matchesPerAthlete" INTEGER,
    "pointsForWin" INTEGER NOT NULL DEFAULT 3,
    "pointsForDraw" INTEGER NOT NULL DEFAULT 1,
    "pointsForLoss" INTEGER NOT NULL DEFAULT 0,
    "qualifyingPlaces" INTEGER NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoolCompetitor" (
    "id" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,
    "competitorId" TEXT NOT NULL,

    CONSTRAINT "PoolCompetitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoolMatch" (
    "id" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "matchOrder" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PoolMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoolStanding" (
    "id" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,
    "competitorId" TEXT NOT NULL,
    "matchesPlayed" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "pointsFor" INTEGER NOT NULL DEFAULT 0,
    "pointsAgainst" INTEGER NOT NULL DEFAULT 0,
    "pointsDifference" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "qualified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PoolStanding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventPoolConfig" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "usePoolSystem" BOOLEAN NOT NULL DEFAULT false,
    "minAthletesPerPool" INTEGER NOT NULL DEFAULT 3,
    "maxAthletesPerPool" INTEGER NOT NULL DEFAULT 5,
    "poolDistribution" TEXT NOT NULL,
    "qualifyingPlaces" INTEGER NOT NULL DEFAULT 2,
    "tieBreakCriteria" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventPoolConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoolToElimination" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "competitorId" TEXT NOT NULL,
    "poolRank" INTEGER NOT NULL,
    "eliminationSeed" INTEGER NOT NULL,

    CONSTRAINT "PoolToElimination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "License" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "LicenseType" NOT NULL,
    "status" "LicenseStatus" NOT NULL DEFAULT 'ACTIVE',
    "machineId" TEXT NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "lastVerifiedAt" TIMESTAMP(3),
    "maxEvents" INTEGER NOT NULL,
    "maxParticipants" INTEGER NOT NULL,
    "maxUsers" INTEGER NOT NULL,
    "features" JSONB NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "licenseId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "plan" "LicenseType" NOT NULL,
    "billingPeriod" "BillingPeriod" NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "eventPrice" DOUBLE PRECISION NOT NULL,
    "commissionRate" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "invoiceNumber" TEXT NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "billingPeriod" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceLineItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "InvoiceLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventFee" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "stripePaymentId" TEXT,
    "paypalOrderId" TEXT,
    "participantId" TEXT,
    "invoiceId" TEXT,
    "eventFeeId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commission" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Commission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageLog" (
    "id" TEXT NOT NULL,
    "licenseId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "SupportPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "SupportStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketMessage" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isStaff" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "conflictResolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncConfig" (
    "id" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "direction" TEXT NOT NULL,
    "conflictStrategy" TEXT NOT NULL,
    "syncInterval" INTEGER NOT NULL,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrintTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "orientation" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "forDiscipline" "WTDiscipline",
    "isWT" BOOLEAN NOT NULL DEFAULT true,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrintTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrintJob" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "generatedFile" TEXT,
    "parameters" JSONB,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "PrintJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompetitorToParticipant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CompetitorToParticipant_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ClubToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClubToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchConfiguration_matchId_key" ON "MatchConfiguration"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_licenseNumber_key" ON "Participant"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MedalWinner_competitorId_key" ON "MedalWinner"("competitorId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_externalId_key" ON "User"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Club_code_key" ON "Club"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PoolCompetitor_poolId_competitorId_key" ON "PoolCompetitor"("poolId", "competitorId");

-- CreateIndex
CREATE UNIQUE INDEX "PoolMatch_matchId_key" ON "PoolMatch"("matchId");

-- CreateIndex
CREATE INDEX "PoolMatch_poolId_matchOrder_idx" ON "PoolMatch"("poolId", "matchOrder");

-- CreateIndex
CREATE INDEX "PoolStanding_poolId_rank_idx" ON "PoolStanding"("poolId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "PoolStanding_poolId_competitorId_key" ON "PoolStanding"("poolId", "competitorId");

-- CreateIndex
CREATE UNIQUE INDEX "EventPoolConfig_eventId_key" ON "EventPoolConfig"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "PoolToElimination_eventId_competitorId_key" ON "PoolToElimination"("eventId", "competitorId");

-- CreateIndex
CREATE UNIQUE INDEX "License_key_key" ON "License"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_eventFeeId_key" ON "Payment"("eventFeeId");

-- CreateIndex
CREATE INDEX "SyncLog_modelName_recordId_idx" ON "SyncLog"("modelName", "recordId");

-- CreateIndex
CREATE INDEX "SyncLog_status_createdAt_idx" ON "SyncLog"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SyncConfig_modelName_key" ON "SyncConfig"("modelName");

-- CreateIndex
CREATE UNIQUE INDEX "PrintTemplate_code_key" ON "PrintTemplate"("code");

-- CreateIndex
CREATE INDEX "_CompetitorToParticipant_B_index" ON "_CompetitorToParticipant"("B");

-- CreateIndex
CREATE INDEX "_ClubToUser_B_index" ON "_ClubToUser"("B");

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "License"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeCompetitorId_fkey" FOREIGN KEY ("homeCompetitorId") REFERENCES "Competitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_awayCompetitorId_fkey" FOREIGN KEY ("awayCompetitorId") REFERENCES "Competitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchConfiguration" ADD CONSTRAINT "MatchConfiguration_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchResult" ADD CONSTRAINT "MatchResult_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchAction" ADD CONSTRAINT "MatchAction_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchAction" ADD CONSTRAINT "MatchAction_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "Competitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchRefereeAssignment" ADD CONSTRAINT "MatchRefereeAssignment_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchRefereeAssignment" ADD CONSTRAINT "MatchRefereeAssignment_refereeId_fkey" FOREIGN KEY ("refereeId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchRefereeAssignment" ADD CONSTRAINT "MatchRefereeAssignment_refJ1Id_fkey" FOREIGN KEY ("refJ1Id") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchRefereeAssignment" ADD CONSTRAINT "MatchRefereeAssignment_refJ2Id_fkey" FOREIGN KEY ("refJ2Id") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchRefereeAssignment" ADD CONSTRAINT "MatchRefereeAssignment_refJ3Id_fkey" FOREIGN KEY ("refJ3Id") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchRefereeAssignment" ADD CONSTRAINT "MatchRefereeAssignment_refCRId_fkey" FOREIGN KEY ("refCRId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchRefereeAssignment" ADD CONSTRAINT "MatchRefereeAssignment_refRJId_fkey" FOREIGN KEY ("refRJId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchRefereeAssignment" ADD CONSTRAINT "MatchRefereeAssignment_refTAId_fkey" FOREIGN KEY ("refTAId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefereeAssignmentLog" ADD CONSTRAINT "RefereeAssignmentLog_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefereeAssignmentLog" ADD CONSTRAINT "RefereeAssignmentLog_refereeId_fkey" FOREIGN KEY ("refereeId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEquipmentAssignment" ADD CONSTRAINT "MatchEquipmentAssignment_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEquipmentAssignment" ADD CONSTRAINT "MatchEquipmentAssignment_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "Competitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competitor" ADD CONSTRAINT "Competitor_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competitor" ADD CONSTRAINT "Competitor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeighIn" ADD CONSTRAINT "WeighIn_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeighIn" ADD CONSTRAINT "WeighIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedalWinner" ADD CONSTRAINT "MedalWinner_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedalWinner" ADD CONSTRAINT "MedalWinner_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "Competitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pool" ADD CONSTRAINT "Pool_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoolCompetitor" ADD CONSTRAINT "PoolCompetitor_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoolCompetitor" ADD CONSTRAINT "PoolCompetitor_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "Competitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoolMatch" ADD CONSTRAINT "PoolMatch_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoolMatch" ADD CONSTRAINT "PoolMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoolStanding" ADD CONSTRAINT "PoolStanding_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoolStanding" ADD CONSTRAINT "PoolStanding_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "Competitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPoolConfig" ADD CONSTRAINT "EventPoolConfig_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoolToElimination" ADD CONSTRAINT "PoolToElimination_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoolToElimination" ADD CONSTRAINT "PoolToElimination_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "Competitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "License" ADD CONSTRAINT "License_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "License"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceLineItem" ADD CONSTRAINT "InvoiceLineItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventFee" ADD CONSTRAINT "EventFee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_eventFeeId_fkey" FOREIGN KEY ("eventFeeId") REFERENCES "EventFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageLog" ADD CONSTRAINT "UsageLog_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "License"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketMessage" ADD CONSTRAINT "TicketMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "SupportTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketMessage" ADD CONSTRAINT "TicketMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintJob" ADD CONSTRAINT "PrintJob_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "PrintTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitorToParticipant" ADD CONSTRAINT "_CompetitorToParticipant_A_fkey" FOREIGN KEY ("A") REFERENCES "Competitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitorToParticipant" ADD CONSTRAINT "_CompetitorToParticipant_B_fkey" FOREIGN KEY ("B") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubToUser" ADD CONSTRAINT "_ClubToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubToUser" ADD CONSTRAINT "_ClubToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
