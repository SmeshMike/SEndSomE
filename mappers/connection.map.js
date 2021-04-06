
const mongoose = require('mongoose');
const connection = require('../models/_connection');

module.exports = mongoose.model('connection',connection);
