import { Post } from "@prisma/client/index";

import { prisma } from "./utils/prismaClient";

export default async function domainPosts(
  _,
  { domain }: { domain: string },
  { isAuth, appendUpvoteInfo }
): Promise<Post[]> {
  try {
    const { userName } = isAuth();
    const posts = await prisma.post.findMany({
      where: { hiddenBy: { none: { name: userName } }, domain },
      include: { author: true, comments: true },
    });

    return await appendUpvoteInfo(posts, userName, prisma);
  } catch (error) {
    return await prisma.post.findMany({
      where: { domain },
      include: { author: true, comments: true },
    });
  }
}
