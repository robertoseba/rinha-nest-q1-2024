FROM node:lts-alpine3.19 AS build


WORKDIR /build
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY . .
RUN npm run build

FROM node:lts-alpine3.19

ENV NODE_ENV=production USER=node PORT=3000 

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY --from=build /build/dist ./dist
USER ${USER}

EXPOSE ${PORT}

CMD ["npm", "run", "start:prod"]