FROM node:14-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lock

COPY . .

# yarn initDB, initialize the database and create prisma client
# yarn start, starts the graphql server
CMD ["sh", "-c", "yarn initDB && yarn start"]  