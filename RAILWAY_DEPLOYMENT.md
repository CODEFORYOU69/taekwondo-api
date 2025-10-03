# Déploiement sur Railway

Railway est la plateforme idéale pour cette API car elle supporte **toutes les fonctionnalités** :
- ✅ WebSocket PSS (connexions aux équipements Daedo/KPNP)
- ✅ Socket.IO (temps réel)
- ✅ Synchronisation périodique
- ✅ API REST complète
- ✅ PostgreSQL intégré

## Déploiement rapide

### 1. Via Railway Dashboard (recommandé)

1. Allez sur [railway.app](https://railway.app)
2. Cliquez sur "New Project"
3. Sélectionnez "Deploy from GitHub repo"
4. Choisissez votre dépôt `taekwondo-api`
5. Railway détectera automatiquement Node.js

### 2. Ajouter PostgreSQL

1. Dans votre projet Railway, cliquez sur "+ New"
2. Sélectionnez "Database" → "PostgreSQL"
3. Railway créera automatiquement la variable `DATABASE_URL`

### 3. Configurer les variables d'environnement

Railway ajoute automatiquement `DATABASE_URL`. Ajoutez les autres :

```
NODE_ENV=production
PORT=3000
JWT_SECRET=votre_secret_super_securise_a_changer
JWT_EXPIRES_IN=24h
SYNC_ENABLED=true
SYNC_INTERVAL=15
PSS_PORT=8080
```

**Important :** Railway injecte automatiquement `PORT`, vous pouvez le laisser vide.

### 4. Exécuter les migrations

**Option A - Depuis votre machine locale :**
```bash
# Récupérer la DATABASE_URL depuis Railway
railway variables

# Exécuter les migrations
railway run npx prisma migrate deploy
```

**Option B - Via Railway CLI :**
```bash
# Installer Railway CLI
npm i -g @railway/cli

# Se connecter
railway login

# Lier au projet
railway link

# Exécuter les migrations
railway run npx prisma migrate deploy
```

### 5. Build et déploiement automatique

Railway build et déploie automatiquement à chaque push sur la branche main.

Le build exécute :
```bash
npm install
npm run build  # prisma generate && tsc
npm start      # node dist/app.js
```

## Tester le déploiement

Une fois déployé, Railway vous donne une URL :
```
https://taekwondo-api-production.up.railway.app
```

Testez :
```bash
# Health check
curl https://votre-app.railway.app/api/

# Swagger docs
curl https://votre-app.railway.app/api-docs
```

## Fonctionnalités complètes supportées

### ✅ WebSocket PSS
Le `PssSocketManager` fonctionnera parfaitement pour recevoir les données des équipements Daedo/KPNP :
```typescript
// src/pss/pssSocket.ts - Fonctionne sur Railway
const pssManager = new PssSocketManager(process.env.PSS_PORT || 8080);
```

### ✅ Socket.IO
Les connexions temps réel pour les scoreboards fonctionnent :
```typescript
// src/socket/socketService.ts - Fonctionne sur Railway
io.emit('MATCH_UPDATE', matchData);
```

### ✅ Synchronisation périodique
Le sync manager s'exécute en arrière-plan :
```typescript
// src/sync/sync.manager.ts - Fonctionne sur Railway
syncManager.initialize();
```

## Commandes Railway CLI

```bash
# Installer CLI
npm i -g @railway/cli

# Se connecter
railway login

# Lier au projet
railway link

# Voir les logs
railway logs

# Exécuter une commande
railway run <commande>

# Ouvrir le dashboard
railway open
```

## Variables d'environnement

Railway fournit automatiquement :
- `DATABASE_URL` - Si vous ajoutez PostgreSQL
- `PORT` - Port d'écoute assigné dynamiquement
- `RAILWAY_ENVIRONMENT` - "production" ou autre

Vous devez ajouter :
- `JWT_SECRET` - ⚠️ Utilisez une valeur forte en production
- `JWT_EXPIRES_IN` - Durée de validité du token (ex: "24h")
- `NODE_ENV` - Mettez "production"
- `SYNC_ENABLED` - true ou false
- `SYNC_INTERVAL` - En minutes (ex: 15)
- `PSS_PORT` - Port WebSocket pour PSS (ex: 8080)

## Monitoring et Logs

Railway offre :
- Logs en temps réel
- Métriques (CPU, RAM, Network)
- Alertes (optionnel)

Accédez aux logs :
```bash
railway logs --tail
```

## Domaine personnalisé (optionnel)

1. Dans Railway Dashboard → Settings
2. Section "Domains"
3. Cliquez "Add Domain"
4. Configurez votre DNS avec les enregistrements fournis

## Coûts

- **Gratuit** : 500h/mois + $5 de crédit
- **Pro** : $20/mois usage illimité

Votre API devrait rester dans le plan gratuit pour le développement.

## Dépannage

### Build échoue
```bash
# Vérifier les logs
railway logs

# Tester localement le build
npm run build
```

### Migrations Prisma échouent
```bash
# Se connecter à la DB et vérifier
railway run npx prisma studio
```

### WebSocket ne fonctionne pas
- Vérifiez que `PSS_PORT` est défini
- Railway supporte WebSocket nativement, pas de config spéciale nécessaire

## Ressources

- [Railway Docs](https://docs.railway.app)
- [Railway + Node.js](https://docs.railway.app/guides/nodejs)
- [Railway + PostgreSQL](https://docs.railway.app/databases/postgresql)
- [Railway CLI](https://docs.railway.app/develop/cli)
