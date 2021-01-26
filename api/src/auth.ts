import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";
import { Request } from "express";

import jwt from "jsonwebtoken";

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

export const isAuth = (req: Request) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    throw new Error("Not Auth.");
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN); // throws an error if not valid

    return payload;
  } catch (error) {
    throw new Error("Not Auth.");
  }
};
