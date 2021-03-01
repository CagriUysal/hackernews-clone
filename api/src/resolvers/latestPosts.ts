import { Post } from "@prisma/client/index";

import { prisma } from "./prismaClient";

interface IPost extends Post {
  currentUserUpvoted?: boolean;
}

export default async function latestPosts(
  _,
  __,
  { isAuth, appendUpvoteInfo }
): Promise<IPost[]> {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true, comments: true },
  });

  try {
    const { userName } = isAuth();

    return await appendUpvoteInfo(posts, userName, prisma);
  } catch (error) {
    return posts;
  }
}
