import { Prisma } from "@prisma/client";
import { User } from "@prisma/client/index";
const bcrypt = require("bcrypt"); //eslint-disable-line

import { prisma } from "./prismaClient";

const SALT_ROUNDS = 10;

interface IRegisterResponse {
  code: string;
  success: boolean;
  message: string;
  user?: User;
}

export default async function (
  _,
  { user: { name, password } }: { user: Prisma.UserCreateInput }
): Promise<IRegisterResponse> {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const newUser = await prisma.user.create({
      data: { name, password: hash },
    });

    return {
      code: "200",
      success: true,
      message: "User created succesfully.",
      user: newUser,
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
      return {
        code: "500",
        success: false,
        message: "Unknown error in the server.",
      };
    }
  }
}
