
const { Types, Schema } = require('mongoose');

const chatmodel = {

    name  : String,

    // user ids 
    uids : [Types.ObjectId],

    // create date
    date : { type : Number, default : Date.now }

}

function topub(doc,ret) {

    delete ret.__v;

}

const options = { toJSON : { transform : topub } };
module.exports = new Schema(chatmodel, options);
