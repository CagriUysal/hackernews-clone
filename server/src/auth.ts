import { PrismaClient } from "@prisma/client";
import { Post, Comment } from "@prisma/client/index";
import { verify, sign } from "jsonwebtoken";
import { Request } from "express";

export const createAccessToken = (userName: string): string => {
  return sign({ userName }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
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
    process.env.REFRESH_TOKEN_SECRET,
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
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET); // throws an error if not valid

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
    include: { upvotedPosts: { where: { id: { in: postIds } } } },
  });
  const upvoteIds = user.upvotedPosts.map((post) => post.id);

  return posts.map((post) => ({
    ...post,
    currentUserUpvoted: upvoteIds.includes(post.id), // append graphql field
  }));
};

export const appendCommentUpvote = async (
  comments: Comment[],
  name: string,
  client: PrismaClient
) => {
  // NOTE: appending `currentUserUpvoted` field can be solved more elegantly?
  const commentId = comments.map((post) => post.id);
  const user = await client.user.findUnique({
    where: { name },
    include: { upvotedComments: { where: { id: { in: commentId } } } },
  });
  const upvoteIds = user.upvotedComments.map((post) => post.id);

  return comments.map((comment) => ({
    ...comment,
    currentUserUpvoted: upvoteIds.includes(comment.id), // append graphql field
  }));
};
