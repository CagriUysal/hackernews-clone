import { Comment } from "@prisma/client/index";

import { prisma } from "../utils/prismaClient";
import { ITEM_PER_PAGE } from "../utils/constants";

export default async function comments(
  _,
  { page = 1 },
  { isAuth, appendCommentUpvote }
): Promise<Comment[]> {
  const comments = await prisma.comment.findMany({
    include: { author: true, post: true, parent: true },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * ITEM_PER_PAGE,
    take: ITEM_PER_PAGE,
  });

  try {
    const { userName } = isAuth();
    return await appendCommentUpvote(comments, userName, prisma);
  } catch (error) {
    return comments;
  }
}
