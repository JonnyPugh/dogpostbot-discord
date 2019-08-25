FROM node:12.9.0-alpine

COPY . .

RUN npm i

CMD [ "npm", "start" ]
