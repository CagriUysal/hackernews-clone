import bcrypt from "bcrypt";

import { prisma } from "./prismaClient";
import validatePassword from "./utils/validatePassword";

interface IInput {
  currentPw: string;
  newPw: string;
}

interface IResponse {
  code: string;
  success: boolean;
  message: string;
}

const SALT_ROUNDS = 10;

export default async function (
  _,
  { input }: { input: IInput },
  { isAuth }
): Promise<IResponse> {
  try {
    const { userName } = isAuth();

    const user = await prisma.user.findUnique({ where: { name: userName } });

    const { currentPw, newPw } = input;
    const match = await bcrypt.compare(currentPw, user.password);
    if (match === false) {
      throw Error("Current password incorrect. Please try again.");
    }

    validatePassword(newPw);
    const hash = await bcrypt.hash(newPw, SALT_ROUNDS);

    await prisma.user.update({
      where: { name: userName },
      data: { password: hash },
    });

    return {
      code: "200",
      success: true,
      message: "password changed succesfully.",
    };
  } catch (error) {
    return {
      code: "401",
      success: false,
      message: error.message,
    };
  }
}
