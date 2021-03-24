import { prisma } from "../utils/prismaClient";
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

    if (user.upvotedPosts.length === 0)
      throw new Error("Post isn't upvoted, cannot unvote.");
  } catch (error) {
    return {
      code: "401",
      success: false,
      message: error.message,
    };
  }

  try {
    await prisma.post.update({
      where: { id: postId },
      data: {
        upvotedBy: {
          disconnect: {
            name,
          },
        },
        upvote: { decrement: 1 },
      },
    });

    return {
      code: "200",
      success: true,
      message: `Post '${postId}' unvoted by ${name}.`,
    };
  } catch (error) {
    return {
      code: "500",
      success: false,
      message: error.message,
    };
  }
}
