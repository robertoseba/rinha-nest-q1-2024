FROM node:lts-alpine3.19 AS build


WORKDIR /build
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .
RUN npm run build

FROM node:lts-alpine3.19

ENV NODE_ENV=production USER=node PORT=3000 

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production

COPY --from=build /build/dist ./dist
USER ${USER}

EXPOSE ${PORT}

CMD ["npm", "run", "start:prod"]