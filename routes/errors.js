module.exports.handleError = async (req, res) => {
  try {
    res.status(404).send('Страница не найдена, 404');
  } catch (err) {
    res.status(500).send('Ошибка сервера.');
  }
};
