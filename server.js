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

let users = [
  {
    id: "1",
    firstName: "snoo",
    lastName: "son",
  },
  {
    id: "2",
    firstName: "Nancy",
    lastName: "son",
  },
];

// 사용자가 뭔가를 request하게 하려면 type Query안에 있어야 함
const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allUsers: [User!]!
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
    allUsers() {
      console.log("allUsers called");
      return users;
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
  /*
  User: {
    // 해당 DB 필드가 null이 아닌 값이 있어도
    // 리턴 값으로 대체
    firstName() {
      console.log("firstName called");
      return "DB value intercepted";
      //return null; // Non Nullable 필드이므로 에러 발생
    },
    // 해당 DB 필드가 null이어서 관련 에러 발생할 경우,
    //  null 아닌 값을 반환하여 에러 방지
    fullName(root) {
      console.log("fullName called!");
      console.log(root);
      return "hello!";
    },
  },
  */
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
