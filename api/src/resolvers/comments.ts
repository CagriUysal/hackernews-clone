import { Comment } from "@prisma/client/index";

import { prisma } from "./prismaClient";

export default async function comments(): Promise<Comment[]> {
  return await prisma.comment.findMany({
    include: { author: true, post: true, parent: true },
    orderBy: { createdAt: "desc" },
  });
}
