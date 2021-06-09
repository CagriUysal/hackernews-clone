import React, { FunctionComponent, useState } from "react";
import { css, useTheme } from "@emotion/react";
import { useQuery, useMutation } from "@apollo/client";
import { navigate, RouteComponentProps } from "@reach/router";

import Header from "../components/Header";
import PostListItem from "../components/PostListItem";
import CommentList from "../components/CommentList";
import validateComment from "../utils/validateComment";
import { POST, POST_COMMENTS } from "../api/queries";
import { ADD_COMMENT } from "../api/mutations";

const styles = {
  container: (theme) => css`
    background-color: ${theme.colors.bg};
    padding-bottom: 2em;
    margin-left: 1em;
  `,
  commentInput: css`
    width: 40em;
    margin-top: 0.5em;
    margin-left: 1rem;
  `,
  button: css`
    display: block;
    margin-top: 1em;
    margin-bottom: 3em;
    margin-left: 1rem;
  `,
  errorMessage: (theme) => css`
    color: ${theme.colors.primary};
    margin-left: 1.5em;
    margin-top: 1em;
  `,
  text: (theme) => css`
    font-size: 0.95rem;
    color: ${theme.colors.primary};
    margin-left: 1.5em;
    margin-top: 1em;
    margin-bottom: 1em;
    a {
      color: #000;
    }
  `,
};

interface IAddCommentInput {
  message: string;
  postId: number;
  parentId: number | null;
}

interface ComponentProps extends RouteComponentProps {
  postId?: string;
}

const Post: FunctionComponent<ComponentProps> = ({ postId }) => {
  const theme = useTheme();

  const { data } = useQuery(POST, {
    variables: { id: Number(postId) },
    fetchPolicy: "network-only",
  });

  const { data: postCommentsData } = useQuery(POST_COMMENTS, {
    variables: { postId: Number(postId) },
  });

  const [addComment] = useMutation(ADD_COMMENT, {
    update(cache, { data: { addComment } }) {
      const { comment, success, code } = addComment;

      if (success === false && code === "401") {
        navigate("/login", {
          state: {
            message: "You have to be logged in to comment.",
            redirectedFrom: `/post/${postId}`,
          },
        });
      } else if (success === true) {
        const { postComments } = cache.readQuery({
          query: POST_COMMENTS,
          variables: { postId: Number(postId) },
        });

        cache.writeQuery({
          query: POST_COMMENTS,
          variables: { postId: Number(postId) },
          data: {
            postComments: [...postComments, comment],
          },
        });

        if (errorMessage !== null) setErrorMessage(null);
        setComment("");
      }
    },
  });

  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const handleAddComment = (comment: IAddCommentInput) => {
    try {
      validateComment(comment.message);
      addComment({ variables: { comment } });
    } catch {
      setErrorMessage("Please try again.");
    }
  };

  if (data?.post) {
    const { text } = data.post;

    return (
      <div css={theme.layout}>
        <Header />
        <div css={styles.container}>
          {errorMessage && <p css={styles.errorMessage}>{errorMessage}</p>}

          <PostListItem post={data.post} rank={null} />

          {text !== null && <div css={styles.text}>{text}</div>}

          <textarea
            name="text"
            id="text"
            css={styles.commentInput}
            rows={6}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />

          <button
            css={styles.button}
            onClick={() =>
              handleAddComment({
                message: comment,
                postId: Number(postId),
                parentId: null,
              })
            }
          >
            add comment
          </button>

          {postCommentsData && (
            <CommentList
              comments={postCommentsData.postComments}
              nest
              showReply
            />
          )}
        </div>
      </div>
    );
  } else if (data && data.post === null) {
    return <p>No such item.</p>;
  }

  return null;
};

export default Post;
