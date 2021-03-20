import { Comment } from "@prisma/client/index";

import { prisma } from "./utils/prismaClient";

interface IComment extends Comment {
  currentUserUpvoted?: boolean;
}

export default async function comment(
  _,
  { id }: { id: number },
  { isAuth }
): Promise<IComment> {
  try {
    const { userName } = isAuth();

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        author: true,
        parent: true,
        post: true,
        upvotedBy: { where: { name: userName } },
      },
    });

    return {
      ...comment,
      currentUserUpvoted: comment.upvotedBy.length > 0,
    };
  } catch (error) {
    return await prisma.comment.findUnique({
      where: { id },
      include: {
        author: true,
        parent: true,
        post: true,
      },
    });
  }
}
