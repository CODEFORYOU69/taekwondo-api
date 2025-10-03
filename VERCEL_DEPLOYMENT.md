# Déploiement sur Vercel

Ce guide explique comment déployer l'API Taekwondo sur Vercel.

## ⚠️ Limitations Importantes

**Vercel fonctionne en mode serverless**, ce qui entraîne les limitations suivantes :

### Fonctionnalités NON supportées sur Vercel :
- ❌ **WebSocket PSS** (`src/pss/pssSocket.ts`) - Les connexions WebSocket persistantes ne fonctionnent pas en serverless
- ❌ **Socket.IO** (`src/socket/socketService.ts`) - Pas de connexions temps réel persistantes
- ❌ **Synchronisation périodique** (`src/sync/sync.manager.ts`) - Pas de tâches cron/background jobs intégrées

### Fonctionnalités supportées :
- ✅ API REST complète
- ✅ Authentification JWT
- ✅ Routes CRUD
- ✅ Documentation Swagger (en développement)
- ✅ Prisma ORM avec PostgreSQL externe

## Prérequis

1. **Compte Vercel** : [vercel.com](https://vercel.com)
2. **Base de données PostgreSQL externe** :
   - [Vercel Postgres](https://vercel.com/storage/postgres)
   - [Supabase](https://supabase.com)
   - [Neon](https://neon.tech)
   - [Railway](https://railway.app)
   - Autre fournisseur PostgreSQL

3. **Vercel CLI** (optionnel) :
   ```bash
   npm i -g vercel
   ```

## Étapes de déploiement

### 1. Préparer la base de données

Créez une base de données PostgreSQL et obtenez l'URL de connexion :
```
postgresql://user:password@host:port/database
```

### 2. Configuration des variables d'environnement

Sur Vercel, configurez les variables d'environnement suivantes :

**Variables requises :**
```
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=votre_secret_super_securise
JWT_EXPIRES_IN=24h
NODE_ENV=production
PORT=3000
```

**Variables optionnelles :**
```
SYNC_ENABLED=false
SYNC_INTERVAL=15
PSS_PORT=8080
```

> **Note :** Mettez `SYNC_ENABLED=false` car la synchronisation périodique ne fonctionne pas en serverless.

### 3. Déploiement via GitHub (recommandé)

1. Poussez votre code sur GitHub
2. Allez sur [vercel.com/new](https://vercel.com/new)
3. Importez votre dépôt GitHub
4. Vercel détectera automatiquement le projet Node.js
5. Configurez les variables d'environnement
6. Cliquez sur "Deploy"

### 4. Déploiement via CLI

```bash
# Se connecter à Vercel
vercel login

# Déployer en production
vercel --prod
```

### 5. Exécuter les migrations Prisma

Après le déploiement, exécutez les migrations :

**Option A : Depuis votre machine locale**
```bash
DATABASE_URL="votre_url_production" npx prisma migrate deploy
```

**Option B : Via Vercel CLI**
```bash
vercel env pull .env.production
npx prisma migrate deploy
```

## Architecture Vercel

Le projet a été adapté pour Vercel avec les changements suivants :

- ✅ **`api/index.ts`** : Point d'entrée serverless (exporte l'app Express sans `.listen()`)
- ✅ **`vercel.json`** : Configuration de routing Vercel
- ✅ **`.vercelignore`** : Fichiers exclus du déploiement
- ✅ **`vercel-build` script** : Build automatique avec Prisma

## Tester le déploiement

Une fois déployé, testez votre API :

```bash
# Health check
curl https://votre-app.vercel.app/api/

# Swagger docs (si en mode dev)
curl https://votre-app.vercel.app/api-docs
```

## Alternative : Déploiement avec fonctionnalités complètes

Si vous avez besoin de **WebSockets** et **synchronisation temps réel**, considérez :

- **Railway** : Support complet des WebSockets et processus longs
- **Render** : Support des WebSockets et workers
- **DigitalOcean App Platform** : Support des WebSockets
- **AWS EC2/ECS** : Contrôle total
- **Heroku** : Support des WebSockets (avec dynos)

## Dépannage

### Erreur : "Prisma Client not found"
```bash
# Assurez-vous que le build script génère Prisma
npm run vercel-build
```

### Erreur : "Database connection failed"
- Vérifiez que `DATABASE_URL` est correctement configurée dans Vercel
- Vérifiez que votre DB accepte les connexions externes
- Vérifiez les whitelisting IP si nécessaire

### Timeout sur les requêtes
- Les fonctions serverless Vercel ont un timeout de 10s (plan gratuit) ou 60s (plan pro)
- Optimisez vos requêtes Prisma avec des indexes

## Ressources

- [Vercel Docs](https://vercel.com/docs)
- [Vercel + Prisma](https://vercel.com/guides/nextjs-prisma-postgres)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
