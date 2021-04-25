const { Cards } = require('../models/cards');

module.exports.getAllCards = async(req, res) => {
  try {
    const cards = await Cards.find({});
    res.send(await cards);
  } catch (err) {
    await res.status(500).send('Ошибка при обработке карточек');
  }
};

module.exports.createCard = async(req, res) => {
  try {
    res.send(req.user._id);
    console.log();
  } catch (err) {
    console.log(err);
  }
};

module.exports.deleteCard = async(req, res) => {
  try {
    res.send(await req.params.cardId);
  } catch (err) {
    await console.log(err);
  }
};
