import { Comment } from "@prisma/client/index";

import { prisma } from "./prismaClient";

export default async function comment(
  _,
  { id }: { id: number }
): Promise<Comment> {
  return await prisma.comment.findUnique({
    where: { id },
    include: { author: true, parent: true, post: true },
  });
}
