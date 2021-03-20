import { Post } from "@prisma/client/index";

import { prisma } from "./utils/prismaClient";

interface IPost extends Post {
  currentUserFavorited?: boolean;
}

export default async function favoritePosts(
  _,
  { name }: { name: string },
  { isAuth, appendUpvoteInfo }
): Promise<IPost[]> {
  const user = await prisma.user.findUnique({
    where: { name },
    select: {
      favoritePosts: { include: { author: true, comments: true } },
    },
  });

  if (user === null) {
    return null; // no such user
  }

  try {
    const { userName } = isAuth();

    const modifiedPosts = await appendUpvoteInfo(
      user.favoritePosts,
      userName,
      prisma
    );

    if (userName === name) {
      // if authorized user is the same with the user selected,
      // give authorized user the ability to unfavorite posts.
      return modifiedPosts.map((post) => ({
        ...post,
        currentUserFavorited: true,
      }));
    } else {
      return modifiedPosts;
    }
  } catch {
    return user.favoritePosts;
  }
}
