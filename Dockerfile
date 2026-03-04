FROM node:25-alpine
WORKDIR /app
COPY . .

RUN yarn install
RUN yarn build && yarn cache clean
RUN env
RUN rm -rf /usr/local/lib/node_modules/npm
EXPOSE 4173
CMD ["yarn", "prod"]
