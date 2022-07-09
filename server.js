import { ApolloError, ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

let tweets = [
  {
    id: "1",
    text: "first one!",
    userId: "2",
  },
  {
    id: "2",
    text: "second one!",
    userId: "1",
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
    """
    Is the concatenation of firstName & lastName as a string
    """
    fullName: String!
  }
  """
  Tweet object represents a resource for a tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allMovies: [Movie!]!
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    movie(id: Int!): Movie
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Boolean!
    deleteTweet(id: ID!): Boolean!
  }
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String!]!
    summary: String
    description_full: String!
    synopsis: String!
    yt_trailer_code: String!
    language: String!
    mpa_rating: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
    state: String!
    date_uploaded: String!
    date_uploaded_unix: Int!
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
      //console.log("allUsers called");
      return users;
    },
    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then((response) => response.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((response) => response.json())
        .then((json) => json.data.movie);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const user = users.find((user) => user.id === userId);
      if (!user) return false;
      const newTweet = {
        id: tweets.length + 1,
        text: text,
        userId: userId,
      };
      tweets.push(newTweet);
      return true;
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
    // 해당 DB 필드에 값(not null)이 있어도
    // 해당 필드 resolver 함수 리턴 값으로 대체
    firstName() {
      console.log("firstName called");
      return "DB value intercepted";
      //return null; // Non Nullable 필드이므로 에러 발생
    },
    // 해당 DB 필드가 null이어서 관련 에러 발생할 경우,
    // null 아닌 값을 해당 필드 resolver가 반환하여 에러 방지
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
  // author resolver의 argument(인수)는
  // tweets의 객체들
  // tweets는 author resolver를 호출하는
  // allTweets resolver에서 전달?
  Tweet: {
    author({ userId }) {
      // 여기서 리턴된 객체(User 타입)가
      // fullName 리졸버의 첫째 인수(root)로 전달?
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
