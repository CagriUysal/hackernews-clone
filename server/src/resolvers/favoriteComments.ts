import { Comment } from "@prisma/client/index";

import { prisma } from "../utils/prismaClient";

interface IComment extends Comment {
  currentUserFavorited?: boolean;
}

export default async function (
  _,
  { name }: { name: string },
  { isAuth, appendCommentUpvote }
): Promise<IComment[]> {
  const user = await prisma.user.findUnique({
    where: { name },
    select: {
      favoritedComments: {
        include: { author: true, post: true, parent: true },
      },
    },
  });

  if (user === null) {
    return null; // no such user
  }

  try {
    const { userName } = isAuth();

    const modifiedComments = await appendCommentUpvote(
      user.favoritedComments,
      userName,
      prisma
    );

    if (userName === name) {
      // if authorized user is the same with the user selected,
      // give authorized user the ability to unfavorite posts.
      return modifiedComments.map((comment) => ({
        ...comment,
        currentUserFavorited: true,
      }));
    } else {
      return modifiedComments;
    }
  } catch {
    return user.favoritedComments;
  }
}
