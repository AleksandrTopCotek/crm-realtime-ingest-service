# -------- Build Stage --------
FROM node:22-alpine AS build

WORKDIR /crm-realtime-ingest-service

# Копируем package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем зависимости (только для билда)
RUN yarn install --frozen-lockfile

# Копируем весь исходный код
COPY . .

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

# Команда запуска
CMD ["node", "dist/main.js"]
