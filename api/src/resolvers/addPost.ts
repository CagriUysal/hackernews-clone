import { URL } from "url";

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
    var payload = isAuth();
  } catch {
    return {
      code: "400",
      success: false,
      message: "Not authorized",
    };
  }

  try {
    // extract domain from link
    const url = new URL(link);
    const domain = url.hostname;

    const newPost = await prisma.post.create({
      data: {
        link,
        title,
        domain,
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
  } catch (err) {
    console.error(err);
    return {
      code: "500",
      success: false,
      message: "An error occured in server",
    };
  }
}
