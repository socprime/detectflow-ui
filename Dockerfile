FROM node:25-alpine
WORKDIR /app
COPY . .

RUN yarn install
RUN yarn build && yarn cache clean
RUN npm install -g npm@latest
RUN env
EXPOSE 4173
CMD ["yarn", "prod"]