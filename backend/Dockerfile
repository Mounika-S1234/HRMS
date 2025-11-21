FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ git \
    && npm install -g npm@latest \
    && apt-get clean

COPY package*.json ./
RUN npm ci

COPY . .

RUN groupadd -r appgroup && useradd -r -g appgroup appuser \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000
CMD ["npm", "run", "dev"]
