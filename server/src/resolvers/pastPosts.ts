import { Post } from "@prisma/client/index";

import { prisma } from "./utils/prismaClient";
import { ITEM_PER_PAGE } from "../../../common/constants";

export default async function pastPosts(
  _,
  {
    input: { start, end },
    page = 1,
  }: { input: { start: string; end: string }; page: number },
  { isAuth, appendUpvoteInfo }
): Promise<Post[]> {
  const startDate = new Date(start); // target date
  const endDate = new Date(end); // target day + 1 day, exclusive

  try {
    const { userName } = isAuth();

    const posts = await prisma.post.findMany({
      include: { author: true, comments: true },
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
        hiddenBy: { none: { name: userName } },
      },
      skip: (page - 1) * ITEM_PER_PAGE,
      take: ITEM_PER_PAGE,
    });

    return await appendUpvoteInfo(posts, userName, prisma);
  } catch (error) {
    return await prisma.post.findMany({
      include: { author: true, comments: true },
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      skip: (page - 1) * ITEM_PER_PAGE,
      take: ITEM_PER_PAGE,
    });
  }
}
