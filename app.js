const express = require('express');
const logger = require('morgan');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery,
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => ['Cooking', 'Fishing', 'All-night coding'],
      createEvent: args => args.name,
    },
    graphiql: true,
  }),
);

module.exports = app;
