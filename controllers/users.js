const { User } = require('../models/user');

exports.getUsers = async(req, res) => {
  const users = await User.find({});
  res.send(await users);
};

exports.getUsersById = async(req, res) => {
  const user = await User.findById(req.params.userId);
  res.send(await user);
};

exports.createUser = async(req, res) => {
  const user = new User(req.body);
  res.send(await user.save());
};
