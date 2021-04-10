
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const $ = require('../mappers/_index.map');

//FIXME: .......
const privatekey = crypto.randomBytes(128).toString('hex');

function level(lvl) 
{
    return function (req,res,next) {
        if(req.level === 0 && lvl === 0 && req.refresh) next();
        if(req.level === 0) return res.erroranswer(401, "Authorization requiered");
        if(req.level < lvl) return res.erroranswer(403, "Permission denied");
        next();
    };
}

async function authorize(req,res,next)
{
    let token = req.headers['x-access-token'] || req.cookies['x-access-token'] || req.body['access_token'] || req.body['refresh_token'];

    req.level = 0;
    req.user = null;
    req.refresh = false;
    req.token = token;

    if(!token) return next();

    jwt.verify(token,privatekey,(err,decoded) => {
        
        if(err && err.name === 'TokenExpiredError') return res.erroranswer(400, 'Token expired');
        if(err) return res.erroranswer(400,'Invalid token');

        if(!decoded) return res.erroranswer(500, "...");
        let { innertoken, refreshtoken } = decoded;

        if(refreshtoken)
        {
            req.refresh = true;
            return next();
        }

        if(!innertoken) return res.erroranswer(400, "Invalid token");

        let connection = await $.connection.findOne({ token : innertoken }).exec();
        if(!connection) return res.erroranswer(400, "Wrong one... ?");

        let user = await $.user.findOne({ _id : connection.uid });
        if(!user) return res.erroranswer(500, "Well.... we don't know who u r");

        req.user = user;
        req.level = user.role;
    
        next();

    });
}

async function generate(uid)
{
    let innertoken = crypto.randomBytes(64).toString('hex');
    let refreshtoken = crypto.randomBytes(64).toString('hex');

    // 24 hours
    let token = jwt.sign({ innertoken }, privatekey, { expiresIn : 60 * 60 * 24 });
    // 30 days
    let refresh = jwt.sign({ refreshtoken }, privatekey, { expiresIn : 60 * 60 * 24 * 30});

    let connection = new $.connection({
        uid : uid,
        token : innertoken,
        refresh : refreshtoken
    });

    await connection.save();
    return { token, refresh };
}

async function remove(token)
{
    let data = jwt.decode(token);
    
    let { innertoken } = data;
    if(!innertoken) return false;

    let connection = await $.connection.findOne({ token : innertoken }).exec();
    if(!connection) return false;

    await connection.remove();
    return true;
}

function update(keytoken)
{
    return new Promise(async (res,rej) => {

        jwt.verify(keytoken,privatekey,(err,decoded) => {

            if(err) return res(false);

            let { refreshtoken } = decoded;
            if(!refreshtoken) return res(false);

            let connection = await $.connection.findOne({ refresh : refreshtoken }).exec();
            if(!connection) return res(false);

            let innertoken = crypto.randomBytes(64).toString('hex');
            let refreshtoken = crypto.randomBytes(64).toString('hex');
            let token = jwt.sign({ innertoken }, privatekey, { expiresIn : 60 * 60 * 24 });
            let refresh = jwt.sign({ refreshtoken }, privatekey, { expiresIn : 60 * 60 * 24 * 30});

            connection.token = innertoken;
            connection.refresh = refreshtoken;
            connection.lastmodif = Date.now();

            await connection.save();

            res({ token, refresh });

        });
    });  
}

async function clear(uid)
{
    let connections = await $.connection.find({ uid : uid }).exec();
    for(let c of connections) await c.remove();
}

module.exports = { level, authorize, generate, update, remove, clear };
 