
function baseanswer(status, code, msg, payload)
{
    let resobj = {
        success: status,
        httpcode: code,
        error: msg,
        ...payload
    };
    if(status) delete resobj.payload;
    return this.json(resobj);
}

function okanswer()
{
    this.baseanswer(true,200,"",{});
}

function erroranswer(code, msg)
{
    this.baseanswer(false,code,msg,{});
}

function dataanswer(payload)
{
    this.baseanswer(true,200,"",payload);
}



module.exports = (req,res,next) => {
    res.baseanswer = baseanswer;
    res.okanswer = okanswer;
    res.erroranswer = erroranswer;
    res.dataanswer = dataanswer;
    next();
}
