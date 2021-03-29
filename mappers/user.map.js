
const mongoose = require('mongoose');
const user = require('../models/_user');

module.exports = mongoose.model('user',user);
