
const mongoose = require('mongoose');
const crypto = require('crypto');
const user = require('../models/_user');

user.methods.genpassword = function (pswrd)
{
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.createHmac('sha256',this.salt).update(pswrd).digest('hex');
}

user.method.checkpassword = function(pswrd)
{
    let hash = crypto.createHmac('sha256',this.salt).update(password).digest('hex');
    return hash === this.hash;
}

module.exports = mongoose.model('user',user);
