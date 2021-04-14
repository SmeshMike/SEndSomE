
const { Types, Schema } = require('mongoose');

const connectionmodel = {

    device  : String,
    meta : String,

    refresh : String,
    token : String,

    uid : { type : Types.ObjectId, ref : 'user' },

    date : { type : Number, default : Date.now },
    latsmodif : { type : Number, default : Date.now }
    
}

module.exports = new Schema(connectionmodel);
