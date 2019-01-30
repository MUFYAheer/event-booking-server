const { events, createEvent } = require('./event');
const { bookings, bookEvent, cancelBooking } = require('./booking');
const { createUser } = require('./auth');

module.exports = {
  events,
  bookings,
  createEvent,
  bookEvent,
  cancelBooking,
  createUser,
};
