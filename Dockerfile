FROM node:lts-alpine AS build
WORKDIR /app
COPY . .
RUN yarn install --immutable
RUN yarn build

FROM  node:lts-alpine AS run
WORKDIR /app
COPY --from=build /app/package.json /app
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
EXPOSE 3000
ENV PORT=11371
CMD ["node", "build"]
