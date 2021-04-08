import { Post } from "@prisma/client/index";

import { prisma } from "../utils/prismaClient";
import { ITEM_PER_PAGE } from "../utils/constants";

interface IPost extends Post {
  currentUserUpvoted?: boolean;
}

export default async function (
  _,
  { page = 1 },
  { isAuth, appendUpvoteInfo }
): Promise<IPost[]> {
  // Search best posts in submissions created less than 2 days ago.
  // Due to the gravity in ranking algorithm, posts created more than 2 days ago expected
  // to have near zero rankingScore. They are filtered out while fetching posts.
  // NOTE: some posts may have tremendous amount of upvotes, which may make keep their rankingScore
  // high enough even after 2 days, we will miss out that posts with this implementation.
  const twoDaysBefore = new Date();
  twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);

  try {
    const { userName } = isAuth();

    const posts = await prisma.post.findMany({
      orderBy: { rankingScore: "desc" },
      where: {
        hiddenBy: { none: { name: userName } }, // don't include hidden posts.
        createdAt: { gte: twoDaysBefore },
      },
      include: { author: true, comments: true },
      skip: (page - 1) * ITEM_PER_PAGE,
      take: ITEM_PER_PAGE,
    });

    return await appendUpvoteInfo(posts, userName, prisma);
  } catch (error) {
    return await prisma.post.findMany({
      where: { createdAt: { gte: twoDaysBefore } },
      orderBy: { rankingScore: "desc" },
      include: { author: true, comments: true },
      skip: (page - 1) * ITEM_PER_PAGE,
      take: ITEM_PER_PAGE,
    });
  }
}
