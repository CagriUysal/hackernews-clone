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
    id: ID!
    link: String!
    title: String!
    upvote: Int!
    createdAt: Float!
    author: User!
  }

  input AddPostInput {
    link: String!
    title: String!
    userName: String!
  }

  type AddPostResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    post: Post!
  }

  """
  User
  """
  type User {
    id: ID!
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
  type ByeResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
  }

  type Query {
    posts: [Post]!
    bye: ByeResponse!
  }

  """
  Mutations
  """
  type Mutation {
    addPost(post: AddPostInput!): AddPostResponse
    register(user: RegisterInput!): RegisterResponse
    login(user: LoginInput!): LoginResponse
  }
`;
