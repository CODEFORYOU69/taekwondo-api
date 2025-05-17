// src/dto/notifications/index.ts
import { NotificationType } from "@prisma/client";
import { z } from "zod";

// Convertir les enums Prisma en enums Zod
const NotificationTypeEnum = z.nativeEnum(NotificationType);

// Schéma pour créer une notification
export const createNotificationSchema = z.object({
  userId: z.string(),
  type: NotificationTypeEnum,
  title: z.string().min(1).max(100),
  body: z.string().min(1),
});

export type CreateNotificationDto = z.infer<typeof createNotificationSchema>;

// Interface pour le résultat de "marquer tout comme lu"
export interface MarkAllReadResult {
  success: boolean;
  count: number;
}

// Schéma pour filtrer les notifications
export const notificationFilterSchema = z.object({
  seen: z.boolean().optional(),
  type: NotificationTypeEnum.optional(),
});

export type NotificationFilterDto = z.infer<typeof notificationFilterSchema>;

// Interface pour les statistiques de notifications
export interface NotificationStatsDto {
  totalCount: number;
  unreadCount: number;
  byType: {
    type: NotificationType;
    count: number;
    unreadCount: number;
  }[];
}
