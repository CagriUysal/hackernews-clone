import { Comment } from "@prisma/client/index";

import { prisma } from "./prismaClient";

export default async function topLevelComments(
  _,
  { postId }: { postId: number }
): Promise<Comment[]> {
  return await prisma.comment.findMany({
    where: { post: { id: postId }, parent: null },
    include: { author: true, children: true },
  });
}
