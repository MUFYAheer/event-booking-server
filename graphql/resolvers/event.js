const Event = require('../../models/Event');
const User = require('../../models/User');

const { transformEvent } = require('./merge');

exports.events = async () => {
  try {
    const events = await Event.find();
    return events.map(event => transformEvent(event));
  } catch (error) {
    throw error;
  }
};
exports.createEvent = async (args, req) => {
  if (!req.isAuth) throw new Error('Unauthorized');
  try {
    const event = await Event.create({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '5c514026b71f4d2a5498a7d2',
    });
    const user = await User.findById('5c514026b71f4d2a5498a7d2');
    if (!user) throw new Error('User not exist');
    user.createdEvents.push(event);
    await user.save();
    return transformEvent(event);
  } catch (error) {
    throw error;
  }
};
