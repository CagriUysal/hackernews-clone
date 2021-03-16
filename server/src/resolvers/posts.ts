import { Post } from "@prisma/client/index";

import { prisma } from "./utils/prismaClient";

export default async function posts(): Promise<Post[]> {
  return await prisma.post.findMany({
    include: { author: true, comments: true },
  });
}
