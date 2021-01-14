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
      <Post post={posts[0]} />
    </main>
  );
};

export default Posts;
