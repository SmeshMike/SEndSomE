
const Schema = require('validate');
const { Types } = require('mongoose');

module.exports = function (obj) {

    const sch = {};
    for(let prop in obj)
    {
        let key;
        let value = {};

        if(Array.isArray(obj[prop]))
        {
            value.type = Array;
            value.each = { type : obj[prop][0]};
        }
        else
        {
            value.type = obj[prop];
        }

        if(prop.length > 0 && prop[0] === '$')
        {
            key = prop.substr(1);
            value.required = true
            if(value.type == Array)
            {
                value.length = { min : 1, max : 100 };
            }
        }
        else
        {
            key = prop;
            value.required = false;
        }

        if(key.length > 2 && prop.substr(prop.length - 2) === 'id')
        {
            value.length = 24;
        }
        if(prop.length > 3 && prop.substr(prop.length - 3) === 'ids')
        {
            value.each.length = 24;
        }

        sch[key] = value;

    }

    let validator = new Schema(sch);

    return (req, res, next) => {

        let errors = validator.validate(req.body);
        if(errors.length > 0) {
            res.status(400).json({ error : errors.map(e => e.message).join('\n')});
        }
        else {
            for(let prop in req.body)
            {
                if(prop.length > 2 && prop.substr(prop.length - 2) === 'id')
                {
                    try 
                    {
                        req.body[prop] = Types.ObjectId(req.body[prop]);
                    }
                    catch(ex) { return res.status(400).json({ error : "Invalid id"});  }
                }
                if(prop.length > 3 && prop.substr(prop.length - 3) === 'ids')
                {
                    try 
                    {
                        req.body[prop] = req.body[prop].map(id => Types.ObjectId(id));
                    }
                    catch(ex) { return res.status(400).json({ error : "Invalid ids"});  }
                }
            }

            next();
            
        }
    }
}