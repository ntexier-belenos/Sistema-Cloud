FROM node:18

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    postgresql-client \
    libpq-dev \
    gcc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configuration de Python
RUN ln -s /usr/bin/python3 /usr/bin/python
RUN pip3 install --upgrade pip

# Installation des dépendances Python
COPY backend/requirements.txt /tmp/requirements.txt
RUN pip3 install -r /tmp/requirements.txt

# Installation des dépendances Node.js globales (si nécessaire)
RUN npm install -g npm@latest

# Création du répertoire de travail
WORKDIR /workspace

# Le point d'entrée sera défini dans docker-compose.yml
# pour permettre de lancer à la fois les processus frontend et backend
