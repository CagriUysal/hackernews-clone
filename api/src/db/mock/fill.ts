import { PrismaClient } from "@prisma/client";
const faker = require("faker");

const prisma = new PrismaClient();

const getRandom = (arr: any[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 *
 * @param userCount
 * @param PostCount
 *
 * Fill database with fake data.
 */
const fillDatabase = async (
  userCount: Number = 10,
  postCount: Number = 20,
  commentsCount: Number = 100
) => {
  const users = [];
  for (let i = 1; i <= userCount; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.name.findName(),
        email: faker.internet.email(),
      },
    });

    users.push(user);
  }

  const posts = [];
  for (let i = 1; i <= postCount; i++) {
    const post = await prisma.post.create({
      data: {
        link: faker.internet.url(),
        title: faker.lorem.sentence(),
        author: { connect: { name: getRandom(users).name } },
      },
    });
  }

  prisma.$disconnect();
};

fillDatabase();
