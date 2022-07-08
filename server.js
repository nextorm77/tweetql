import { ApolloError, ApolloServer, gql } from "apollo-server";

// 사용자가 뭔가를 request하게 하려면 type Query안에 있어야 함
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String
  }
  type Tweet {
    id: ID!
    text: String!
    author: User!
  }
  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;
// GET /api/v1/tweets
// GET /api/v1/tweet/:id
// Mutation 안에 => url을 노출시키고  POST HTTP 메소드로 관리하는 것과 유사
// Query 안에 => REST API의 세상에서 GET HTTP 메소드로 url을 만들고 노출하는 것과 유사

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
