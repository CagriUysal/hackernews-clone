import { ApolloServer } from "apollo-server";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ res }) => ({ res }),
});

server.listen().then(({ url }) => console.log(`Server running at ${url}`));
