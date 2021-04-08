FROM node:14-alpine

WORKDIR /app 

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install --frozen-lock

COPY . .

CMD ["yarn", "start"]