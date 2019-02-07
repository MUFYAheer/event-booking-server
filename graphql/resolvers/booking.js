const Booking = require('../../models/Booking');

const { transformBooking } = require('./merge');

exports.bookings = async (args, req) => {
  if (!req.isAuth) throw new Error('Unauthorized');
  const bookingsResult = await Booking.find();
  return bookingsResult.map(bookingResult => transformBooking(bookingResult));
};
exports.bookEvent = async (args, req) => {
  if (!req.isAuth) throw new Error('Unauthorized');
  const bookingResult = await Booking.create({
    event: args.eventId,
    user: req.userId,
  });
  return transformBooking(bookingResult);
};
exports.cancelBooking = async (args, req) => {
  if (!req.isAuth) throw new Error('Unauthorized');
  const bookingResult = await Booking.findByIdAndDelete(args.bookingId);
  return transformBooking(bookingResult);
};
