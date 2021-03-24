import { Post } from "@prisma/client/index";

import { prisma } from "../utils/prismaClient";

interface IPost extends Post {
  currentUserFavorited: boolean;
  currentUserUpvoted?: boolean;
  currentUserHide?: boolean;
}

export default async function post(
  _,
  { id }: { id: number },
  { isAuth }
): Promise<IPost> {
  try {
    const { userName } = isAuth();

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: true,
        // following arrays not empty if the post favorited by or upvoted the authorized user.
        favoritedBy: { where: { name: userName } },
        upvotedBy: { where: { name: userName } },
        hiddenBy: { where: { name: userName } },
      },
    });

    return {
      ...post,
      currentUserFavorited: post.favoritedBy.length > 0,
      currentUserUpvoted: post.upvotedBy.length > 0,
      currentUserHide: post.hiddenBy.length > 0,
    };
  } catch (error) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: true,
      },
    });

    // no-one authorized
    return { ...post, currentUserFavorited: false };
  }
}
