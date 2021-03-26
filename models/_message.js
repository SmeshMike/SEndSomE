
const { Types, Schema } = require('mongoose');

const msgmodel = {

    text : String,

    // Vk-like
    attachments : [Types.ObjectId],
    forwards : [Types.ObjectId],

    // Infrastructure
    from : { type : Types.ObjectId, ref : 'user' },
    to : { type : Types.ObjectId, ref : 'user' },
    tochat : { type : Types.ObjectId, ref : 'chat' },

    // Discord-like 
    emotions : [ObjectId],
    marks : Number,

    date : { type : Number, default : Date.now }

}

function topub(doc,ret) {

    delete ret.__v;

}

const options = { toJSON : { transform : topub } };
module.exports = new Schema(msgmodel, options);
