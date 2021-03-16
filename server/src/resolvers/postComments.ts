import { Comment } from "@prisma/client/index";

import { prisma } from "./utils/prismaClient";

export default async function postComments(
  _,
  { postId }: { postId: number }
): Promise<Comment[]> {
  return await prisma.comment.findMany({
    where: { post: { id: postId } },
    include: { author: true, parent: true, post: true },
  });
}
