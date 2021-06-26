FROM nginx

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

COPY ./html /usr/share/nginx/html

VOLUME /usr/share/nginx/html
VOLUME /etc/nginx

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]