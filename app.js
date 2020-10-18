import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';



const startServer = async () => {
    const app = express();

    const server = new ApolloServer({ typeDefs, resolvers});
    server.applyMiddleware({app});
    
    await mongoose.connect('mongodb+srv://doctrina:doctrina@doctrina.zodyy.mongodb.net/doctrina?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

    app.listen({port: 5000}, () => {
        console.log(`App listening ${server.graphqlPath}`)
    })
}

startServer();