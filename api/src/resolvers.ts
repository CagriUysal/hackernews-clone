import { Prisma, PrismaClient } from "@prisma/client";
import { Response, Request } from "express";
import { User, Post } from "@prisma/client/index";

const bcrypt = require("bcrypt"); //eslint-disable-line

import { createAccessToken, createRefreshToken } from "./auth";
import sendRefreshToken from "./sendRefreshToken";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export const resolvers = {
  Response: {
    __resolveType: (response): string => {
      if (response.post) return "Post";
      if (response.user) return "User";
    },
  },

  Query: {
    posts: async (): Promise<Post[]> => {
      return await prisma.post.findMany({ include: { author: true } });
    },
    me: async (_, __, { isAuth }): Promise<{ name: string } | null> => {
      try {
        const payload = isAuth();

        return {
          name: payload.userName,
        };
      } catch (err) {
        return null;
      }
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
      { user: { name, password } }: { user: ILogin },
      { res }: IContext
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

        sendRefreshToken(
          res,
          await createRefreshToken(name, user.tokenVersion + 1, prisma)
        );

        const accessToken = createAccessToken(name);
        return {
          code: "200",
          success: true,
          message: "Login successful.",
          accessToken,
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
        console.log(err);
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
    logout: (_, __, { isAuth, res }): boolean => {
      try {
        isAuth();

        // clear refresh token cookie
        sendRefreshToken(res, "");

        return true;
      } catch {
        return false;
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

interface IContext {
  res: Response;
  req: Request;
}
