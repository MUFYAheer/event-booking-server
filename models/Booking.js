const { Schema, model } = require('mongoose');

const bookingSchema = new Schema(
  {
    event: Schema.Types.ObjectId,
    user: Schema.Types.ObjectId,
  },
  { timestamps: true },
);

module.exports = model('Booking', bookingSchema);
