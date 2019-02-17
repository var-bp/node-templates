# https://github.com/nodejs/docker-node#image-variants
# https://derickbailey.com/2017/03/09/selecting-a-node-js-image-for-docker/
# https://nodejs.org/uk/download/releases/
FROM node:lts-alpine

# Создать директорию app
WORKDIR /var/www/app

ENV NODE_ENV=production

# Используется символ подстановки для копирования как package.json, так и package-lock.json
COPY package*.json ./

# VOLUME ["/app"]

RUN npm install
# Используется при сборке кода в продакшене
# RUN npm install --only=production

# Скопировать исходники приложения
COPY . /app
# Собрать статические файлы react/vue/angular
# RUN npm run build

# Expose application ports - (4300 - for API and 4301 - for front end)
EXPOSE 4300 4301

# Generate build
RUN npm run build

CMD ["node", "index.js"]

# Using the -t flag with docker build will allow you to tag the image with a memorable name.
# The . specifies that the build context is the current directory.
# docker build -t your_dockerhub_username/node-docker-tutorial .
# Check your images
# docker images
# To create a container with this image
# docker run -p 8080:5000 -d your_dockerhub_username/node-docker-tutorial
# List your running containers
# docker ps
# Show all containers (default shows just running)
# docker ps -a
# Remove one or more containers
# docker rm [id]
