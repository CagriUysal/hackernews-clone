import { Prisma, PrismaClient } from "@prisma/client";
import { User, Post } from "@prisma/client/index";

const bcrypt = require("bcrypt"); //eslint-disable-line

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export const resolvers = {
  MutationResponse: {
    __resolveType: (response): string => {
      if (response.post) return "Post";
      if (response.user) return "User";
    },
  },

  Query: {
    posts: async (): Promise<Post[]> => {
      return await prisma.post.findMany({ include: { author: true } });
    },
  },

  Mutation: {
    addPost: async (
      _,
      {
        post: { link, title, userName },
      }: { post: { link: string; title: string; userName: string } }
    ): Promise<IMutationResponse> => {
      const newPost = await prisma.post.create({
        data: {
          link,
          title,
          author: {
            connect: { name: userName },
          },
        },
        include: { author: true },
      });

      return {
        code: "200",
        success: true,
        message: "post created succesfully.",
        post: newPost,
      };
    },

    addUser: async (
      _,
      { user: { name, password } }: { user: Prisma.UserCreateInput }
    ): Promise<IMutationResponse> => {
      const hash = await bcrypt.hash(password, SALT_ROUNDS);

      const newUser = await prisma.user.create({
        data: { name, password: hash },
      });

      return {
        code: "200",
        success: true,
        message: "user created succesfully.",
        user: newUser,
      };
    },
  },
};

interface IMutationResponse {
  code: string;
  success: boolean;
  message: string;
  post?: Post;
  user?: User;
}
