
const user = require('./user.service');
const chat = require('./chat.service');
const message = require('./message.service');
const v = require('./validation');

const mapper = require('../mappers/_index.map');

module.exports = {
    user,
    chat,
    message,
    v,

    mapper
}
