import { prisma } from "./utils/prismaClient";
import { IResponse } from "./utils/types";
import isLessThanOneHour from "./utils/isLessThanOneHour";

export default async function (
  _,
  { postId }: { postId: number },
  { isAuth }
): Promise<IResponse> {
  try {
    var { userName } = isAuth();

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true },
    });

    const { createdAt } = post;
    const creationTime = createdAt.getTime();
    if (!isLessThanOneHour(creationTime)) {
      throw new Error(
        "Post cannot be deleted after 1 hour pass their submission."
      );
    }

    const authorName = post.author.name;
    if (userName !== authorName) throw new Error("Not Auth.");

    await prisma.post.delete({ where: { id: postId } });

    return {
      code: "200",
      success: true,
      message: `Post ${postId} succesfully deleted.`,
    };
  } catch (error) {
    return {
      code: "400",
      success: false,
      message: error.message,
    };
  }
}
