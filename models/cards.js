const mongoose = require('mongoose');

const cardsSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  likes: {
    type: ObjectId,
    default: []
  },
  createdAd: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('cards', cardsSchema);
