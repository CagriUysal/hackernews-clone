import { Comment } from "@prisma/client/index";

import { prisma } from "../utils/prismaClient";

export default async function userComments(
  _,
  { name }: { name: string },
  { isAuth, appendCommentUpvote }
): Promise<Comment[]> {
  // check if user exists
  const user = await prisma.user.findUnique({ where: { name } });
  if (user === null) {
    return null;
  }

  const comments = await prisma.comment.findMany({
    where: { author: { name } },
    include: { author: true, post: true },
    orderBy: { createdAt: "desc" },
  });

  try {
    const { userName } = isAuth();
    return await appendCommentUpvote(comments, userName, prisma);
  } catch (error) {
    return comments;
  }
}
