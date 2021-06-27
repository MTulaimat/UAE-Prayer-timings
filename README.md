# UAE-Prayer-timings

*DEMO GIF*

![Alt Text](https://i.imgur.com/yBP8SC3.gif)

# Using Docker-compose
docker-compose up (start containers and network)
ctrl + c (stop container)
docker-compose down (to reset the containers)

# Using Docker commands
docker pull mtulaimat/uae-praying-times:back-latest
docker pull mtulaimat/uae-praying-times:front-latest

docker network create app

docker run --name node \
--network app \
--publish 8090:8090 \
uae-prayer-timings_node
mtulaimat/uae-praying-times:back-latest

docker run --name nginx \
--network app \
--publish 80:80 \
mtulaimat/uae-praying-times:front-latest