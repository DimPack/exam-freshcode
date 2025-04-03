ARG VERSION=lts-alpine

FROM node:$VERSION
WORKDIR /squadhelp
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x ./start-dev.sh

EXPOSE 3000
CMD ["./start-dev.sh"]