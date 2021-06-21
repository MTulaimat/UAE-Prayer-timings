FROM nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ./html /usr/share/nginx/html

VOLUME /usr/share/nginx/html
VOLUME /etc/nginx

# CMD [nginx-debug, '-g', 'daemon off;']