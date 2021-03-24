import { prisma } from "../utils/prismaClient";
import submittedLessThan2Days from "../utils/submittedLessThan2Days";
import getRankingScore from "../utils/getRankingScore";
import { IResponse } from "./types";

export default async function (
  _,
  { postId }: { postId: number },
  { isAuth }
): Promise<IResponse> {
  try {
    var payload = isAuth();
    var name = payload.userName as string;

    const user = await prisma.user.findUnique({
      where: { name },
      include: { upvotedPosts: { where: { id: postId } } },
    });

    if (user.upvotedPosts.length !== 0) throw new Error("Already Upvoted.");
  } catch (error) {
    return {
      code: "401",
      success: false,
      message: error.message,
    };
  }

  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        upvotedBy: {
          connect: {
            name,
          },
        },
        upvote: { increment: 1 },
      },
    });

    // Posts which created less than 2 days ago considered at rankings,
    // Don't need to update rankingScore if it was more 2 days after submissions.
    const { createdAt, upvote } = post;
    if (submittedLessThan2Days(createdAt)) {
      await prisma.post.update({
        where: { id: postId },
        data: {
          rankingScore: getRankingScore(upvote, createdAt),
        },
      });
    }

    return {
      code: "200",
      success: true,
      message: `Post '${postId}' upvoted by ${name}.`,
    };
  } catch (error) {
    return {
      code: "500",
      success: false,
      message: error.message,
    };
  }
}
