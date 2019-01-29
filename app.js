const express = require('express');
const logger = require('morgan');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const { connect } = require('mongoose');

const Event = require('./models/Event');

connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true },
)
  .then(() => console.log('Connected...'))
  .catch(error => console.error(error));

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput!): Event!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: async () => {
        const events = await Event.find();
        return events.map(event => ({ ...event._doc, _id: event.id }));
      },
      createEvent: async (args) => {
        const event = await Event.create({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
        });

        return { ...event._doc, _id: event.id };
      },
    },
    graphiql: true,
  }),
);

module.exports = app;
