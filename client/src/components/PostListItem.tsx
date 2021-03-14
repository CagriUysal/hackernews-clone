import React, { FunctionComponent, useState, useEffect } from "react";
import { Comment } from "@prisma/client/index";
import { css } from "@emotion/react";
import { formatDistanceToNowStrict } from "date-fns";
import { gql, useMutation, useQuery } from "@apollo/client";
import { navigate, Link } from "@reach/router";

// @ts-ignore
import upArrow from "../assets/grayarrow2x.gif";
import isLessThanOneHour from "../utils/isLessThanOneHour";
import { ME } from "../api/queries";
import {
  ADD_FAVORITE,
  REMOVE_FAVORITE,
  UPVOTE_POST,
  UNVOTE_POST,
  ADD_HIDDEN,
  REMOVE_HIDDEN,
} from "../api/mutations";

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
    width: 2em;
    text-align: right;
    margin-right: 0.3em;
  `,
  upvote: css`
    margin-right: 0.3em;
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
  link: string;
  domain: string;
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
};

const PostListItem: FunctionComponent<ComponentProps> = ({
  post,
  rank,
  showUpvote = true,
  showComments = true,
}) => {
  const {
    id,
    title,
    link,
    domain,
    upvote: initialUpvote,
    createdAt,
    author: { name },
    comments,
    currentUserFavorited,
    currentUserUpvoted,
    currentUserHide,
  } = post;

  const [isFavorited, setIsFavorited] = useState<null | boolean>(
    currentUserFavorited
  );
  const [isUpvoted, setIsUpvoted] = useState<null | boolean>(
    currentUserUpvoted
  );
  const [isHidden, setIsHidden] = useState<null | boolean>(currentUserHide);
  const [upvote, setUpvote] = useState(initialUpvote);

  const { data: meData } = useQuery(ME);
  const [addFavorite, { data: addFavoriteData }] = useMutation(ADD_FAVORITE, {
    variables: { postId: id },
  });
  const [removeFavorite, { data: removeFavoriteData }] = useMutation(
    REMOVE_FAVORITE,
    {
      variables: { postId: id },
    }
  );
  const [upvotePost, { data: upvotePostData }] = useMutation(UPVOTE_POST, {
    variables: { postId: id },
  });
  const [unvotePost, { data: unvotePostData }] = useMutation(UNVOTE_POST, {
    variables: { postId: id },
  });
  const [addHidden, { data: addHiddenData }] = useMutation(ADD_HIDDEN, {
    variables: { postId: id },
  });
  const [removeHidden, { data: removeHiddenData }] = useMutation(
    REMOVE_HIDDEN,
    {
      variables: { postId: id },
    }
  );

  const handleFavClick = () => {
    if (isFavorited === true) {
      removeFavorite();
    } else if (isFavorited === false) {
      addFavorite();
    }
  };

  const handleUpvoteClick = () => {
    upvotePost();
  };

  const handleUnvoteClick = () => {
    unvotePost();
  };

  const handleHideClick = () => {
    addHidden();
  };

  const handleUnhideClick = () => {
    removeHidden();
  };

  useEffect(() => {
    if (upvotePostData) {
      const { success, code } = upvotePostData.upvotePost;
      if (success === false && code === "401") {
        navigate("/login", {
          state: {
            message: "You have to be logged in to vote.",
            redirectedFrom: `${window.location.pathname}`,
          },
        });
      } else if (success === true) {
        setIsUpvoted(true);
        setUpvote(upvote + 1); // show upvote effect to the user
      }
    }
  }, [upvotePostData]);

  useEffect(() => {
    if (unvotePostData) {
      const { success } = unvotePostData.unvotePost;
      if (success === true) {
        setIsUpvoted(false);
        setUpvote(upvote - 1);
      }
    }
  }, [unvotePostData]);

  useEffect(() => {
    if (addFavoriteData) {
      const { success, code } = addFavoriteData.addFavorite;
      if (success === false && code === "401") {
        navigate("/login", {
          state: {
            message: "Please log in.",
            redirectedFrom: `/post/${id}`,
          },
        });
      } else if (success === true) {
        setIsFavorited(true);
      }
    }
  }, [addFavoriteData]);

  useEffect(() => {
    if (removeFavoriteData) {
      const { success } = removeFavoriteData.removeFavorite;
      if (success === true) {
        setIsFavorited(false);
      }
    }
  }, [removeFavoriteData]);

  useEffect(() => {
    if (addHiddenData) {
      const { success, code } = addHiddenData.addHidden;
      if (success === false && code === "401") {
        navigate("/login", {
          state: {
            message: "You have to be logged in to hide.",
            redirectedFrom: `${window.location.pathname}`,
          },
        });
      } else if (success === true) {
        setIsHidden(true);
      }
    }
  }, [addHiddenData]);

  useEffect(() => {
    if (removeHiddenData) {
      const { success } = removeHiddenData.removeHidden;
      if (success === true) {
        setIsHidden(false);
      }
    }
  }, [removeHiddenData]);

  return (
    <div css={styles.container}>
      <div css={styles.rank}>{rank && <span>{rank}.</span>}</div>
      {showUpvote && (
        <div css={styles.upvote}>
          {
            <button
              css={css`
                ${styles.button};
                visibility: ${isUpvoted ? "hidden" : undefined};
              `}
              onClick={handleUpvoteClick}
            >
              <img src={upArrow} alt="up arrow" height="12px" width="12px" />
            </button>
          }
        </div>
      )}

      <div>
        {/* upper row */}
        <div>
          <a href={link}>{title}</a>
          <span css={styles.domain}>
            (
            <Link to={`/from/${domain}`} css={styles.link}>
              {domain}
            </Link>
            )
          </span>
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
          {
            <>
              {" | "}
              <button
                onClick={isHidden ? handleUnhideClick : handleHideClick}
                css={[styles.button, styles.textButton]}
              >
                {isHidden ? "un-hide" : "hide"}
              </button>
            </>
          }
          {isUpvoted && (
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
          {currentUserFavorited !== null && (
            <>
              {" | "}
              <button
                css={[styles.button, styles.textButton]}
                onClick={handleFavClick}
              >
                {isFavorited ? "un-favorite" : "favorite"}
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
          {meData?.me?.name === name && isLessThanOneHour(createdAt) && (
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
