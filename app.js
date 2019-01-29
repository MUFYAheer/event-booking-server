const express = require('express');
const logger = require('morgan');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const { connect } = require('mongoose');
const { hash, genSalt } = require('bcryptjs');

const Event = require('./models/Event');
const User = require('./models/User');

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

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput!): Event!
            createUser(userInput: UserInput!): User!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: async () => {
        try {
          const events = await Event.find();
          return events.map(event => ({ ...event._doc, _id: event.id }));
        } catch (error) {
          throw error;
        }
      },
      createEvent: async (args) => {
        try {
          const event = await Event.create({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5c5034937015472734c5b355',
          });
          const user = await User.findById('5c5034937015472734c5b355');
          if (!user) throw new Error('User not exist');
          user.createdEvents.push(event);
          await user.save();
          return { ...event._doc, _id: event.id };
        } catch (error) {
          throw error;
        }
      },
      createUser: async (args) => {
        try {
          const { email, password } = args.userInput;
          const userExist = await User.findOne({ email });
          if (userExist) throw new Error('User exists already');
          const salt = await genSalt(12);
          const hashPassword = await hash(password, salt);
          const user = await User.create({
            email,
            password: hashPassword,
          });
          return { ...user._doc, password: null, _id: user.id };
        } catch (error) {
          throw error;
        }
      },
    },
    graphiql: true,
  }),
);

module.exports = app;
