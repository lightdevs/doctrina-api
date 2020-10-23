const {ApolloServer} = require('apollo-server-express');
const express = require('express');
const mongoose = require('mongoose');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const config = require('./config');
const utils = require('./utils');



const startServer = async () => {
    const app = express();

    const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => {
        const token = req.headers.authorization || '';
        const { payload, loggedIn } = utils.getPayload(token);
        return { payload, loggedIn };
      }});

    server.applyMiddleware({app});
    
    await mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true});

    app.listen({port: config.PORT}, () => {
        console.log(`App listening at http://localhost:${config.PORT}${server.graphqlPath}`)
    })
}

startServer();