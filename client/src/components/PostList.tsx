import React, { FunctionComponent } from "react";

import { css } from "@emotion/react";

import PostListItem, { IPost } from "./PostListItem";

const styles = {
  container: (theme) => css`
    background-color: ${theme.colors.bg};
  `,
};

type ComponentProps = {
  posts: IPost[];
};

const Posts: FunctionComponent<ComponentProps> = ({ posts }) => {
  return (
    <main css={styles.container}>
      {posts.map((post, index) => (
        <PostListItem
          post={post}
          rank={index + 1}
          key={`${post.createdAt}-${post.title}`}
        />
      ))}
    </main>
  );
};

export default Posts;
