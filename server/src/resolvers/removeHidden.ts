import { prisma } from "../utils/prismaClient";
import { IResponse } from "./types";

export default async function (
  _,
  { postId }: { postId: number },
  { isAuth }
): Promise<IResponse> {
  try {
    var payload = isAuth();
  } catch (error) {
    return {
      code: "401",
      success: false,
      message: error.message,
    };
  }

  try {
    const name = payload.userName as string;
    await prisma.user.update({
      where: { name },
      data: {
        hidden: {
          disconnect: {
            id: postId,
          },
        },
      },
    });

    return {
      code: "200",
      success: true,
      message: `Post '${postId}' removed from ${name}'s hidden.`,
    };
  } catch (error) {
    return {
      code: "500",
      success: false,
      message: error.message,
    };
  }
}
