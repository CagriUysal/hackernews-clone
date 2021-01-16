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
    ): Promise<IAddPostResponse> => {
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

    login: async (
      _,
      { user: { name, password } }: { user: ILogin }
    ): Promise<ILoginResponse> => {
      // validate input
      try {
        const user = await prisma.user.findUnique({ where: { name } });
        if (user === null) {
          throw Error("User does not exists.");
        }

        const match = await bcrypt.compare(password, user.password);
        if (match === false) {
          throw Error("Wrong password.");
        }

        return {
          code: "200",
          success: true,
          message: "Login successful.",
          accessToken: "RANDOM STUFF HERE",
        };
      } catch (err) {
        return {
          code: "400",
          success: false,
          message: "Bad Login.",
        };
      }
    },

    register: async (
      _,
      { user: { name, password } }: { user: Prisma.UserCreateInput }
    ): Promise<IRegisterResponse> => {
      const hash = await bcrypt.hash(password, SALT_ROUNDS);

      try {
        const newUser = await prisma.user.create({
          data: { name, password: hash },
        });

        return {
          code: "200",
          success: true,
          message: "User created succesfully.",
          user: newUser,
        };
      } catch (err) {
        if (err.code === "P2002") {
          // unique field taken error
          return {
            code: "400",
            success: false,
            message: "That username is taken. Please choose another.",
          };
        } else {
          return {
            code: "500",
            success: false,
            message: "Unknown error in the server.",
          };
        }
      }
    },
  },
};

interface IRegisterResponse {
  code: string;
  success: boolean;
  message: string;
  user?: User;
}

interface IAddPostResponse {
  code: string;
  success: boolean;
  message: string;
  post?: Post;
}
interface ILoginResponse {
  code: string;
  success: boolean;
  message: string;
  accessToken?: string;
}

interface ILogin {
  name: string;
  password: string;
}
