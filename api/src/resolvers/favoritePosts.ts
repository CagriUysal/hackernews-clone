import { Post } from "@prisma/client/index";
import post from "./post";

import { prisma } from "./prismaClient";

interface IPost extends Post {
  currentUserFavorited?: boolean;
}

export default async function favoritePosts(
  _,
  { name }: { name: string },
  { isAuth }
): Promise<IPost[]> {
  // check if user exists
  const user = await prisma.user.findUnique({
    where: { name },
    select: { favorites: { include: { author: true, comments: true } } },
  });

  if (user === null) {
    return null; // no such user
  }

  try {
    const { userName } = isAuth();

    if (userName === name) {
      return user.favorites.map((post) => ({
        ...post,
        currentUserFavorited: true,
      }));
    }
  } catch {
    // pass
  }

  return user.favorites;
}
