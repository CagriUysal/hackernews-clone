import { prisma } from "./utils/prismaClient";

interface IAddFavoriteResponse {
  code: string;
  success: boolean;
  message: string;
}

export default async function (
  _,
  { postId }: { postId: number },
  { isAuth }
): Promise<IAddFavoriteResponse> {
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
        favorites: {
          connect: {
            id: postId,
          },
        },
      },
    });

    return {
      code: "200",
      success: true,
      message: `Post '${postId}' added to ${name}'s favorites.`,
    };
  } catch (error) {
    return {
      code: "500",
      success: false,
      message: error.message,
    };
  }
}
