import { gql } from "@apollo/client";

export const ME = gql`
  query Me {
    me {
      id
      name
    }
  }
`;

export const COMMENT = gql`
  query Comment($id: Int!) {
    comment(id: $id) {
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
      currentUserUpvoted
      currentUserFavorited
    }
  }
`;

export const POST_COMMENTS = gql`
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
      currentUserUpvoted
    }
  }
`;

export const COMMENTS = gql`
  query Comments {
    comments {
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
      currentUserUpvoted
    }
  }
`;

export const FAVORITE_POSTS = gql`
  query FavoritePosts($name: String!) {
    favoritePosts(name: $name) {
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
      currentUserFavorited
      currentUserUpvoted
    }
  }
`;

export const DOMAIN_POSTS = gql`
  query DomainPosts($domain: String!) {
    domainPosts(domain: $domain) {
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
      currentUserUpvoted
      currentUserFavorited
      currentUserHide
    }
  }
`;

export const HIDDEN_POSTS = gql`
  query HiddenPosts($name: String!) {
    hiddenPosts(name: $name) {
      code
      success
      message
      hidden {
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
        currentUserFavorited
        currentUserUpvoted
        currentUserHide
      }
    }
  }
`;

export const LATEST_POSTS = gql`
  query latestPosts {
    latestPosts {
      id
      title
      link
      domain
      upvote
      createdAt
      author {
        id
        name
      }
      comments {
        id
      }
      currentUserFavorited
      currentUserUpvoted
      currentUserHide
    }
  }
`;

export const PAST_POSTS = gql`
  query PastPosts($input: pastPostsInput!) {
    pastPosts(input: $input) {
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
      currentUserFavorited
      currentUserUpvoted
    }
  }
`;

export const POST = gql`
  query Post($id: Int!) {
    post(id: $id) {
      id
      title
      link
      domain
      text
      upvote
      createdAt
      author {
        name
      }
      comments {
        id
      }
      currentUserFavorited
      currentUserUpvoted
      currentUserHide
    }
  }
`;

export const USER_POSTS = gql`
  query UserPosts($name: String!) {
    userPosts(name: $name) {
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
      currentUserFavorited
      currentUserUpvoted
    }
  }
`;

export const UPVOTED_POSTS = gql`
  query UpvotedPosts($name: String!) {
    upvotedPosts(name: $name) {
      code
      success
      message
      upvotes {
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
        currentUserFavorited
        currentUserUpvoted
      }
    }
  }
`;

export const USER = gql`
  query User($name: String!) {
    user(name: $name) {
      __typename
      id
      name
      about
      createdAt
      karma
      ... on PrivateUser {
        email
      }
    }
  }
`;

export const USER_COMMENTS = gql`
  query UserComments($name: String!) {
    userComments(name: $name) {
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
      currentUserUpvoted
    }
  }
`;
