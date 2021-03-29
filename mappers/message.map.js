
const mongoose = require('mongoose');
const message = require('../models/_message');

module.exports = mongoose.model('message',message);
