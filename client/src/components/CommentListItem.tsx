import React, { FunctionComponent } from "react";
import { css } from "@emotion/react";
import { Link, navigate } from "@reach/router";
import { formatDistanceToNowStrict } from "date-fns";
import { useMutation } from "@apollo/client";

import { UPVOTE_COMMENT } from "../api/mutations";

// @ts-ignore
import upArrow from "../assets/grayarrow2x.gif";

const styles = {
  container: css`
    display: flex;
    margin-top: 1rem;
  `,
  button: css`
    background: none;
    border: none;
    padding: 0;
    &:hover {
      cursor: pointer;
    }
  `,
  upvote: css`
    width: 1rem;
    // to align upvote button with upper row, can be solved differently?
    position: relative;
    top: -0.3em;
  `,
  info: (theme) => css`
    color: ${theme.colors.primary};
  `,
  link: css`
    &:hover {
      text-decoration: underline;
    }
  `,
  upperRow: css`
    font-size: 0.75em;
  `,
  bottomRow: css`
    font-size: 0.85em;
    margin-top: 0.25em;
  `,
  reply: css`
    display: inline-block;
    margin-top: 0.5rem;
    text-decoration: underline;
    font-size: 0.8em;
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
  currentUserUpvoted: boolean | null;
}

type ComponentProps = {
  comment: IComment;
  level?: number;
  extendedDisplay?: boolean;
  showReply?: boolean;
};

const CommentListItem: FunctionComponent<ComponentProps> = ({
  comment,
  level = 0,
  extendedDisplay = false,
  showReply = false,
}) => {
  const {
    id,
    message,
    createdAt,
    author: { name },
    post: { id: postId, title },
    currentUserUpvoted,
  } = comment;

  const [upvoteComment] = useMutation(UPVOTE_COMMENT, {
    variables: { commentId: id },
    update(cache, { data: { upvoteComment } }) {
      const { success, code } = upvoteComment;
      if (success === false && code === "401") {
        navigate("/login", {
          state: {
            message: "You have to be logged in to vote.",
            redirectedFrom: `${window.location.pathname}`,
          },
        });
      } else if (success === true) {
        cache.modify({
          id: `Comment:${id}`,
          fields: {
            currentUserUpvoted() {
              return true;
            },
          },
        });
      }
    },
  });

  const handleUpvoteClick = () => upvoteComment();

  return (
    <div
      css={css`
        ${styles.container}
        margin-left: ${level * 2.5}rem;
      `}
    >
      <div css={styles.upvote}>
        <button
          css={css`
            ${styles.button}
            visibility: ${currentUserUpvoted ? "hidden" : undefined};
          `}
          onClick={handleUpvoteClick}
        >
          <img src={upArrow} alt="up arrow" height="10px" width="10px" />
        </button>
      </div>

      <div>
        {/* upper row */}
        <div css={styles.upperRow}>
          <span css={styles.info}>
            <Link to={`/user/${name}`} css={styles.link}>
              {name}
            </Link>{" "}
            <Link to={`/post/${postId}/comment/${id}`} css={styles.link}>
              {formatDistanceToNowStrict(createdAt, {
                addSuffix: true,
              })}
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
          {showReply && (
            <Link to={`/post/${postId}/comment/${id}`} css={styles.reply}>
              reply
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentListItem;
