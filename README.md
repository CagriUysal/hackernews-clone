## Objective

Build a hackernews clone.

## What will be learnt:

- Authentication
- Pagination
- Graphql both in frontend and backend
- Prisma as orm

Tech Stack:

- Database: Postgress
- ORM: prisma
- API: Apollo Server
- Frontend: React with Apollo Client

## Installation

First create `.env` file in the root folder.

`.env` file should containe a variable called `DATABASE_URL`. See:
[Connection URLs](https://www.prisma.io/docs/reference/database-reference/connection-urls)

To crate migrations, run:

`yarn migrate`
