import { User } from "@prisma/client/index";

import { prisma } from "./prismaClient";
import isValidEmail from "./utils/isValidEmail";

interface IInput {
  about: string;
  email: string;
}

interface IUpdateUser {
  code: string;
  success: boolean;
  message: string;
  user?: User;
}

export default async function (
  _,
  { input }: { input: IInput },
  { isAuth }
): Promise<IUpdateUser> {
  try {
    const { userName } = isAuth();

    const { about, email } = input;

    let updatedUser;
    if (email === "") {
      // user wants to delete email.
      updatedUser = await prisma.user.update({
        where: { name: userName },
        data: {
          email: null,
          about,
        },
      });
    } else if (isValidEmail(email)) {
      updatedUser = await prisma.user.update({
        where: { name: userName },
        data: {
          email,
          about,
        },
      });
    } else {
      // invalid email, only update about.
      updatedUser = await prisma.user.update({
        where: { name: userName },
        data: {
          about,
        },
      });
    }

    return {
      code: "200",
      success: true,
      message: "User updated",
      user: updatedUser,
    };
  } catch (error) {
    return {
      code: "401",
      success: false,
      message: error.message,
    };
  }
}
