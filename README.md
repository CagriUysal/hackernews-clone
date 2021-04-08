## Hackernews Clone

A full stack hackernews clone build with React, Graphql, Prisma and Postgres.

## Run

First create `.env` file in the *server* folder. File should contain,

```
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
COOKIE_NAME=
DATABASE_URL=
```

You can rename `.env.example` to `.env` for quick start.

If you are going to change *DATABASE_URL* variable, you should also configure `docker-compose.yml` accordingly. 
Check [Connection URLs](https://www.prisma.io/docs/reference/database-reference/connection-urls) to learn more.


To start development, run,

```
docker-compose up 
```

in the *root* folder.

## Mocking

You can mock database with real Hackernews data. 
It uses [Hackernews API](https://github.com/HackerNews/API) to fetch recent top posts and couple comments. 

`
Note: Mocked users have the same password as username.
`

Run,

```
docker-compose exec server yarn mock
```

after all services up. 