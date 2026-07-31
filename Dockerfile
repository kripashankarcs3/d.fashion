# ---- Stage 1: build frontend ----
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN VITE_API_BASE_URL=/api npm run build

# ---- Stage 2: build backend ----
FROM node:20-alpine AS backend
WORKDIR /app/server
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Stage 3: runtime (Express serves API + built frontend) ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=backend /app/server/package.json ./server/package.json
COPY --from=backend /app/server/node_modules ./server/node_modules
COPY --from=backend /app/server/dist ./server/dist
COPY --from=frontend /app/dist ./dist
RUN mkdir -p server/tmp
EXPOSE 3001
CMD ["node", "server/dist/server.js"]
