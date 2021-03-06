import bcrypt from "bcrypt";

import { prisma } from "./utils/prismaClient";
import { IResponse } from "./utils/types";

const SALT_ROUNDS = 10;

interface IUser {
  name: string;
  password: string;
}

export default async function (
  _,
  { user: { name, password } }: { user: IUser }
): Promise<IResponse> {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    await prisma.user.create({
      data: { name, password: hash },
    });

    return {
      code: "200",
      success: true,
      message: "User created succesfully.",
    };
  } catch (err) {
    console.log(err.message);
    if (err.code === "P2002") {
      // unique field taken error
      return {
        code: "400",
        success: false,
        message: "That username is taken. Please choose another.",
      };
    } else {
      return {
        code: "500",
        success: false,
        message: "Unknown error in the server.",
      };
    }
  }
}
