FROM node:16-bullseye-slim as base

ENV NODE_ENV=production

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
ADD . .
RUN yarn run build

FROM base

WORKDIR /service

ADD . .
COPY --from=production-deps /service/node_modules /service/node_modules
COPY --from=build /service/build /service/build

EXPOSE 3000

CMD ["yarn", "run", "start"]
