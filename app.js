import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import config from'./config';
import utils from './utils';



const startServer = async () => {
    const app = express();

    const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => {
        const token = req.headers.authorization || '';
        const { payload: user, loggedIn } = utils.getPayload(token);
        return { user, loggedIn };
      }});

    server.applyMiddleware({app});
    
    await mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true});

    app.listen({port: 5000}, () => {
        console.log(`App listening ${server.graphqlPath}`)
    })
}

startServer();