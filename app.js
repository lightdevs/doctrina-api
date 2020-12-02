const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const config = require('./config');
const utils = require('./utils');
const morgan = require('morgan');
const mongoose = require('mongoose');
var cors = require('cors')

var whitelist = ['http://127.0.0.1:4200', 'http://127.0.0.1:4000'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
}

const startServer = async () => {
  const app = express();
  app.use(cors());

  app.use(morgan("tiny"));

  app.use(function (_, __, next) {
    console.log('\x1b[33m%s\x1b[0m', "--------------------------");
    next();
  });

  app.use((req, res, next) => {
    //console.log(req.headers);
    next();
  });

  app.use('/download', require('./download.js').router);

  await mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.set('useFindAndModify', false);

  const server = new ApolloServer({
    typeDefs, resolvers, context: ({ req, res }) => {
      const token = req.headers.authorization || '';
      const { payload, loggedIn } = utils.getPayload(token);
      return { payload, loggedIn };
    }
  });

  server.applyMiddleware({ app });

  app.listen({ port: config.PORT }, () => {
    console.log(`API runs at http://localhost:${config.PORT}${server.graphqlPath}`)
  })
}

startServer();
