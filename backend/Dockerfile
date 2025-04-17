FROM node:20-alpine AS builder

WORKDIR /app


COPY package*.json ./

RUN npm i

COPY . .

RUN npx prisma generate

RUN npm run build

RUN npm prune --production

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production

CMD ["npm", "run", "start:prod"]