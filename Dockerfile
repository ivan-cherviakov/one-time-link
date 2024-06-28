ARG NODE_VERSION

FROM node:${NODE_VERSION}-alpine as builder

RUN corepack enable
WORKDIR /app
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./tsconfig.build.json .
RUN pnpm i
RUN pnpm build

FROM node:${NODE_VERSION}-alpine

WORKDIR /app
COPY --from=builder /app/dist dist
COPY --from=builder /app/package.json package.json
RUN corepack enable
RUN pnpm i --prod
