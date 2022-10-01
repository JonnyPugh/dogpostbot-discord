FROM node:18.10.0-alpine3.15

COPY . .

RUN npm i

CMD [ "npm", "start" ]
