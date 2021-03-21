import { Comment } from "@prisma/client/index";

import { prisma } from "./utils/prismaClient";
import { IResponse } from "./utils/types";

interface upvotedPostsResponse extends IResponse {
  upvotes?: Comment[];
}

export default async function (
  _,
  { name }: { name: string },
  { isAuth }
): Promise<upvotedPostsResponse> {
  const user = await prisma.user.findUnique({
    where: { name },
    select: {
      upvotedComments: {
        include: { author: true, post: true, parent: true },
      },
    },
  });

  if (user === null) {
    return {
      code: "404",
      success: false,
      message: "No such user",
    };
  }

  try {
    const { userName } = isAuth();

    if (userName !== name) throw new Error();

    const modifiedComments = user.upvotedComments.map((post) => ({
      ...post,
      currentUserUpvoted: true,
    }));
    return {
      code: "200",
      success: true,
      message: "Success.",
      upvotes: modifiedComments,
    };
  } catch (error) {
    return {
      code: "401",
      success: false,
      message: "Can't display that.",
    };
  }
}
