import React, { FunctionComponent, useState } from "react";
import { css, useTheme } from "@emotion/react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Redirect, RouteComponentProps } from "@reach/router";

import Header from "../components/Header";
import PostListItem from "../components/PostListItem";
import CommentList from "../components/CommentList";
import validateComment from "../utils/validateComment";

const styles = {
  container: (theme) => css`
    background-color: ${theme.colors.bg};
  `,
  commentInput: css`
    width: 40em;
    margin-left: 2.5em;
    margin-top: 0.5em;
  `,
  button: css`
    display: block;
    margin-left: 2.5em;
    margin-top: 1em;
    margin-bottom: 3em;
  `,
  errorMessage: (theme) => css`
    color: ${theme.colors.primary};
    padding: 1em;
  `,
};

const POST = gql`
  query Post($id: Int!) {
    post(id: $id) {
      id
      title
      link
      domain
      upvote
      createdAt
      author {
        name
      }
      comments {
        id
      }
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($comment: AddCommentInput!) {
    addComment(comment: $comment) {
      code
      success
      message
      comment {
        message
      }
    }
  }
`;

const POST_COMMENTS = gql`
  query PostComments($postId: Int!) {
    postComments(postId: $postId) {
      id
      message
      createdAt
      parent {
        id
      }
      author {
        name
      }
      post {
        id
        title
      }
    }
  }
`;

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
  });
  const { data: postCommentsData } = useQuery(POST_COMMENTS, {
    variables: { postId: Number(postId) },
  });
  const [addComment, { data: addCommentData }] = useMutation(ADD_COMMENT);

  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const handleAddComment = (comment: IAddCommentInput) => {
    try {
      validateComment(comment.message);
    } catch {
      setErrorMessage("Please try again.");
      return;
    }

    addComment({ variables: { comment } });
  };

  if (addCommentData) {
    const { success, code } = addCommentData.addComment;
    if (success === false && code === "401") {
      return (
        <Redirect
          to="/login"
          noThrow
          state={{ message: "You have to be logged in to comment." }}
        />
      );
    } else if (success === true) {
      if (errorMessage !== null) setErrorMessage(null);
    }
  }

  if (data && data.post) {
    return (
      <div css={theme.layout}>
        <Header />
        <div css={styles.container}>
          {errorMessage && <p css={styles.errorMessage}>{errorMessage}</p>}

          <PostListItem post={data.post} rank={null} />

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
