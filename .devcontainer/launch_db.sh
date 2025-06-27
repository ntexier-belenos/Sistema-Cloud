#!/bin/bash

echo "======================================================"
echo "🔄 Vérification des services PostgreSQL disponibles..."
echo "======================================================"

# Vérifier si Docker fonctionne
if ! docker info &>/dev/null; then
    echo "❌ Docker n'est pas accessible. Vérifiez les points suivants :"
    echo "   1. Docker est bien installé et en cours d'exécution"
    echo "   2. Vous avez les permissions pour accéder au socket Docker"
    echo "   3. Le socket Docker est correctement monté dans le conteneur"
    echo ""
    echo "   Pour résoudre ce problème, vous pouvez :"
    echo "   - Vérifier que le fichier devcontainer.json contient bien le montage :"
    echo "     \"mounts\": [\"source=/var/run/docker.sock,target=/var/run/docker.sock,type=bind\"]"
    echo "   - Exécuter 'sudo chmod 666 /var/run/docker.sock' sur l'hôte"
    echo "======================================================"
    exit 1
fi

# Vérifier si un conteneur PostgreSQL est déjà en cours d'exécution sur le port 5432
DB_CHECK=$(docker ps --filter publish=5432 -q)

if [ -n "$DB_CHECK" ]; then
    CONTAINER_ID=$(docker ps --filter publish=5432 -q)
    CONTAINER_NAME=$(docker ps --filter id=$CONTAINER_ID --format '{{.Names}}')
    echo "✅ PostgreSQL déjà disponible dans le conteneur: $CONTAINER_NAME (ID: $CONTAINER_ID)"
    echo "   Pour vous connecter: postgresql://sistema:sistema@localhost:5432/sistema_cloud"
else
    echo "🚀 Lancement d'un conteneur PostgreSQL pour développement..."
    
    # Vérifier si le conteneur existe mais est arrêté
    STOPPED_CONTAINER=$(docker ps -a --filter name=sistema-postgres -q)
    if [ -n "$STOPPED_CONTAINER" ]; then
        echo "✋ Conteneur PostgreSQL existant trouvé mais arrêté, redémarrage..."
        docker start sistema-postgres
    else
        # Créer un volume s'il n'existe pas déjà
        docker volume inspect sistema_pgdata >/dev/null 2>&1 || docker volume create sistema_pgdata
        
        # Lancer PostgreSQL avec Docker
        docker run --name sistema-postgres \
            -e POSTGRES_USER=sistema \
            -e POSTGRES_PASSWORD=sistema \
            -e POSTGRES_DB=sistema_cloud \
            -p 5432:5432 \
            -v sistema_pgdata:/var/lib/postgresql/data \
            -d postgres:15
    fi
    
    # Vérifier si le lancement a réussi
    if [ $? -eq 0 ]; then
        echo "✅ PostgreSQL a été démarré avec succès!"
        echo "   Pour vous connecter: postgresql://sistema:sistema@localhost:5432/sistema_cloud"
    else
        echo "❌ Erreur lors du démarrage de PostgreSQL"
        echo "   Essayez de démarrer la base de données manuellement:"
        echo "   docker-compose -f /workspace/db-compose.yml up -d"
    fi
fi

echo "======================================================"
