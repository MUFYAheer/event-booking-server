const { events, createEvent } = require('./event');
const { bookings, bookEvent, cancelBooking } = require('./booking');
const { createUser, login } = require('./auth');

module.exports = {
  events,
  bookings,
  createEvent,
  bookEvent,
  cancelBooking,
  createUser,
  login,
};
