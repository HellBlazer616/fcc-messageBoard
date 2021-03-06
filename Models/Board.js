const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'A board must have a title',
  },
});

module.exports = mongoose.model('Board', boardSchema);
