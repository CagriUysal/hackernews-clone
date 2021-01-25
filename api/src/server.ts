import { ApolloServer } from "apollo-server";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";
import { isAuth } from "./auth";

require("dotenv").config(); // eslint-disable-line

// Graphql server (CRUD)
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ res, req }) => ({
    res,
    req,
    isAuth: () => isAuth(req),
  }),
  cors: {
    origin: "http://localhost:1234",
    credentials: true,
  },
});

server.listen().then(({ url }) => console.log(`Graphql running at ${url}`));
