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
  }

  """
  Post
  """
  type Post {
    id: Int!
    title: String!
    link: String
    domain: String
    text: String
    upvote: Int!
    createdAt: Float!
    author: PublicUser!
    comments: [Comment!]
    currentUserFavorited: Boolean
    currentUserUpvoted: Boolean
    currentUserHide: Boolean
  }

  type upvotedPostsResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    upvotes: [Post!]
  }

  type hiddenPostsResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    hidden: [Post!]
  }

  input AddPostInput {
    link: String!
    title: String!
    text: String!
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
    currentUserUpvoted: Boolean
    currentUserFavorited: Boolean
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

  type upvotedCommentResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
    upvotes: [Comment!]
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

    email: String
  }

  type PublicUser implements User {
    id: Int!
    name: String!
    about: String!
    createdAt: Float!
    karma: Int!
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
    """
    Post
    """
    post(id: Int!): Post
    domainPosts(domain: String!): [Post!]!
    latestPosts: [Post!]!
    pastPosts(input: pastPostsInput!): [Post!]!
    userPosts(name: String!): [Post!]
    favoritePosts(name: String!): [Post!]
    upvotedPosts(name: String!): upvotedPostsResponse!
    hiddenPosts(name: String!): hiddenPostsResponse!

    """
    Comment
    """
    comments: [Comment!]!
    comment(id: Int!): Comment
    postComments(postId: Int!): [Comment!]!
    userComments(name: String!): [Comment!]
    upvotedComments(name: String!): upvotedCommentResponse!

    """
    User
    """
    user(name: String!): User
    me: PrivateUser
  }

  """
  Mutations
  """
  type Mutation {
    """
    Post
    """
    addPost(post: AddPostInput!): MutationResponse!
    deletePost(postId: Int!): MutationResponse!
    addFavorite(postId: Int!): MutationResponse!
    removeFavorite(postId: Int!): MutationResponse!
    upvotePost(postId: Int!): MutationResponse!
    unvotePost(postId: Int!): MutationResponse!
    addHidden(postId: Int!): MutationResponse!
    removeHidden(postId: Int!): MutationResponse!

    """
    Comments
    """
    addComment(comment: AddCommentInput!): AddCommentResponse!
    upvoteComment(commentId: Int!): MutationResponse!
    unvoteComment(commentId: Int!): MutationResponse!
    addFavoriteComment(commentId: Int!): MutationResponse!
    removeFavoriteComment(commentId: Int!): MutationResponse!

    """
    User
    """
    updateUser(input: UpdateUserInput!): UpdateUserResponse!
    changePw(input: ChangePwInput!): MutationResponse!

    """
    Authentication
    """
    register(user: RegisterInput!): MutationResponse!
    login(user: LoginInput!): LoginResponse!
    logout: Boolean!
  }

  type MutationResponse implements Response {
    code: String!
    success: Boolean!
    message: String!
  }
`;
