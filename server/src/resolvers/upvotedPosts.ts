import { Post } from "@prisma/client/index";

import { prisma } from "./utils/prismaClient";
import { IResponse } from "./utils/types";

interface upvotedPostsResponse extends IResponse {
  upvotes?: Post[];
}

export default async function (
  _,
  { name }: { name: string },
  { isAuth }
): Promise<upvotedPostsResponse> {
  const user = await prisma.user.findUnique({
    where: { name },
    select: {
      upvotedPosts: { include: { author: true, comments: true } },
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

    const modifiedPosts = user.upvotedPosts.map((post) => ({
      ...post,
      currentUserUpvoted: true,
    }));
    return {
      code: "200",
      success: true,
      message: "Success.",
      upvotes: modifiedPosts,
    };
  } catch (error) {
    return {
      code: "401",
      success: false,
      message: "Can't display that.",
    };
  }
}
