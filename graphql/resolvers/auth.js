const { hash, genSalt, compare } = require('bcryptjs');
const { sign } = require('jsonwebtoken');

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

exports.login = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User does not exist');
    const isEqual = await compare(password, user.password);
    if (!isEqual) throw new Error('Password is incurrect');
    const token = sign({ userId: user.id, email }, process.env.PRIVATE_KEY, { expiresIn: '1h' });
    return { userId: user.id, token };
  } catch (error) {
    throw error;
  }
};
