FROM node:22-alpine

RUN npm install -g nodemon

WORKDIR /esidea

COPY package.json .

RUN npm install -i

COPY . .

EXPOSE 3000

CMD ["npm","run","dev"]

