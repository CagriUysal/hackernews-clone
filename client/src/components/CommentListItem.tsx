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
  parent: {
    id: number;
  } | null;
  post: {
    id: number;
    title: string;
  };
}

type ComponentProps = {
  comment: IComment;
  level?: number;
  extendedDisplay?: boolean;
};

const CommentListItem: FunctionComponent<ComponentProps> = ({
  comment,
  level = 0,
  extendedDisplay = false,
}) => {
  const timeAgo = new TimeAgo("en-US");

  const {
    id,
    message,
    createdAt,
    author: { name },
    post: { id: postId, title },
    // parent: { id: parentId }, // parent can be null, so can't destruct its id!
  } = comment;

  return (
    <div
      css={css`
        ${styles.container}
        margin-left: ${level * 3}em;
      `}
    >
      {/* upper row */}
      <div>
        <button css={styles.button}>
          <img src={upArrow} alt="up arrow" height="12px" width="12px" />
        </button>
        <span css={styles.info}>
          <Link to={`/user/${name}`} css={styles.link}>
            {name}
          </Link>{" "}
          <Link to={`/post/${postId}/comment/${id}`} css={styles.link}>
            {timeAgo.format(createdAt)}
          </Link>
          {extendedDisplay &&
            (comment.parent !== null ? (
              <>
                {" | "}
                <Link
                  to={`/post/${postId}/comment/${comment.parent.id}`}
                  css={styles.link}
                >
                  parent
                </Link>
              </>
            ) : (
              <>
                {" | "}
                <Link to={`/post/${postId}`} css={styles.link}>
                  parent
                </Link>
              </>
            ))}
          {extendedDisplay && (
            <>
              {" | on "}
              <Link to={`/post/${postId}`} css={styles.link}>
                {title}
              </Link>
            </>
          )}
        </span>
      </div>

      {/* buttom row  */}
      <div css={styles.bottomRow}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default CommentListItem;
