# Dockerfile
FROM node:16

WORKDIR /app

COPY package*.json ./


RUN npm install
RUN npm install -g nodemon

COPY . .

COPY wait-for-it.sh /wait-for-it.sh

RUN chmod +x /wait-for-it.sh

EXPOSE 5000

ENTRYPOINT ["/wait-for-it.sh", "db:5432", "--", "npm", "run", "dev"]