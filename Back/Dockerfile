FROM node:14.13.1-alpine

WORKDIR /app

COPY package.json package-lock.json ./ 

RUN npm install 

COPY . .
VOLUME /app

ENV NODE_ENV=production
EXPOSE 8090 
CMD ["npm", "start"]