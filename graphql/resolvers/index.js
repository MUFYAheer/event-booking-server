const { hash, genSalt } = require('bcryptjs');

const Event = require('../../models/Event');
const User = require('../../models/User');

const user = async (userId) => {
  try {
    const userResult = await User.findById(userId);
    return {
      ...userResult._doc,
      _id: userResult.id,
      createdEvents: events.bind(this, userResult._doc.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

const events = async (eventIds) => {
  try {
    const eventsResult = await Event.find({ _id: { $in: eventIds } });
    return eventsResult.map(event => ({
      ...event._doc,
      _id: event.id,
      creator: user.bind(this, event._doc.creator),
    }));
  } catch (error) {
    throw error;
  }
};

module.exports = {
  events: async () => {
    try {
      const eventsResult = await Event.find();
      return eventsResult.map(event => ({
        ...event._doc,
        _id: event.id,
        creator: user.bind(this, event.creator),
      }));
    } catch (error) {
      throw error;
    }
  },
  createEvent: async (args) => {
    try {
      const eventResult = await Event.create({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: '5c514026b71f4d2a5498a7d2',
      });
      const userResult = await User.findById('5c514026b71f4d2a5498a7d2');
      if (!userResult) throw new Error('User not exist');
      userResult.createdEvents.push(eventResult);
      await userResult.save();
      return {
        ...eventResult._doc,
        _id: eventResult.id,
        creator: user.bind(this, eventResult.creator),
      };
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
      const userResult = await User.create({
        email,
        password: hashPassword,
      });
      return {
        ...userResult._doc,
        _id: userResult.id,
        createdEvents: events.bind(this, userResult._doc.createdEvents),
      };
    } catch (error) {
      throw error;
    }
  },
};
