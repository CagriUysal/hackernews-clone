import { Post } from "@prisma/client/index";

import { prisma } from "./prismaClient";

export default async function posts(): Promise<Post[]> {
  return await prisma.post.findMany({ include: { author: true } });
}
