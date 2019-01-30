const { hash, genSalt } = require('bcryptjs');

const Event = require('../../models/Event');
const User = require('../../models/User');
const Booking = require('../../models/Booking');

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

const event = async (eventId) => {
  try {
    const eventResult = await Event.findById(eventId);
    return {
      ...eventResult._doc,
      _id: eventResult.id,
      creator: user.bind(this, eventResult._doc.creator),
    };
  } catch (error) {
    throw error;
  }
};

const events = async (eventIds) => {
  try {
    const eventsResult = await Event.find({ _id: { $in: eventIds } });
    return eventsResult.map(eventResult => ({
      ...eventResult._doc,
      _id: eventResult.id,
      creator: user.bind(this, eventResult._doc.creator),
    }));
  } catch (error) {
    throw error;
  }
};

module.exports = {
  events: async () => {
    try {
      const eventsResult = await Event.find();
      return eventsResult.map(eventResult => ({
        ...eventResult._doc,
        _id: eventResult.id,
        creator: user.bind(this, eventResult.creator),
      }));
    } catch (error) {
      throw error;
    }
  },
  bookings: async () => {
    const bookingsResult = await Booking.find();
    return bookingsResult.map(bookingResult => ({
      ...bookingResult._doc,
      _id: bookingResult.id,
      event: event.bind(this, bookingResult._doc.event),
      user: user.bind(this, bookingResult._doc.user),
    }));
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
  createBooking: async (args) => {
    const bookingResult = await Booking.create({
      event: args.eventId,
      user: '5c514026b71f4d2a5498a7d2',
    });
    return {
      ...bookingResult._doc,
      _id: bookingResult.id,
      event: event.bind(this, bookingResult._doc.event),
      user: user.bind(this, bookingResult._doc.user),
    };
  },
  cancelBooking: async (args) => {
    const bookingResult = await Booking.findByIdAndDelete(args.bookingId);
    const eventResult = await event(bookingResult._doc.event);
    return {
      ...eventResult,
    };
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
