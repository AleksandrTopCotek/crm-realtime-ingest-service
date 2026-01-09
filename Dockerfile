# -------- Build Stage --------
FROM node:22-alpine AS build

WORKDIR /crm-realtime-ingest-service

# Копируем package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем зависимости (только для билда)
RUN yarn install --frozen-lockfile

# Копируем весь исходный код
COPY . .

# Prisma generate needs DATABASE_URL at build time (Cloud Run env vars are runtime-only)
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Генерация призмы 
RUN npx prisma generate
# Сборка проекта
RUN yarn build

# -------- Production Stage --------
FROM node:22-alpine

WORKDIR /crm-realtime-ingest-service

# Копируем package.json и yarn.lock для production-зависимостей
COPY package.json yarn.lock ./

# Устанавливаем только production зависимости
RUN yarn install --production --frozen-lockfile

# Копируем собранный билд из build-stage
COPY --from=build /crm-realtime-ingest-service/dist ./dist

# Prisma runtime artifacts (generated client engine files)
COPY --from=build /crm-realtime-ingest-service/node_modules/.prisma ./node_modules/.prisma

# Команда запуска
CMD ["node", "dist/src/main.js"]
