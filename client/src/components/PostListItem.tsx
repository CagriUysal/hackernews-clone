import React, { FunctionComponent, useContext } from "react";
import { Comment } from "@prisma/client/index";
import { css } from "@emotion/react";
import { formatDistanceToNowStrict } from "date-fns";
import { useMutation } from "@apollo/client";
import { navigate, Link } from "@reach/router";

// @ts-ignore
import upArrow from "../assets/grayarrow2x.gif";
import isLessThanOneHour from "../../../common/isLessThanOneHour";
import {
  ADD_FAVORITE,
  REMOVE_FAVORITE,
  UPVOTE_POST,
  UNVOTE_POST,
  ADD_HIDDEN,
  REMOVE_HIDDEN,
} from "../api/mutations";
import { MeContext } from "../api/meContext";

const styles = {
  container: css`
    display: flex;
    color: #000;
    font-size: 0.95rem;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  `,
  rank: (theme) => css`
    color: ${theme.colors.primary};
    width: 2rem;
    text-align: right;
    margin-right: 0.3em;
  `,
  upvote: css`
    width: 1rem;
  `,
  domain: (theme) => css`
    color: ${theme.colors.primary};
    font-size: 0.8em;
    margin-left: 0.5em;
  `,
  buttomRow: (theme) => css`
    color: ${theme.colors.primary};
    font-size: 0.7em;
  `,
  button: css`
    background: none;
    border: none;
    padding: 0;
    &:hover {
      cursor: pointer;
    }
  `,
  textButton: (theme) => css`
    font-size: inherit;
    color: ${theme.colors.primary};
    &:hover {
      text-decoration: underline;
    }
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
  link: string | null;
  domain: string | null;
  text: string | null;
  upvote: number;
  createdAt: number;
  author: {
    name: string;
  };
  comments: Comment[];
  currentUserFavorited: boolean | null;
  currentUserUpvoted: boolean | null;
  currentUserHide: boolean | null;
}

type ComponentProps = {
  post: IPost;
  rank?: number | null;
  showUpvote?: boolean;
  showComments?: boolean;
  showHide?: boolean;
  showFavorite?: boolean;
  refetch?: any;
};

const PostListItem: FunctionComponent<ComponentProps> = ({
  post,
  rank,
  showUpvote = true,
  showComments = true,
  showHide = true,
  showFavorite = true,
  refetch,
}) => {
  const {
    id,
    title,
    link,
    domain,
    upvote,
    createdAt,
    author: { name },
    comments,
    currentUserFavorited,
    currentUserUpvoted,
    currentUserHide,
  } = post;

  const { me } = useContext(MeContext);

  /** Mutations */
  const [addFavorite] = useMutation(ADD_FAVORITE, {
    variables: { postId: id },
    update: (cache, { data: { addFavorite } }) => {
      const { success, code } = addFavorite;
      if (success === false && code === "401") {
        navigate("/login", {
          state: {
            message: "Please log in.",
            redirectedFrom: `${window.location.pathname}`,
          },
        });
      } else if (success === true) {
        cache.modify({
          id: `Post:${id}`,
          fields: {
            currentUserFavorited() {
              return true;
            },
          },
        });
      }
    },
  });

  const [removeFavorite] = useMutation(REMOVE_FAVORITE, {
    variables: { postId: id },
    update(cache, { data: { removeFavorite } }) {
      const { success } = removeFavorite;
      if (success) {
        cache.modify({
          id: `Post:${id}`,
          fields: {
            currentUserFavorited() {
              return false;
            },
          },
        });
      }
    },
  });

  const [upvotePost] = useMutation(UPVOTE_POST, {
    variables: { postId: id },
    update(cache, { data: { upvotePost } }) {
      const { success, code } = upvotePost;
      if (success === false && code === "401") {
        navigate("/login", {
          state: {
            message: "You have to be logged in to vote.",
            redirectedFrom: `${window.location.pathname}`,
          },
        });
      } else if (success === true) {
        cache.modify({
          id: `Post:${id}`,
          fields: {
            currentUserUpvoted() {
              return true;
            },
            upvote(currentVote) {
              return currentVote + 1;
            },
          },
        });
      }
    },
  });

  const [unvotePost] = useMutation(UNVOTE_POST, {
    variables: { postId: id },
    update(cache, { data: { unvotePost } }) {
      const { success } = unvotePost;
      if (success === true) {
        cache.modify({
          id: `Post:${id}`,
          fields: {
            currentUserUpvoted() {
              return false;
            },
            upvote(currentVote) {
              return currentVote - 1;
            },
          },
        });
      }
    },
  });

  const [addHidden] = useMutation(ADD_HIDDEN, {
    variables: { postId: id },
    update(cache, { data: { addHidden } }) {
      const { success, code } = addHidden;
      if (success === false && code === "401") {
        navigate("/login", {
          state: {
            message: "You have to be logged in to hide.",
            redirectedFrom: `${window.location.pathname}`,
          },
        });
      } else if (success === true) {
        if (refetch !== undefined) {
          refetch(); // refetch page after this item added to hidden.
          return; // don't need to modify cache, page will be updated due to refetch
        }

        cache.modify({
          id: `Post:${id}`,
          fields: {
            currentUserHide() {
              return true;
            },
          },
        });
      }
    },
  });

  const [removeHidden] = useMutation(REMOVE_HIDDEN, {
    variables: { postId: id },
    update(cache, { data: { removeHidden } }) {
      const { success } = removeHidden;
      if (success) {
        cache.modify({
          id: `Post:${id}`,
          fields: {
            currentUserHide() {
              return false;
            },
          },
        });
      }
    },
  });

  /** Event Handlers */
  const handleFavClick = () => addFavorite();
  const handleUnfavClick = () => removeFavorite();
  const handleUpvoteClick = () => upvotePost();
  const handleUnvoteClick = () => unvotePost();
  const handleHideClick = () => addHidden();
  const handleUnhideClick = () => removeHidden();

  return (
    <div css={styles.container}>
      {rank && <div css={styles.rank}>{rank && <span>{rank}.</span>}</div>}
      {showUpvote && (
        <div css={styles.upvote}>
          {
            <button
              css={css`
                ${styles.button};
                visibility: ${currentUserUpvoted ? "hidden" : undefined};
              `}
              onClick={handleUpvoteClick}
            >
              <img src={upArrow} alt="up arrow" height="10px" width="10px" />
            </button>
          }
        </div>
      )}

      <div>
        {/* upper row */}
        <div>
          {link !== null ? (
            <>
              <a href={link}>{title}</a>
              <span css={styles.domain}>
                (
                <Link to={`/from/${domain}`} css={styles.link}>
                  {domain}
                </Link>
                )
              </span>
            </>
          ) : (
            <Link to={`/post/${id}`}>{title}</Link>
          )}
        </div>

        {/* bottom row */}
        <div css={styles.buttomRow}>
          {upvote} points by{" "}
          <Link to={`/user/${name}`} css={styles.link}>
            {name}
          </Link>{" "}
          <Link to={`/post/${id}`} css={styles.link}>
            {formatDistanceToNowStrict(createdAt, {
              addSuffix: true,
            })}
          </Link>
          {showHide && (
            <>
              {" | "}
              <button
                onClick={currentUserHide ? handleUnhideClick : handleHideClick}
                css={[styles.button, styles.textButton]}
              >
                {currentUserHide ? "un-hide" : "hide"}
              </button>
            </>
          )}
          {currentUserUpvoted && (
            <>
              {" | "}
              <button
                onClick={handleUnvoteClick}
                css={[styles.button, styles.textButton]}
              >
                unvote
              </button>
            </>
          )}
          {showFavorite && (
            <>
              {" | "}
              <button
                css={[styles.button, styles.textButton]}
                onClick={
                  currentUserFavorited ? handleUnfavClick : handleFavClick
                }
              >
                {currentUserFavorited ? "un-favorite" : "favorite"}
              </button>
            </>
          )}
          {showComments && (
            <>
              {" | "}
              <Link to={`/post/${id}`} css={styles.link}>
                {comments.length === 0
                  ? "discuss"
                  : `${comments.length} comments`}
              </Link>
            </>
          )}
          {me === name && isLessThanOneHour(createdAt) && (
            <>
              {" | "}
              <Link
                to={`/delete-confirm`}
                state={{ post, forwardedFrom: window.location.pathname }}
                css={styles.link}
              >
                delete
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostListItem;
