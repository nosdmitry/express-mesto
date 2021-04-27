module.exports.handleError = async (req, res) => {
  res.status(404).send('Страница не найдена, 404');
};
