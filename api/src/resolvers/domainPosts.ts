import { Post } from "@prisma/client/index";

import { prisma } from "./prismaClient";

export default async function domainPosts(
  _,
  { domain }: { domain: string },
  { isAuth, appendUpvoteInfo }
): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    where: { domain },
    include: { author: true, comments: true },
  });

  try {
    const { userName } = isAuth();

    return await appendUpvoteInfo(posts, userName, prisma);
  } catch (error) {
    return posts;
  }
}
