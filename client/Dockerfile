FROM node:22-alpine

RUN npm install -g nodemon

WORKDIR /esidea

COPY package.json .

RUN npm i

COPY . .

EXPOSE 5174

CMD ["npm","run","dev"]

