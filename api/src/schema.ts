import { gql } from "apollo-server";

export const typeDefs = gql`
  """
  Interfaces
  """
  interface MutationResponse {
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

  type AddPostResponse implements MutationResponse {
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

  type RegisterResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    user: User
  }

  """
  Queries
  """
  type Query {
    posts: [Post]!
  }

  """
  Mutations
  """
  type Mutation {
    addPost(post: AddPostInput!): AddPostResponse
    register(user: RegisterInput!): RegisterResponse
  }
`;
