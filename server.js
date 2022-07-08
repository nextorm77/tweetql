import { ApolloError, ApolloServer, gql } from "apollo-server";

// 사용자가 뭔가를 request하게 하려면 type Query안에 있어야 함
const typeDefs = gql`
  type Query {
    text: String
    hello: String
  }
`;

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
