import { Post } from "@prisma/client/index";

import { prisma } from "./prismaClient";

export default async function userPosts(
  _,
  { name }: { name: string }
): Promise<Post[]> {
  return await prisma.post.findMany({
    where: { author: { name } },
    include: { author: true, comments: true },
    orderBy: { createdAt: "desc" },
  });
}
