import { gql } from "@apollo/client";

export const CHANGE_PW = gql`
  mutation ChangePw($input: ChangePwInput!) {
    changePw(input: $input) {
      success
      message
      code
    }
  }
`;

export const LOG_OUT = gql`
  mutation Logout {
    logout
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($comment: AddCommentInput!) {
    addComment(comment: $comment) {
      code
      success
      message
      comment {
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
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($postId: Int!) {
    deletePost(postId: $postId) {
      code
      success
      message
    }
  }
`;

export const REGISTER = gql`
  mutation Register($user: RegisterInput!) {
    register(user: $user) {
      code
      success
      message
    }
  }
`;

export const LOGIN = gql`
  mutation Login($user: LoginInput!) {
    login(user: $user) {
      code
      success
      message
      accessToken
    }
  }
`;

export const ADD_POST = gql`
  mutation AddPost($post: AddPostInput!) {
    addPost(post: $post) {
      code
      success
      message
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      code
      success
      message
      user {
        about
        email
      }
    }
  }
`;

export const ADD_FAVORITE = gql`
  mutation AddFavorite($postId: Int!) {
    addFavorite(postId: $postId) {
      code
      success
      message
    }
  }
`;

export const REMOVE_FAVORITE = gql`
  mutation RemoveFavorite($postId: Int!) {
    removeFavorite(postId: $postId) {
      code
      success
      message
    }
  }
`;

export const UPVOTE_POST = gql`
  mutation upvotePost($postId: Int!) {
    upvotePost(postId: $postId) {
      code
      success
      message
    }
  }
`;

export const UNVOTE_POST = gql`
  mutation UnvotePost($postId: Int!) {
    unvotePost(postId: $postId) {
      code
      success
      message
    }
  }
`;

export const ADD_HIDDEN = gql`
  mutation AddHidden($postId: Int!) {
    addHidden(postId: $postId) {
      success
      message
      code
    }
  }
`;

export const REMOVE_HIDDEN = gql`
  mutation RemoveHidden($postId: Int!) {
    removeHidden(postId: $postId) {
      success
      message
      code
    }
  }
`;

export const UPVOTE_COMMENT = gql`
  mutation UpvoteComment($commentId: Int!) {
    upvoteComment(commentId: $commentId) {
      code
      success
      message
    }
  }
`;

export const UNVOTE_COMMENT = gql`
  mutation UnvoteComment($commentId: Int!) {
    unvoteComment(commentId: $commentId) {
      code
      success
      message
    }
  }
`;

export const ADD_FAVORITE_COMMENT = gql`
  mutation AddFavoriteComment($commentId: Int!) {
    addFavoriteComment(commentId: $commentId) {
      code
      success
      message
    }
  }
`;
