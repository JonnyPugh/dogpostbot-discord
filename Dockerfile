# Use buster-slim version to run on Raspberry Pi
FROM node:18.10.0-buster-slim

COPY . .

RUN npm i

CMD [ "npm", "start" ]
