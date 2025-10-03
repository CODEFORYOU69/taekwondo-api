# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Taekwondo Competition Management API - A comprehensive REST API for managing Taekwondo competitions with offline synchronization support, real-time match updates via WebSocket, and integration with PSS (Protector & Scoring System) devices like Daedo and KPNP.

**Tech Stack:** Node.js, TypeScript, Express.js, Prisma ORM, PostgreSQL, JWT Auth, Swagger, Socket.IO, WebSocket

## Development Commands

```bash
# Development
npm run dev                    # Start development server with nodemon
npm run build                  # Compile TypeScript to JavaScript
npm start                      # Run production build

# Database
npm run prisma:generate        # Generate Prisma Client
npm run prisma:migrate         # Run database migrations
npm run prisma:studio          # Open Prisma Studio GUI

# Documentation
npm run swagger-autogen        # Generate Swagger documentation
npm run build:docs             # Alias for swagger-autogen

# Testing
npm test                       # Run Jest tests
```

## Architecture

### Layered Structure

The application follows a standard layered architecture:

```
Controller → Service → Prisma Client → Database
```

- **Controllers** (`src/controllers/`): Handle HTTP requests/responses and validation
- **Services** (`src/services/`): Business logic and database operations
- **Routes** (`src/routes/`): Express route definitions
- **DTOs** (`src/dto/`): Data Transfer Objects with Zod validation schemas
- **Middleware** (`src/middleware/`): Auth, error handling
- **Config** (`src/config/`): Environment variables and database configuration

### Key Components

**Synchronization System** (`src/sync/`):
- `sync.manager.ts`: Orchestrates periodic data sync
- `sync.service.ts`: Handles offline sync operations
- Enables competition data to be synchronized when connectivity is restored

**PSS Integration** (`src/pss/`):
- `pssSocket.ts`: WebSocket listener for PSS devices (Daedo, KPNP)
- Receives real-time match actions (scores, penalties) from electronic scoring systems
- Maps incoming events to database models using `ActionType` and `ActionSource` enums

**Real-time Updates** (`src/socket/`):
- Socket.IO service for broadcasting match updates to connected clients
- Enables live scoreboard displays and match tracking

### Authentication Flow

JWT-based authentication with role-based access control (RBAC):
- Roles: `super_admin`, `admin`, `federation`, `club`, `coach`, `spectator`
- Auth middleware validates JWT tokens and attaches user info to requests
- Protected routes use `authMiddleware` from `src/middleware/auth.middleware.ts`

## World Taekwondo Standards Compliance

**CRITICAL**: This API strictly follows World Taekwondo (WT) and FFTDA naming conventions and data structures.

### Naming Standards (WT v1.8)

Participant names must follow strict formatting:
- **Passport names**: ASCII only, UPPERCASE family name, Title case given name, max 25 chars
- **Print name**: `{FAMILY} {Given}`, max 35 chars
- **TV name**: `{Given} {FAMILY}`, max 19 chars
- **Scoreboard name**: `{FAMILY} {G.}`, UPPERCASE, max 10 chars

### Match Phases

Use standard WT phase codes: `F`, `SF`, `QF`, `R16`, `R32`, `R64`, `R128`, `BMC`, `GMC`, `RP`

### Victory Types

Use enum values: `PTF`, `PTG`, `GDP`, `RSC`, `SUP`, `PUN`, `WDR`, `DSQ`, `DQB`

### Divisions & Disciplines

Follow WT standard divisions: `OLYMPIC`, `SENIORS`, `JUNIORS`, `CADETS`, `UNDER_21`, etc.

Disciplines: `TKW_K` (Kyorugi), `TKW_P` (Poomsae), `TKW_F` (Freestyle), `TKW_T` (Team), `PTKW_K` (Para Kyorugi), `PTKW_P` (Para Poomsae), `TKW_B` (Breaking Board)

## Prisma Schema

**⚠️ CRITICAL: DO NOT MODIFY `prisma/schema.prisma` WITHOUT EXPLICIT APPROVAL**

The Prisma schema represents official World Taekwondo competition structures. It is the source of truth for:
- All database models and relationships
- Enums aligned with WT standards
- Data validation rules

When implementing features:
1. Use existing schema models as-is
2. Follow the existing relationship patterns
3. If schema changes are needed, inform the developer and explain the rationale
4. Never add fields or models automatically

## API Documentation

All API endpoints must be documented in Swagger (`swagger/openapi.json`):
1. Use comprehensive request/response schemas
2. Document all query parameters, especially WT-specific enums
3. Include proper authentication requirements (`bearerAuth`)
4. Document error responses (401, 403, 422, etc.)
5. Follow WT terminology in descriptions

## Environment Variables

Required variables (see `src/config/env.ts`):
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRES_IN`: Token expiration (default: "24h")
- `NODE_ENV`: "development" | "test" | "production"
- `PORT`: Server port (default: 3000)
- `SYNC_ENABLED`: Enable offline sync (default: true)
- `SYNC_INTERVAL`: Sync interval in minutes (default: 15)
- `PSS_PORT`: WebSocket port for PSS devices (default: 8080)

## Important Notes

- All routes are prefixed with `/api`
- Swagger UI is available at `/api-docs` (development only)
- The app uses comprehensive error middleware for consistent error responses
- Controllers should use DTOs for validation (Zod schemas in `src/dto/`)
- Follow existing patterns for new route implementations (see `src/routes/index.ts`)
