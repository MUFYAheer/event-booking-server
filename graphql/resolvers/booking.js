const Booking = require('../../models/Booking');

const { transformBooking } = require('./merge');

exports.bookings = async () => {
  const bookingsResult = await Booking.find();
  return bookingsResult.map(bookingResult => transformBooking(bookingResult));
};
exports.bookEvent = async (args) => {
  const bookingResult = await Booking.create({
    event: args.eventId,
    user: '5c514026b71f4d2a5498a7d2',
  });
  return transformBooking(bookingResult);
};
exports.cancelBooking = async (args) => {
  const bookingResult = await Booking.findByIdAndDelete(args.bookingId);
  return transformBooking(bookingResult);
};
