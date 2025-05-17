import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { competitionRoutes } from "./competitions.routes";
import { competitorsRoutes } from "./competitors.routes";
import { eventsRoutes } from "./events.routes";
import { licensesRoutes } from "./licenses.routes";
import { matchConfigurationRoutes } from "./match-configuration.routes";
import { matchesRoutes } from "./matches.routes";
import { medalWinnersRoutes } from "./medal-winners.routes";
import { notificationsRoutes } from "./notifications.routes";
import { organizationsRoutes } from "./organizations.routes";
import { participantsRoutes } from "./participants.routes";
import { poolsRoutes } from "./pools.routes";
import { sessionsRoutes } from "./sessions.routes";
import { syncRoutes } from "./sync.routes";
import { usersRoutes } from "./users.routes";
import { weighInsRoutes } from "./weighins.routes";

const router = Router();

// Routes principales de l'API
router.use("/auth", authRoutes);
router.use("/competitions", competitionRoutes);
router.use("/sync", syncRoutes);
router.use("/participants", participantsRoutes);
router.use("/weighins", weighInsRoutes);
router.use("/users", usersRoutes);
router.use("/pools", poolsRoutes);
router.use("/sessions", sessionsRoutes);
router.use("/events", eventsRoutes);
router.use("/matches", matchesRoutes);
router.use("/competitors", competitorsRoutes);
router.use("/organizations", organizationsRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/medal-winners", medalWinnersRoutes);
router.use("/licenses", licensesRoutes);
router.use("/match-configuration", matchConfigurationRoutes);

export const routerManager = router;
