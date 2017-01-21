From node:7.4.0

WORKDIR /app

RUN npm install nodemon -g

copy package.json /app/package.json
RUN npm install

COPY app.js /app

EXPOSE 3000
