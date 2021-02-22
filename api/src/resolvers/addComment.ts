import { Comment } from "@prisma/client/index";

import { prisma } from "./prismaClient";

interface IAddCommentInput {
  comment: {
    message: string;
    postId: number;
    parentId: number | null;
  };
}

interface IAddCommentResponse {
  code: string;
  success: boolean;
  message: string;
  comment?: Comment;
}

export default async function (
  _,
  { comment: { message, postId, parentId } }: IAddCommentInput,
  { isAuth }
): Promise<IAddCommentResponse> {
  let payload;
  try {
    payload = isAuth();
  } catch (error) {
    return {
      code: "401",
      success: false,
      message: error.message,
    };
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        message,
        author: { connect: { name: payload.userName } },
        post: { connect: { id: postId } },
        parent: parentId ? { connect: { id: parentId } } : undefined,
      },
      include: { author: true, post: true, parent: true },
    });

    return {
      code: "200",
      success: true,
      message: "Comment created succesfully.",
      comment: newComment,
    };
  } catch (error) {
    return {
      code: "500",
      success: false,
      message: error.message,
    };
  }
}
