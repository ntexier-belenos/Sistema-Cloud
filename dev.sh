#!/bin/bash

# Fonction pour démarrer PostgreSQL
start_postgres() {
    echo "⚠️ Note: PostgreSQL n'est pas disponible dans ce conteneur de développement."
    echo "Pour utiliser PostgreSQL, vous pouvez :"
    echo "1. Vous connecter à votre base de données externe si configurée"
    echo "2. Utiliser l'extension 'ms-azuretools.vscode-docker' pour lancer un conteneur PostgreSQL séparé"
}

# Fonction pour démarrer le backend
start_backend() {
    echo "🚀 Démarrage du backend..."
    cd /workspace/backend
    pip install -r requirements.txt
    python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
}

# Fonction pour démarrer le frontend
start_frontend() {
    echo "🚀 Démarrage du frontend..."
    cd /workspace/frontend
    npm install
    npm start
}

# Afficher le menu
echo "=== Sistema-Cloud Developer Tools ==="
echo "1. Démarrer le backend"
echo "2. Démarrer le frontend"
echo "3. Informations sur PostgreSQL"
echo "q. Quitter"
echo ""
read -p "Choisissez une option: " choice

case $choice in
    1)
        start_backend
        ;;
    2)
        start_frontend
        ;;
    3)
        start_postgres
        ;;
    q|Q)
        exit 0
        ;;
    *)
        echo "Option invalide"
        ;;
esac
