const { User } = require('../models/user');

async function updateUserInfo(req, res) {
  const user = await User.findByIdAndUpdate({ _id: req.user._id }, { ...req.body });
  res.status(200).send(await user);
}

module.exports.getUsers = async(req, res) => {
  try {
    const users = await User.find({});
    res.send(await users);
  } catch (err) {
    res.status(500).send('Произошла ощибка при обращении к пользователям');
  }
};

module.exports.getUsersById = async(req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.send(await user);
  } catch (err) {
    console.log(err);
    res.status(400).send('Пользователь не найден');
  }
};

module.exports.createUser = async(req, res) => {
  const user = new User(req.body);
  res.send(await user.save());
};

module.exports.updateUserProfile = async(req, res) => {
  try {
    updateUserInfo(req, res);
  } catch (err) {
    res.send(await 'ошибка!');
    res.send(await err);
  }
};

module.exports.updateUserAvatar = async(req, res) => {
  try {
    updateUserInfo(req, res);
  } catch (err) {
    console.log(err);
  }
};
