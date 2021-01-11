import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
  MutationResponse: {
    __resolveType: (response) => {
      if (response.post) return "Post";
      if (response.author) return "Author";
    },
  },
  Query: {
    posts: async () => {
      return await prisma.post.findMany({ include: { author: true } });
    },
  },
};
