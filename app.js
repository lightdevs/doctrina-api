const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');

const app = express();

const typeDefs = gql`
type Query {
    hello: String
}
`;

const resolvers = {
    Query: {
        hello: () => "Hello"
    }
}

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({app});

app.listen({port: 5000}, () => {
    console.log(`Example app listening ${server.graphqlPath}`)
  })
