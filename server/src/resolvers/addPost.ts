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
    var payload = isAuth();
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
    // extract domain from link
    const url = new URL(link);
    const domain = url.hostname;

    await prisma.post.create({
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
