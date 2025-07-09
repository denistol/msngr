FROM node:20

WORKDIR /app

COPY package*.json pnpm* ./
COPY packages/client/package*.json ./packages/client/

RUN npm install -g pnpm
COPY . .
RUN pnpm install --filter client

RUN pnpm run build:client

EXPOSE 1338

