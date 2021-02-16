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
    author: PublicUser!
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

  input pastPostsInput {
    start: String!
    end: String!
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
    author: PublicUser!
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
  type PrivateUser {
    id: Int!
    name: String!
  }

  type PublicUser {
    name: String!
    createdAt: Float!
    karma: Int!
    posts: [Post!]!
    comments: [Comment!]!
    favorites: [Post!]!
  }

  input RegisterInput {
    name: String!
    password: String!
  }

  type RegisterResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    user: PublicUser
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
    pastPosts(input: pastPostsInput!): [Post!]!
    userPosts(name: String!): [Post!]
    postComments(postId: Int!): [Comment!]!
    comments: [Comment!]!
    comment(id: Int!): Comment
    userComments(name: String!): [Comment!]
    user(name: String!): PublicUser
    me: PrivateUser
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
