# Sistema-Cloud

Sistema-Cloud est une plateforme d'analyse de sécurité des machines basée sur la norme ISO 13849.

## Architecture

Ce projet est basé sur :
- FastAPI pour l'API backend
- PostgreSQL pour la base de données
- Docker pour la conteneurisation

## Développement

### Prérequis
- Python 3.11+
- Docker et Docker Compose

### Installation
1. Cloner le dépôt
```bash
git clone https://github.com/ntexier-belenos/Sistema-Cloud.git
```

2. Installer les dépendances
```bash
pip install -r requirements.txt
```

3. Lancer l'application en mode développement
```bash
uvicorn app.main:app --reload
```

### Endpoints API
- `/` - Point d'entrée principal
- `/health` - Vérification de l'état de santé de l'API

## Déploiement

L'application peut être déployée via Docker :

```bash
docker build -t sistema-cloud .
docker run -p 8000:8000 sistema-cloud
```
