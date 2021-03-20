import { prisma } from "./utils/prismaClient";
import { IResponse } from "./utils/types";

export default async function (
  _,
  { commentId }: { commentId: number },
  { isAuth }
): Promise<IResponse> {
  try {
    var payload = isAuth();
    var name = payload.userName as string;

    const user = await prisma.user.findUnique({
      where: { name },
      include: { upvotedComments: { where: { id: commentId } } },
    });

    if (user.upvotedComments.length === 0)
      throw new Error("Comment isn't upvoted, cannot unvote.");
  } catch (error) {
    return {
      code: "401",
      success: false,
      message: error.message,
    };
  }

  try {
    await prisma.comment.update({
      where: { id: commentId },
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
      message: `Post '${commentId}' unvoted by ${name}.`,
    };
  } catch (error) {
    return {
      code: "500",
      success: false,
      message: error.message,
    };
  }
}
