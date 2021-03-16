import bcrypt from "bcrypt";

import { prisma } from "./utils/prismaClient";
import sendRefreshToken from "../sendRefreshToken";
import { createAccessToken, createRefreshToken } from "../auth";

interface ILoginResponse {
  code: string;
  success: boolean;
  message: string;
  accessToken?: string;
}

interface ILogin {
  name: string;
  password: string;
}

export default async function (
  _,
  { user: { name, password } }: { user: ILogin },
  { res }
): Promise<ILoginResponse> {
  // validate input
  try {
    const user = await prisma.user.findUnique({ where: { name } });
    if (user === null) {
      throw Error("User does not exists.");
    }

    const match = await bcrypt.compare(password, user.password);
    if (match === false) {
      throw Error("Wrong password.");
    }

    sendRefreshToken(
      res,
      await createRefreshToken(name, user.tokenVersion + 1, prisma)
    );

    const accessToken = createAccessToken(name);
    return {
      code: "200",
      success: true,
      message: "Login successful.",
      accessToken,
    };
  } catch (err) {
    return {
      code: "400",
      success: false,
      message: "Bad Login.",
    };
  }
}
