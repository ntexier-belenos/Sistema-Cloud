#!/bin/bash

# Fonction pour afficher un menu coloré
show_menu() {
    echo -e "\033[1;36m===============================================\033[0m"
    echo -e "\033[1;36m   Sistema-Cloud - Environnement de développement   \033[0m"
    echo -e "\033[1;36m===============================================\033[0m"
    echo -e "\033[1;33m1\033[0m. Démarrer le serveur backend"
    echo -e "\033[1;33m2\033[0m. Démarrer l'application frontend"
    echo -e "\033[1;33m3\033[0m. Démarrer les deux (backend + frontend)"
    echo -e "\033[1;33m4\033[0m. Se connecter à PostgreSQL"
    echo -e "\033[1;33m5\033[0m. Redémarrer PostgreSQL"
    echo -e "\033[1;33m0\033[0m. Quitter"
    echo -e "\033[1;36m===============================================\033[0m"
    echo -n "Votre choix: "
}

# Démarrer le backend
start_backend() {
    echo -e "\033[1;32mDémarrage du backend...\033[0m"
    cd /workspace/backend
    pip install -r requirements.txt
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
}

# Démarrer le frontend
start_frontend() {
    echo -e "\033[1;32mDémarrage du frontend...\033[0m"
    cd /workspace/frontend
    npm install
    npm start
}

# Démarrer ensemble (utilise les tâches VS Code)
start_both() {
    echo -e "\033[1;32mDémarrage du backend et du frontend...\033[0m"
    echo -e "Utilisation des tâches VS Code. Vérifiez la vue Terminal dans VS Code."
    cd /workspace
    code --execute-command "workbench.action.tasks.runTask" --args "start-dev"
}

# Se connecter à PostgreSQL
connect_db() {
    bash /workspace/.devcontainer/connect_db.sh
}

# Redémarrer PostgreSQL
restart_db() {
    echo -e "\033[1;32mRedémarrage de PostgreSQL...\033[0m"
    bash /workspace/.devcontainer/launch_db.sh
}

# Boucle principale du menu
while true; do
    clear
    show_menu
    read -r choice
    case $choice in
        1)
            start_backend
            break
            ;;
        2)
            start_frontend
            break
            ;;
        3)
            start_both
            break
            ;;
        4)
            connect_db
            ;;
        5)
            restart_db
            ;;
        0)
            echo -e "\033[1;32mAu revoir!\033[0m"
            exit 0
            ;;
        *)
            echo -e "\033[1;31mOption invalide. Appuyez sur Entrée pour continuer...\033[0m"
            read -r
            ;;
    esac
done
