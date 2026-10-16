# syntax=docker/dockerfile:1

# The bot needs no build step, so this is a single stage: install production
# dependencies only, copy the app, and drop privileges.
FROM node:24-slim

ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY index.js ./
COPY src ./src

USER node

CMD [ "npm", "start" ]
