const express = require('express');
const logger = require('morgan');
const graphqlHTTP = require('express-graphql');

const authMiddleware = require('./middlewares/authMiddleware');

const graphiqlSchema = require('./graphql/schema');
const graphiqlResolver = require('./graphql/resolvers');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(authMiddleware);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphiqlSchema,
    rootValue: graphiqlResolver,
    graphiql: true,
  }),
);

module.exports = app;
