FROM node:22-alpine AS build

WORKDIR /crm-realtime-ingest-service

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /crm-realtime-ingest-service

COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /crm-realtime-ingest-service/dist ./dist

CMD ["npm", "run", "start:prod"]