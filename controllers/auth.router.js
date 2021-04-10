
const { Router } = require('express');
const router = Router();

const $ = require('../services/_index.service');

router.get('/', async (req,res) => {
    res.send('base operations');
});

router.post('/login',
    $.v({ 
        $login : String,
        $password : String
    }),
    async (req,res) => {

        let uid = await $.user.login(req.body);
        if(!uid) return res.erroranswer(400, "Wrong login/password");

        let output = await $.auth.generate(uid);

        res.dataanswer(output);
                
    }
);

// access with refresh token
router.use($.lvl(0));

router.post('/refresh', 
    $.v({ }),
    async (req,res) => {

        let output = await $.auth.update(req.token);

        res.dataanswer(output);

    }
);

// valid token only
router.use($.lvl(1));

router.post('/logout',
    $.v({ }),
    async (req,res) => {

        let removed = await $.auth.remove(req.token);
        if(!removed) return res.erroranswer(400,'Connection close falure');

        res.okanswer();

    }
);

router.post('/drop',
    $.v({ }),
    async (req,res) => {
        
        await $.auth.clear(req.user._id);

        res.okanswer();

    }
);

module.exports = router;
