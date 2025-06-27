FROM node:18

# Installation des dépendances système pour Python, PostgreSQL et Docker
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    postgresql-client \
    libpq-dev \
    gcc \
    git \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    sudo \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configurer l'utilisateur node pour utiliser sudo sans mot de passe
RUN echo "node ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/node \
    && chmod 0440 /etc/sudoers.d/node

# Installation de Docker CLI
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
    $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update \
    && apt-get install -y docker-ce-cli \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configuration de Python
RUN ln -s /usr/bin/python3 /usr/bin/python
RUN apt-get update && apt-get install -y python3-pip python3-venv
# Utiliser --break-system-packages pour contourner l'erreur d'environnement géré en externe
RUN pip3 install --break-system-packages --upgrade pip

# Création du répertoire de travail
WORKDIR /workspace

# On n'installe pas les dépendances ici, elles seront installées par le postCreateCommand
# quand le conteneur démarrera
