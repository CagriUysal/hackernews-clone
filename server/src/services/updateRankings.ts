import schedule from "node-schedule";

import { prisma } from "../utils/prismaClient";
import getRankingScore from "../utils/getRankingScore";

// Update scorings every 10 minute.
schedule.scheduleJob("*/10 * * * *", async function updateRankings() {
  const twoDaysBefore = new Date();
  twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);

  const posts = await prisma.post.findMany({
    where: {
      createdAt: { gte: twoDaysBefore },
    },
  });

  const currentTime = new Date();
  const updatedRankings = posts.map((post) =>
    getRankingScore(post.upvote, post.createdAt, currentTime)
  );

  posts.forEach(({ id }, i) => {
    (async function () {
      await prisma.post.update({
        where: {
          id,
        },
        data: {
          rankingScore: updatedRankings[i],
        },
      });
    })();
  });

  console.log("Home page ranks updated!");
});
