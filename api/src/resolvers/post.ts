import { Post } from "@prisma/client/index";

import { prisma } from "./prismaClient";

export default async function post(_, { id }: { id: number }): Promise<Post> {
  return await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  });
}
