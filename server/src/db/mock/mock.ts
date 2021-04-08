import { URL } from "url";

import axios from "axios";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import getRankingScore from "../../utils/getRankingScore";

const prisma = new PrismaClient();
const COMMENT_PER_POST = 2;

interface IItem {
  by: string;
  id: number;
  time: number;
  type: string;
  descendants?: number;
  kids?: number[];
  score?: number;
  title?: string;
  url?: string;
  text?: string;
}

const getTopStoryIds = async (storyCount = 50) => {
  const URL =
    "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty";

  const { data } = await axios.get<number[]>(URL);
  return data.slice(0, storyCount);
};

const getItem = async (itemId: number) => {
  const URL = `https://hacker-news.firebaseio.com/v0/item/${itemId}.json`;

  const { data } = await axios.get<IItem>(URL);
  return data;
};

const mockComment = async (comment: IItem, postId: number) => {
  const { by: name, text, time } = comment;

  try {
    await prisma.comment.create({
      data: {
        author: {
          connectOrCreate: {
            where: { name },
            create: {
              name,
              password: await bcrypt.hash(name, 1), // use the same password as name for mocking purposes.
            },
          },
        },
        post: { connect: { id: postId } },
        message: text,
        createdAt: new Date(time * 1000), // convert unix time to date object
      },
    });
  } catch (error) {
    // pass, discard that post if some error occured while mocking
  }
};

const mockStory = async (story: IItem) => {
  const { by: name, title, url, text, score, time } = story;

  const createdAt = new Date(time * 1000); // convert unix time to date object

  try {
    var post = await prisma.post.create({
      data: {
        title,
        author: {
          connectOrCreate: {
            where: { name },
            create: {
              name,
              password: await bcrypt.hash(name, 1), // use the same password as name for mocking purposes.
            },
          },
        },
        link: url,
        upvote: score,
        createdAt,
        domain: url && new URL(url).hostname,
        text: text,
        rankingScore: getRankingScore(score, createdAt),
      },
    });
  } catch (error) {
    // pass, discard that comment if some error occured while mocking
  }

  return post;
};

(async function mock() {
  console.log("Because this uses live data, mocking can take couple seconds..");

  const topStoryIds = await getTopStoryIds();
  const topStories = await Promise.all(topStoryIds.map(getItem));

  // const posts = await Promise.all(topStories.map(mockStory)); // results in error sometimes, race conditions?
  const posts = [];
  for (const post of topStories) {
    posts.push(await mockStory(post));
  }

  console.log(`${posts.length} posts mocked from Hackernews API.`);
  console.log(`Mocking ${COMMENT_PER_POST} for each post...`);

  const mockedPostIds = posts.map(({ id }) => id);
  const kidsPostPair: [number[], number][] = topStories.map(({ kids }, i) => [
    kids,
    mockedPostIds[i], // for connecting comment to post in database.
  ]);

  // some post doesn't have comments yet, their kids are undefined
  const kidsPostFiltered = kidsPostPair.filter(([kids]) => kids);

  await Promise.all(
    kidsPostFiltered.map(([kidIds, postId]) =>
      (async function mockAllCommentsForPost() {
        const kids = await Promise.all(
          kidIds.slice(0, COMMENT_PER_POST).map(getItem)
        );
        for (const kid of kids) {
          await mockComment(kid, postId);
        }
      })()
    )
  );

  console.log("finished.");

  prisma.$disconnect();
})();
