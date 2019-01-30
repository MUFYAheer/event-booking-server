const { hash, genSalt } = require('bcryptjs');

const User = require('../../models/User');

exports.createUser = async (args) => {
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
    };
  } catch (error) {
    throw error;
  }
};
