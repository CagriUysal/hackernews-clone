import { Comment } from "@prisma/client/index";

import { prisma } from "./utils/prismaClient";

export default async function postComments(
  _,
  { postId }: { postId: number },
  { isAuth, appendCommentUpvote }
): Promise<Comment[]> {
  const comments = await prisma.comment.findMany({
    where: { post: { id: postId } },
    include: { author: true, parent: true, post: true },
  });

  try {
    const { userName } = isAuth();
    return await appendCommentUpvote(comments, userName, prisma);
  } catch (error) {
    return comments;
  }
}
