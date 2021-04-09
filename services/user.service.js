
const $ = require('../mappers/_index.map');

/* buisness logic funcs */
function testone() { return "hello from user service"; }

async function register(ctx) {

}

async function login(ctx) {
    let { login, password } = ctx;

    let user = await $.user.findOne({ login }).exec();
    if(!user) return false;

    let status = user.checkpassword(password);
    if(!status) return false;

    return user._id;
}

module.exports = {
    testone,
    regiser,
    login
}
