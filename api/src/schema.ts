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

  interface User {
    id: Int!
    name: String!
    about: String!
    createdAt: Float!
    karma: Int!
    posts: [Post!]!
    comments: [Comment!]!
    favorites: [Post!]!
  }

  """
  Response
  """
  type MutationResponse {
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
    comments: [Comment!]
    currentUserFavorited: Boolean
    currentUserUpvoted: Boolean
  }

  input AddPostInput {
    link: String!
    title: String!
  }

  type AddFavoriteResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
  }

  type RemoveFavoriteResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
  }

  type UpvotePostResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    post: Post
  }

  type UnvotePostResponse implements Response {
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
  type PrivateUser implements User {
    id: Int!
    name: String!
    about: String!
    createdAt: Float!
    karma: Int!
    posts: [Post!]!
    comments: [Comment!]!
    favorites: [Post!]!

    email: String
    hidden: [Post!]!
    upvotedPosts: [Post!]!
  }

  type PublicUser implements User {
    id: Int!
    name: String!
    about: String!
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

  input UpdateUserInput {
    about: String!
    email: String!
  }

  type UpdateUserResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    user: PrivateUser
  }

  input ChangePwInput {
    currentPw: String!
    newPw: String!
  }

  type ChangePwResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
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
    favoritePosts(name: String!): [Post!]
    postComments(postId: Int!): [Comment!]!
    comments: [Comment!]!
    comment(id: Int!): Comment
    userComments(name: String!): [Comment!]
    user(name: String!): User
    me: PrivateUser
  }

  """
  Mutations
  """
  type Mutation {
    addPost(post: AddPostInput!): MutationResponse
    addComment(comment: AddCommentInput!): AddCommentResponse
    addFavorite(postId: Int!): AddFavoriteResponse
    removeFavorite(postId: Int!): RemoveFavoriteResponse
    upvotePost(postId: Int!): UpvotePostResponse
    unvotePost(postId: Int!): UnvotePostResponse
    register(user: RegisterInput!): RegisterResponse
    updateUser(input: UpdateUserInput!): UpdateUserResponse
    changePw(input: ChangePwInput!): ChangePwResponse
    login(user: LoginInput!): LoginResponse
    logout: Boolean
  }
`;
