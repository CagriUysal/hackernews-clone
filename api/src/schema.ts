import { gql } from "apollo-server";

export const typeDefs = gql`
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
    createdAt: String!
    author: Author!
  }

  input AddPostInput {
    link: String!
    title: String!
    authorName: String!
  }

  type AddPostResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    post: Post!
  }

  """
  Author
  """
  type Author {
    id: ID!
    name: String!
  }

  input AddAuthorInput {
    name: String!
  }

  type AddAuthorResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    author: Author
  }

  type Query {
    posts: [Post]!
  }

  type Mutation {
    addPost(post: AddPostInput!): AddPostResponse
    addAuthor(author: AddAuthorInput!): AddAuthorResponse
  }
`;
