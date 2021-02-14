import { Post } from "@prisma/client/index";

import { prisma } from "./prismaClient";

export default async function pastPosts(
  _,
  { input: { start, end } }: { input: { start: string; end: string } }
): Promise<Post[]> {
  console.log(start);
  console.log(end);

  const startDate = new Date(start); // target date
  const endDate = new Date(end); // target day + 1 day, exclusive

  return await prisma.post.findMany({
    include: { author: true, comments: true },
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
  });
}
