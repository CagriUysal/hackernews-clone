import { gql } from "apollo-server";

export const typeDefs = gql`
  """
  Interfaces
  """
  interface Response {
    code: String!
    success: Boolean!
    message: String!
  }

  """
  Post
  """
  type Post {
    id: Int!
    link: String!
    domain: String!
    title: String!
    upvote: Int!
    createdAt: Float!
    author: User!
    comments: [Comment]
  }

  input AddPostInput {
    link: String!
    title: String!
  }

  type AddPostResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    post: Post
  }

  """
  Comment
  """
  type Comment {
    id: Int!
    message: String!
    upvotes: Int!
    createdAt: Float!
    post: Post!
    author: User!
    parent: Comment
  }

  input AddCommentInput {
    message: String!
    postId: Int!
    parentId: Int
  }

  type AddCommentResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    comment: Comment
  }

  """
  User
  """
  type User {
    id: Int!
    name: String!
  }

  input RegisterInput {
    name: String!
    password: String!
  }

  type RegisterResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    user: User
  }

  input LoginInput {
    name: String!
    password: String!
  }

  type LoginResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    accessToken: String
  }

  """
  Queries
  """
  type Query {
    posts: [Post!]!
    post(id: Int!): Post
    domainPosts(domain: String!): [Post!]!
    latestPosts: [Post!]!
    postComments(postId: Int!): [Comment!]!
    comments: [Comment!]!
    comment(id: Int!): Comment
    me: User
  }

  """
  Mutations
  """
  type Mutation {
    addPost(post: AddPostInput!): AddPostResponse
    addComment(comment: AddCommentInput!): AddCommentResponse
    register(user: RegisterInput!): RegisterResponse
    login(user: LoginInput!): LoginResponse
    logout: Boolean
  }
`;
