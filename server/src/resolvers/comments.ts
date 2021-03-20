import { Comment } from "@prisma/client/index";

import { prisma } from "./utils/prismaClient";

export default async function comments(
  _,
  __,
  { isAuth, appendCommentUpvote }
): Promise<Comment[]> {
  const comments = await prisma.comment.findMany({
    include: { author: true, post: true, parent: true },
    orderBy: { createdAt: "desc" },
  });

  try {
    const { userName } = isAuth();
    return await appendCommentUpvote(comments, userName, prisma);
  } catch (error) {
    return comments;
  }
}
