
const mongoose = require('mongoose');
const chat = require('../models/_chat');

module.exports = mongoose.model('chat',chat);
