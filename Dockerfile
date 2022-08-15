FROM node:16-bullseye-slim as base

ENV NODE_ENV=production
ENV DATABASE_URL=file:/service/data/database.db

RUN apt-get update && apt-get install -y openssl python3 cmake g++

FROM base as deps

WORKDIR /service

ADD package.json yarn.lock ./
RUN yarn install --production=false

FROM base as production-deps

WORKDIR /service

COPY --from=deps /service/node_modules /service/node_modules
ADD package.json yarn.lock ./
RUN yarn install --production --ignore-scripts

FROM base as build

WORKDIR /service

COPY --from=deps /service/node_modules /service/node_modules
ADD prisma .
ADD . .
RUN yarn run prisma:generate
RUN yarn run build

FROM base

WORKDIR /service

ADD . .
COPY --from=production-deps /service/node_modules /service/node_modules
COPY --from=build /service/node_modules/.prisma /service/node_modules/.prisma
COPY --from=build /service/build /service/build

ADD entrypoint.sh /

RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
