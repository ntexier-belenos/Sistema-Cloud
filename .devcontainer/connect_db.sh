#!/bin/bash

# Ce script facilite la connexion à la base de données PostgreSQL
# Vous pouvez l'exécuter avec ./connect_db.sh pour ouvrir une console PostgreSQL

echo "Connexion à PostgreSQL (sistema_cloud)..."
PGPASSWORD=sistema psql -h localhost -p 5432 -U sistema sistema_cloud
