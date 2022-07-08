import { ApolloError, ApolloServer, gql } from "apollo-server";

let tweets = [
  {
    id: "1",
    text: "first one!",
  },
  {
    id: "2",
    text: "second one!",
  },
];

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
    author: User
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

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    // tweet(_, args) : _는 해당 인수를 무시한다는 의미
    tweet(root, { id }) {
      // tweets.push(); // Query와 Mutation 영역은 개념적으로 나뉜 것 뿐. 수정 코드가 있어도 오류X
      return tweets.find((tweet) => tweet.id === id);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text: text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
