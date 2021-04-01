

const { Router } = require('express');
const router = Router();

const $ = require('../services/_index.service');

router.get('/', async (req,res) => {
    //res.send('hello from chat router');
    res.okanswer();
});

router.post('/tmp', $.v({
    $musthave : String,
    optional : [Number]
}), async (req,res) => {

});

module.exports = router;
