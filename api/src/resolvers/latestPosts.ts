import { Post } from "@prisma/client/index";

import { prisma } from "./prismaClient";

export default async function latestPosts(): Promise<Post[]> {
  return await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true, comments: true },
  });
}
