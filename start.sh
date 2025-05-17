#!/bin/bash

echo "Installation des dépendances..."
npm install

echo "Génération du client Prisma..."
npx prisma generate

echo "Configuration initiale de la base de données..."
npx prisma migrate dev --name init

echo "Démarrage du serveur..."
npm run dev
