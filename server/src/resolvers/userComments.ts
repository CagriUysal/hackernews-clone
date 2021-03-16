import { Comment } from "@prisma/client/index";

import { prisma } from "./utils/prismaClient";

export default async function userComments(
  _,
  { name }: { name: string }
): Promise<Comment[]> {
  // check if user exists
  const user = await prisma.user.findUnique({ where: { name } });
  if (user === null) {
    return null;
  }

  return await prisma.comment.findMany({
    where: { author: { name } },
    include: { author: true, post: true },
    orderBy: { createdAt: "desc" },
  });
}
