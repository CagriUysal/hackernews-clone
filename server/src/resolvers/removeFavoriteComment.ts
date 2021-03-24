import { prisma } from "../utils/prismaClient";
import { IResponse } from "./types";

export default async function (
  _,
  { commentId }: { commentId: number },
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
        favoritedComments: {
          disconnect: {
            id: commentId,
          },
        },
      },
    });

    return {
      code: "200",
      success: true,
      message: `Comment '${commentId}' removed from ${name}'s favorites.`,
    };
  } catch (error) {
    return {
      code: "500",
      success: false,
      message: error.message,
    };
  }
}
