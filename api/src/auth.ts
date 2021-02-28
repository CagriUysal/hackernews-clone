import { PrismaClient } from "@prisma/client";
import { Post } from "@prisma/client/index";
import { verify, sign } from "jsonwebtoken";
import { Request } from "express";

export const createAccessToken = (userName: string): string => {
  return sign({ userName }, process.env.ACCESS_TOKEN, { expiresIn: "15m" });
};

export const createRefreshToken = async (
  userName: string,
  newTokenVersion: number,
  client: PrismaClient
): Promise<string> => {
  await client.user.update({
    where: { name: userName },
    data: { tokenVersion: newTokenVersion },
  });

  return sign(
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

export const appendUpvoteInfo = async (
  posts: Post[],
  name: string,
  client: PrismaClient
) => {
  // NOTE: appending `currentUserUpvoted` field can be solved more elegantly?

  const postIds = posts.map((post) => post.id);
  const user = await client.user.findUnique({
    where: { name },
    include: { upvotes: { where: { id: { in: postIds } } } },
  });
  const upvoteIds = user.upvotes.map((post) => post.id);

  return posts.map((post) => ({
    ...post,
    currentUserUpvoted: upvoteIds.includes(post.id), // append graphql field
  }));
};
