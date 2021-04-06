
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const $ = require('../mappers/_index.map');

//FIXME: .......
const privatekey = crypto.randomBytes(128).toString('hex');

function level(lvl) 
{
    return function (req,res,next) {
        if(req.level === 0) return res.erroranswer(401, "Authorization requiered");
        if(req.level < lvl) return res.erroranswer(403, "Permission denied");
        next();
    };
}

async function authorize(req,res,next) 
{
    let token = req.headers['x-access-token'] || req.cookies['x-access-token'] || req.body['accesstoken'];

    req.level = 0;
    req.user = null;

    if(!token) return next();

    let data = jwt.verify(token,privatekey);

    //TODO: more info (e.g.token expired)
    //TODO: exceptios
    if(!data) return res.erroranswer(400, "Invalid token");
    let { innertoken } = data;

    if(!innertoken) return res.erroranswer(400, "Invalid token");

    let connection = await $.connection.findOne({ token : innertoken }).exec();
    if(!connection) return res.erroranswer(400, "Wtf man?");

    let user = await $.user.findOne({ _id : connection.uid });
    if(!user) return res.erroranswer(500, "Well.... we don't know who u r");

    req.user = user;
    req.level = user.role;

    next();
}

async function generate(uid)
{
    let innertoken = crypto.randomBytes(64).toString('hex');

    // 24 hours
    let token = jwt.sign({ innertoken }, privatekey, { expiresIn : 60 * 60 * 24 });
    // 30 days
    let refresh = jwt.sign({ uid }, privatekey, { expiresIn : 60 * 60 * 24 * 30});

    let connection = new $.connection({
        uid : uid,
        token : innertoken,
        refresh : refresh
    });

    await connection.save();
    return token;
}

async function remove(token)
{
    //TODO: exceptios
    //FIXME: not necessary
    let data = jwt.verify(token,privatekey);
    if(!data) return false;
    
    let { innertoken } = data;
    if(!innertoken) return false;

    let connection = await $.connection.findOne({ token : innertoken }).exec();
    if(!connection) return false;

    await connection.remove();
    return true;
}

async function update(token)
{
    //TODO: do smth usefull
}

async function clear(uid)
{
    let connections = await $.connection.find({ uid : uid }).exec();
    for(let c of connection) await c.remove();
}

module.exports = { level, authorize, generate, update, remove, clear };
 