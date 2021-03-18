import { URL } from "url";

import { prisma } from "./utils/prismaClient";
import { IResponse } from "./utils/types";
import validateSubmit from "../../../common/validateSubmit";

interface IAddPostInput {
  post: {
    link: string;
    title: string;
    text: string;
  };
}

export default async function (
  _,
  { post: { link, title, text } }: IAddPostInput,
  { isAuth }
): Promise<IResponse> {
  try {
    var { userName } = isAuth();
  } catch {
    return {
      code: "400",
      success: false,
      message: "Not authorized",
    };
  }

  try {
    validateSubmit({ title, link, text });
  } catch (error) {
    return {
      code: "400",
      success: false,
      message: error.message,
    };
  }

  try {
    if (link !== "") {
      const url = new URL(link);
      const domain = url.hostname;

      const post = await prisma.post.create({
        data: {
          link,
          title,
          domain,
          author: {
            connect: { name: userName },
          },
        },
        include: { author: true },
      });

      // when provided with link,
      // text is appended as a the first comment in the post
      if (text !== "") {
        await prisma.comment.create({
          data: {
            message: text,
            post: { connect: { id: post.id } },
            author: { connect: { name: userName } },
          },
        });
      }
    } else {
      await prisma.post.create({
        data: {
          title,
          author: {
            connect: { name: userName },
          },
          text: text !== "" ? text : null,
        },
      });
    }

    return {
      code: "200",
      success: true,
      message: "post created succesfully.",
    };
  } catch (err) {
    return {
      code: "500",
      success: false,
      message: "An error occured in server",
    };
  }
}
