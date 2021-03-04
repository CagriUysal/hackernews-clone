import { User } from "@prisma/client/index";

import { prisma } from "./prismaClient";

export default async function user(
  _,
  { name }: { name: string },
  { isAuth }
): Promise<User> {
  try {
    const { userName } = isAuth();

    if (userName === name) {
      // current user accesing his own account. can see private fields.
      return await prisma.user.findUnique({
        where: { name },
        include: { hidden: true },
      });
    }
  } catch (error) {
    // pass
  }

  return await prisma.user.findUnique({
    where: { name },
  });
}
