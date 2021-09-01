FROM node:lts-alpine AS build
WORKDIR /app
COPY . .
RUN yarn install --immutable
RUN yarn build
EXPOSE 11371
ENV PORT=11371
CMD ["node", "build"]
