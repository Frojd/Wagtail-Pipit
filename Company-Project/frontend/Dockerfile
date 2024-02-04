FROM node:20-alpine as BUILD_IMAGE
WORKDIR /app
COPY package.json package-lock.json ./
# install dependencies
RUN npm ci --audit=false
RUN npm rebuild --arch=x64 --platform=linux --libc=musl sharp

COPY . .

# build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV NEXT_SHARP_PATH=/app/.next/standalone/node_modules/sharp

RUN npm run build

FROM node:20-alpine
WORKDIR /app

RUN apk update && apk add --no-cache dumb-init

RUN addgroup -S app && adduser -S app -G app

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# copy from build image

COPY --from=BUILD_IMAGE /app/.next/standalone ./standalone
COPY --from=BUILD_IMAGE /app/.next/static ./standalone/.next/static
COPY --from=BUILD_IMAGE /app/public ./standalone/public

EXPOSE 3000

RUN chown -R app:app /app
USER app

ENV NEXT_SHARP_PATH=/app/standalone/node_modules/sharp
ENV NODE_ENV production


CMD ["dumb-init", "node", "./standalone/server.js"]
