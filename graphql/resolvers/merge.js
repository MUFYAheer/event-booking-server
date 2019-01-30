const User = require('../../models/User');
const Event = require('../../models/Event');

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

const transformEvent = eventResult => ({
  ...eventResult._doc,
  _id: eventResult.id,
  creator: user.bind(this, eventResult._doc.creator),
});

const transformBooking = bookingResult => ({
  ...bookingResult._doc,
  _id: bookingResult.id,
  event: event.bind(this, bookingResult._doc.event),
  user: user.bind(this, bookingResult._doc.user),
});

module.exports = {
  transformEvent,
  transformBooking,
};
