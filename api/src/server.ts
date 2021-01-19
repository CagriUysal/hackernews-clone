import { ApolloServer } from "apollo-server";
import { verify } from "jsonwebtoken";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";

require("dotenv").config(); // eslint-disable-line

// Graphql server (CRUD)
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ res, req }) => ({
    res,
    req,
    isAuth: () => {
      const authHeader = req.headers["authorization"];

      if (!authHeader) {
        throw new Error("Not Auth.");
      }

      try {
        const token = authHeader.split(" ")[1];
        const payload = verify(token, process.env.ACCESS_TOKEN); // throws an error if not valid

        return payload;
      } catch (error) {
        throw new Error("Not Auth.");
      }
    },
  }),
  cors: {
    origin: "http://localhost:1234",
    credentials: true,
  },
});

server.listen().then(({ url }) => console.log(`Graphql running at ${url}`));
