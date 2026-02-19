FROM node:20.19.6-alpine3.22

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn build
RUN env
EXPOSE 4173
CMD ["yarn", "prod"]
