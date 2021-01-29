import React, { FunctionComponent } from "react";
import {Comment} from '@prisma/client/index'

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { css, useTheme } from "@emotion/react";

// @ts-ignore
import upArrow from "../assets/grayarrow2x.gif";
import { Link } from "@reach/router";


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
  domain: (theme) => css`
    color: ${theme.colors.primary};
    font-size: 0.7em;
    margin-left: 0.5em;
  `,
  link: css`
    &:hover {
      text-decoration: underline;
    }
  `,
};

export interface IPost {
  id: number;
  title: string;
  link: string;
  upvote: number;
  createdAt: number;
  author: {
    name: string;
  };
  comments: Comment[]
  };
}

type ComponentProps = {
  post: IPost;
  rank: number | null;
};

const PostListItem: FunctionComponent<ComponentProps> = ({ post, rank }) => {
  const theme = useTheme();

  const {
    id,
    title,
    link,
    upvote,
    createdAt,
    author: { name },
    comments,
  } = post;

  const timeAgo = new TimeAgo("en-US");

  return (
    <div css={styles.container}>
      {/* upper row */}
      <div>
        {rank && (
          <span
            css={css`
              color: ${theme.colors.primary};
            `}
          >
            {rank}.
          </span>
        )}
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
        <span
          css={(theme) => css`
            color: ${theme.colors.primary};
            font-size: 0.7em;
            margin-left: ${rank ? "4em" : "2.5em"};
          `}
        >
          {upvote} points by{" "}
          <Link to={`/user/${name}`} css={styles.link}>
            {name}
          </Link>{" "}
          <Link to={`/post/${id}`} css={styles.link}>
            {timeAgo.format(createdAt)}
          </Link>
          {" | "}
          <Link to={`post/${id}`} css={styles.link}>
            {`${comments.length} comments`}
          </Link>
        </span>
      </div>
    </div>
  );
};

export default PostListItem;