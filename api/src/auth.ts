import { PrismaClient } from "@prisma/client";

const jwt = require("jsonwebtoken"); //eslint-disable-line

export const createAccessToken = (userName: string): string => {
  return jwt.sign({ userName }, process.env.ACCESS_TOKEN, { expiresIn: "15m" });
};

export const createRefreshToken = async (
  userName: string,
  newTokenVersion: number,
  prismaClient: PrismaClient
): Promise<string> => {
  await prismaClient.user.update({
    where: { name: userName },
    data: { tokenVersion: newTokenVersion },
  });

  return jwt.sign(
    { userName, tokenVersion: newTokenVersion },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: "7d",
    }
  );
};
