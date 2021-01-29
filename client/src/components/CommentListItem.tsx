import React, { FunctionComponent } from "react";
import TimeAgo from "javascript-time-ago";
// import en from "javascript-time-ago/locale/en";
import { css } from "@emotion/react";

// @ts-ignore
import upArrow from "../assets/grayarrow2x.gif";
import { Link } from "@reach/router";

const styles = {
  container: css`
    padding: 0.5em;
    font-size: 0.8em;
  `,
  button: css`
    background: none;
    border: none;
    &:hover {
      cursor: pointer;
    }
  `,
  info: (theme) => css`
    color: ${theme.colors.primary};
  `,
  link: css`
    &:hover {
      text-decoration: underline;
    }
  `,
  bottomRow: css`
    margin-top: 0.5em;
    margin-left: 2em;
  `,
};

export interface IComment {
  id: number;
  message: string;
  createdAt: number;
  author: {
    name: string;
  };
}

interface IComponentProps {
  comment: IComment;
}

const CommentListItem: FunctionComponent<IComponentProps> = ({ comment }) => {
  const timeAgo = new TimeAgo("en-US");

  return (
    <div css={styles.container}>
      {/* upper row */}
      <div>
        <button css={styles.button}>
          <img src={upArrow} alt="up arrow" height="12px" width="12px" />
        </button>
        <span css={styles.info}>
          <Link to={`/user/${comment.author.name}`} css={styles.link}>
            {comment.author.name}
          </Link>{" "}
          <Link to={`/comment/${comment.id}`} css={styles.link}>
            {timeAgo.format(comment.createdAt)}
          </Link>
        </span>
      </div>

      {/* buttom row  */}
      <div css={styles.bottomRow}>
        <p>{comment.message}</p>
      </div>
    </div>
  );
};

export default CommentListItem;
