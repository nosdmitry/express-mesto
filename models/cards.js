const mongoose = require('mongoose');
const validator = require('validator');

const cardsSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    validate: {
      validator: function(v) {
        return /https?:\/\/(www.)?\w*.\w*/g.test(v);
      },
      message: props => `${props.value} не валидный.`
    },
    required: [true, 'Введите URL адрес.' ],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAd: {
    type: Date,
    default: Date.now(),
  },
});

exports.Cards = mongoose.model('cards', cardsSchema);
