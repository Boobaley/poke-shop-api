# build environment
FROM node:14.16.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . ./
RUN npm ci
RUN npm run build
RUN npm ci --production

# production environment
FROM node:14.16.0-alpine
ENV WEB_PATH /usr/share/web

COPY --from=build /app/package.json $WEB_PATH/package.json
COPY --from=build /app/package-lock.json $WEB_PATH/package-lock.json
COPY --from=build /app/node_modules $WEB_PATH/node_modules
COPY --from=build /app/dist $WEB_PATH/dist

WORKDIR $WEB_PATH
EXPOSE 3000

CMD npm run start:prod
