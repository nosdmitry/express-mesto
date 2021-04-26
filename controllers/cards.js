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
    const card = await Cards({ ...req.body, owner: req.user._id });
    res.status(200).send(await card.save());
  } catch (err) {
    console.log(err);
  }
};

module.exports.deleteCard = async(req, res) => {
  try {
    const card = await Cards.findByIdAndDelete(req.params.cardId);
    res.status(200).send(card);
  } catch (err) {
    await console.log(err);
  }
};
