import React, { FunctionComponent } from "react";

import { css } from "@emotion/react";

// @ts-ignore
import upArrow from "../assets/grayarrow2x.gif";

const styles = {
  container: css`
    color: #000;
    padding: 0.5em;
    font-size: 0.9em;
  `,
  title: css`
    margin-left: 0.1em;
  `,
  button: css`
    background: none;
    border: none;
    &:hover {
      cursor: pointer;
    }
  `,
  domain: css`
    color: #828282;
    font-size: 0.7em;
    margin-left: 0.5em;
  `,
  bottom: css`
    color: #828282;
    font-size: 0.7em;
    margin-left: 4em;
  `,
};

type ComponentProps = {
  post: IPost;
  rank: number;
};

const Post: FunctionComponent<ComponentProps> = ({ post, rank }) => {
  const {
    title,
    link,
    upvote,
    author: { name },
  } = post;

  return (
    <div css={styles.container}>
      {/* upper row */}
      <div>
        <span
          css={css`
            color: #828282;
          `}
        >
          {rank}.
        </span>
        <button css={styles.button}>
          <img src={upArrow} alt="up arrow" height="12px" width="12px" />
        </button>
        <a css={styles.title} href={link}>
          {title}
        </a>
        <span css={styles.domain}>({new URL(link).hostname})</span>
      </div>

      {/* bottom row */}
      <div>
        <span css={styles.bottom}>
          {upvote} points by {name}
        </span>
      </div>
    </div>
  );
};

export default Post;

export interface IPost {
  title: string;
  link: string;
  upvote: number;
  author: {
    name: string;
  };
}
