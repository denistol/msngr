# MSNGR

**MSNGR** is a real-time ( test homework project ) messenger application supporting **private** and **group chats**, built with **WebSockets**, **MongoDB**, **Nginx**, **Next.js**, **Express**, and **TypeScript**.

The project is organized as a **monorepo** using [pnpm](https://pnpm.io), and consists of two main services:

- **`/packages/server/`** – Backend built with TypeScript, Express, MongoDB
- **`/packages/client/`** – Frontend built with TypeScript, Next.js, shadcn/ui

---

## 🚀 Features

- 🔐 User registration and login
- 💬 One-on-one private messaging
- 👥 Group chat support
- 🔄 Real-time communication via WebSockets
- 🗃️ MongoDB as the database
- 📦 Monorepo setup using `pnpm` workspaces

---

## 📁 Project Structure
```
├── client/ # Next.js frontend
├── server/ # Express backend
├── .env # Environment variables
├── package.json # Monorepo scripts
```

## 📦 Installation

> Requires Node.js ≥ 18 and [pnpm](https://pnpm.io)

```bash
pnpm install;
cp .env.example .env # copy .env.example or create yours
```

## 🧪 Development Mode
```
# Start backend (Express + MongoDB)
pnpm dev:server

# Start frontend (Next.js)
pnpm dev:client
```

## 🛠️ Build & run for Production
```
docker-compose up -d
```

## 🌐 API & WebSocket
- API is available under /api/* (e.g. /api/auth, /api/message, /api/room)

- WebSocket is available under /socket.io/ (via ws:// or wss://)

## 📚 Technologies


- Next.js - Frontend UI & rendering
- Express - REST API & WebSocket server
- Socket.IO - Real-time messaging
- MongoDB - Database
- TypeScript - Fullstack type safety
- shadcn/ui - Modern UI components
- pnpm - Monorepo package management
- Nginx - Reverse proxy for API and sockets
- Docker Compose - Orchestration for services

