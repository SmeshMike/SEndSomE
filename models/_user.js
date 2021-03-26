
const { Types, Schema } = require('mongoose');

const Roles = {
    stranger : 0,
    user : 1,
    advanced : 2,
    admin : 10
}

const usermodel = {

    login : String,
    username : String,
    
    hash : String,
    salt : String,

    tag : { type : Number, default : () => Math.floor(Math.random() * 100000) % 10000 },
    
    // access level
    role : { type : Number, default : 1 },
    date : { type : Number, default : Date.now } 

}

function topub(doc,ret) {

    delete ret.hash;
    delete ret.salt;
    delete ret.role;
    delete ret.__v; // mongoose version

}

const options = { toJSON : { transform : topub } };
module.exports = new Schema(usermodel, options);