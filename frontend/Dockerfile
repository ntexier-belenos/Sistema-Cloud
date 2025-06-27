FROM node:18

# Créer le répertoire du workspace
RUN mkdir -p /workspace

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

COPY . .

CMD ["npm", "start"]
