import { Post } from "@prisma/client/index";

import { prisma } from "./prismaClient";

interface IPost extends Post {
  currentUserFavorited: boolean;
}

export default async function post(
  _,
  { id }: { id: number },
  { isAuth }
): Promise<IPost> {
  try {
    const payload = isAuth();
    var name = payload.userName;
  } catch {
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

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      comments: true,
      // not empty if the post favorited by the authorized user.
      favoritedBy: { where: { name } },
    },
  });

  return { ...post, currentUserFavorited: post.favoritedBy.length > 0 };
}
