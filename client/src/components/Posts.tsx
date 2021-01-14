import React, { FunctionComponent } from "react";

import { css } from "@emotion/react";

import Post, { IPost } from "./Post";

const styles = {
  container: css`
    width: 85%;
    margin: 0 auto;
    background-color: #f6f6ef;
  `,
};

type ComponentProps = {
  posts: IPost[];
};

const Posts: FunctionComponent<ComponentProps> = ({ posts }) => {
  return (
    <main css={styles.container}>
      {posts.map((post, index) => (
        <Post
          post={post}
          rank={index + 1}
          key={`${post.createdAt}-${post.title}`}
        />
      ))}
    </main>
  );
};

export default Posts;
