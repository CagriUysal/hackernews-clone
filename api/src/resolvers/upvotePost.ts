import { Post } from "@prisma/client";
import { prisma } from "./utils/prismaClient";

interface IUpvotePost {
  code: string;
  success: boolean;
  message: string;
  post?: Post;
}

export default async function (
  _,
  { postId }: { postId: number },
  { isAuth }
): Promise<IUpvotePost> {
  try {
    var payload = isAuth();
    var name = payload.userName as string;

    const user = await prisma.user.findUnique({
      where: { name },
      include: { upvotes: { where: { id: postId } } },
    });

    if (user.upvotes.length !== 0) throw new Error("Already Upvoted.");
  } catch (error) {
    return {
      code: "401",
      success: false,
      message: error.message,
    };
  }

  try {
    const updatedPost = await prisma.post.update({
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

    return {
      code: "200",
      success: true,
      message: `Post '${postId}' upvoted by ${name}.`,
      post: updatedPost,
    };
  } catch (error) {
    return {
      code: "500",
      success: false,
      message: error.message,
    };
  }
}
