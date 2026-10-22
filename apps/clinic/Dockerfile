# Build from the repo root: docker build -f apps/clinic/Dockerfile -t clinic .
FROM node:20.19.5-alpine AS deps
WORKDIR /repo
COPY package.json package-lock.json ./
COPY apps/clinic/package.json apps/clinic/
COPY apps/restaurant/package.json apps/restaurant/
COPY packages/config/package.json packages/config/
COPY packages/i18n/package.json packages/i18n/
COPY packages/ui/package.json packages/ui/
RUN npm ci --ignore-scripts

FROM deps AS build
COPY packages packages
COPY apps/clinic apps/clinic
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build -w apps/clinic

FROM node:20.19.5-alpine
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
WORKDIR /app
COPY --from=build --chown=node:node /repo/apps/clinic/.next/standalone ./
COPY --from=build --chown=node:node /repo/apps/clinic/.next/static apps/clinic/.next/static
# Not part of the traced server bundle; the Kubernetes migration Job runs `node scripts/migrate.mjs` from this image.
COPY --chown=node:node apps/clinic/scripts/migrate.mjs apps/clinic/scripts/migrate.mjs
COPY --chown=node:node apps/clinic/migrations apps/clinic/migrations
WORKDIR /app/apps/clinic
USER node
EXPOSE 3000
CMD ["node", "server.js"]
