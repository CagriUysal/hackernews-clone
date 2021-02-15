import { User } from "@prisma/client/index";

import { prisma } from "./prismaClient";

export default async function user(
  _,
  { name }: { name: string }
): Promise<User> {
  return await prisma.user.findUnique({
    where: { name },
    include: { comments: true, posts: true, favorites: true },
  });
}
