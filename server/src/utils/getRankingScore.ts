const getRankingScore = (upvote: number, createdAt: Date) => {
  // This functions implements the algorithm described in the following post,
  // https://medium.com/hacking-and-gonzo/how-hacker-news-ranking-algorithm-works-1d9b0cf2c08d
  const GRAVITY = 1.8;

  const hoursSinceSubmission = Math.floor(
    (new Date().getTime() - createdAt.getTime()) / 36e5
  );

  return upvote / Math.pow(hoursSinceSubmission + 2, GRAVITY);
};

export default getRankingScore;
