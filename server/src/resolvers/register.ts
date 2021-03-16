import bcrypt from "bcrypt";

import { prisma } from "./utils/prismaClient";
import { IResponse } from "./utils/types";
import validateRegister from "../../../common/validateRegister";

const SALT_ROUNDS = 10;

interface IUser {
  name: string;
  password: string;
}

export default async function (
  _,
  { user: { name, password } }: { user: IUser }
): Promise<IResponse> {
  try {
    validateRegister({ name, password });
  } catch (err) {
    return {
      code: "400",
      success: false,
      message: err.message,
    };
  }

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    await prisma.user.create({
      data: { name, password: hash },
    });

    return {
      code: "200",
      success: true,
      message: "User created succesfully.",
    };
  } catch (err) {
    if (err.code === "P2002") {
      // unique field taken error
      return {
        code: "400",
        success: false,
        message: "That username is taken. Please choose another.",
      };
    } else {
      console.log(err.message);
      return {
        code: "500",
        success: false,
        message: "Unknown error in the server.",
      };
    }
  }
}
