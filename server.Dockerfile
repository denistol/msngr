FROM node:20

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/server/package.json ./packages/server/

RUN npm install -g pnpm
RUN pnpm install

COPY packages/server ./packages/server

RUN pnpm run build:server

EXPOSE 1338

RUN pnpm run build:server
