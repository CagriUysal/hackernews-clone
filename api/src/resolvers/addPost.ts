import { Post } from "@prisma/client/index";

import { prisma } from "./prismaClient";

interface IAddPostInput {
  post: {
    link: string;
    title: string;
  };
}

interface IAddPostResponse {
  code: string;
  success: boolean;
  message: string;
  post?: Post;
}

export default async function (
  _,
  { post: { link, title } }: IAddPostInput,
  { isAuth }
): Promise<IAddPostResponse> {
  try {
    const payload = isAuth();

    const newPost = await prisma.post.create({
      data: {
        link,
        title,
        author: {
          connect: { name: payload.userName },
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
  } catch {
    return {
      code: "401",
      success: false,
      message: "not authorized.",
    };
  }
}
