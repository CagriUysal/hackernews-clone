import { Post } from "@prisma/client/index";

import { prisma } from "../utils/prismaClient";

export default async function userPosts(
  _,
  { name }: { name: string },
  { isAuth, appendUpvoteInfo }
): Promise<Post[]> {
  // check if user exists
  const user = await prisma.user.findUnique({ where: { name } });
  if (user === null) {
    return null;
  }

  const posts = await prisma.post.findMany({
    where: { author: { name } },
    include: { author: true, comments: true },
    orderBy: { createdAt: "desc" },
  });

  try {
    const { userName } = isAuth();

    return await appendUpvoteInfo(posts, userName, prisma);
  } catch (error) {
    return posts;
  }
}
