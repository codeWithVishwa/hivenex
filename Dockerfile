# ---- Stage 1: build the React frontend ----
FROM node:20-alpine AS client
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Stage 2: install server deps ----
FROM node:20-alpine AS server-deps
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev

# ---- Stage 3: runtime ----
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# built frontend (Express serves this from ../../dist relative to server/src)
COPY --from=client /app/dist ./dist
# server code + production node_modules
COPY --from=server-deps /app/server/node_modules ./server/node_modules
COPY server ./server

EXPOSE 5000
CMD ["node", "server/src/index.js"]
