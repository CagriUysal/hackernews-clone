import { Post } from "@prisma/client/index";

import { prisma } from "../utils/prismaClient";
import { ITEM_PER_PAGE } from "../utils/constants";

interface IPost extends Post {
  currentUserUpvoted?: boolean;
}

export default async function latestPosts(
  _,
  { page = 1 },
  { isAuth, appendUpvoteInfo }
): Promise<IPost[]> {
  try {
    const { userName } = isAuth();

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      where: { hiddenBy: { none: { name: userName } } }, // don't include hidden posts.
      include: { author: true, comments: true },
      skip: (page - 1) * ITEM_PER_PAGE,
      take: ITEM_PER_PAGE,
    });

    return await appendUpvoteInfo(posts, userName, prisma);
  } catch (error) {
    return await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: true, comments: true },
      skip: (page - 1) * ITEM_PER_PAGE,
      take: ITEM_PER_PAGE,
    });
  }
}
