Docker

Докер просто разделяет ядро ОС на все контейнеры (Docker container), работающие как отдельные процессы.

Что такое Docker: https://docs.microsoft.com/ru-ru/dotnet/standard/microservices-architecture/container-docker-introduction/docker-defined
Node.js using Docker: https://blog.bitsrc.io/manage-your-node-app-using-docker-like-a-pro-6266f6516cf
Docker vs Virtual Machines: https://nickjanetakis.com/blog/comparing-virtual-machines-vs-docker-containers
Docker and Node.js Best Practices: https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#cmd
Exploring Docker: https://www.youtube.com/playlist?list=PLillGF-Rfqbb6vZqT-Lzi9Al_noaY5LAs
CRUD API with MongoDB, Express, and Docker: https://hackernoon.com/build-a-crud-api-with-mongodb-express-and-docker-70510c6f706b

Docker Image -> Docker Container

Docker Image - a read-only template composed of layered filesystems used to share common files and create Docker container instances. Example: Ubuntu with Node.js and Application Code.

Docker Container - an isolated and secured shipping container created from an image that can be run, started, stopped, moved and deleted. Simplify: Created by using an image. Runs your application.

Docker automatically caches the results of each individual command so that they don’t have to be fully run each time you wish to build a Docker image.

Volume - special type of directory in a container typically referred to as a 'data volume'. Can be shared and reused among containers. Updated to an image won't affect a data volume. Data volumes are persisted even after the container is deleted.

A `Dockerfile` is a plain text document containing all the required step by step commands to test, build or run the application.

Docker Compose: https://docs.docker.com/compose/overview/

A `docker-compose.yml` is a YML file containing the required configuration for each container in the multi-container Docker environment.

В вашем Dockerfile предпочитайте COPY вместо использования ADD, если вы не пытаетесь добавить tar-файлы для автоматической распаковки

Откажитесь от использования команды start в файле package.json и выполняйте её непосредственно `CMD ["node", "server.js"]`. Это уменьшает количество запущенных процессов внутри контейнера, а также вызывает сигналы выхода, такие как SIGTERM и SIGINT, которые должны быть получены процессом Node.js вместо npm, подавляя их.

Вы также можете использовать флаг --init для оборачивания вашего процесса Node.js в лёгкую систему инициализации, которая будет реагировать на сигналы ядра, такие как SIGTERM (CTRL-C) и т.д. `docker run --rm -it --init -p 8080:8080 -v $(pwd):/app \ node-docker-dev bash`

```
docker-machine ls // list all machine names
docker-machine start [machine name] // start vb image
docker-machine stop [machine name] // stop vb image
docker-machine env [machine name] // set environment variables
docker-machine ip [machine name] // get the IP address of one or more machines
```
