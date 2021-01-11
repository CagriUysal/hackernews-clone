import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const wipeDB = async () => {
  await prisma.user.deleteMany({
    where: { id: { not: 0 } },
  });
  await prisma.post.deleteMany({
    where: { id: { not: 0 } },
  });
  await prisma.comment.deleteMany({
    where: { id: { not: 0 } },
  });

  prisma.$disconnect();
};

wipeDB();
