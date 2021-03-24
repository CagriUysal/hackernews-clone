import { Post } from "@prisma/client/index";

import { prisma } from "../utils/prismaClient";
import { IResponse } from "./types";

interface upvotedPostsResponse extends IResponse {
  hidden?: Post[];
}

export default async function favoritePosts(
  _,
  { name }: { name: string },
  { isAuth, appendUpvoteInfo }
): Promise<upvotedPostsResponse> {
  const user = await prisma.user.findUnique({
    where: { name },
    select: {
      hidden: { include: { author: true, comments: true } },
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

    const postWithUpvoteInfo = await appendUpvoteInfo(
      user.hidden,
      userName,
      prisma
    );
    const postWithHiddenInfo = postWithUpvoteInfo.map((post) => ({
      ...post,
      currentUserHide: true,
    }));

    return {
      code: "200",
      success: true,
      message: "Success.",
      hidden: postWithHiddenInfo,
    };
  } catch (error) {
    console.log(error);
    return {
      code: "401",
      success: false,
      message: "Can't display that.",
    };
  }
}
