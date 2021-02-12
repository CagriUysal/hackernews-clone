import { Post } from "@prisma/client/index";

import { prisma } from "./prismaClient";

export default async function domainPosts(
  _,
  { domain }: { domain: string }
): Promise<Post[]> {
  return await prisma.post.findMany({
    where: { domain },
    include: { author: true, comments: true },
  });
}
