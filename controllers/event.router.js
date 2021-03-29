
const { Router } = require('express');
const router = Router();

router.get('/', async (req,res) => {
    res.send('hello from event router');
});

module.exports = router;
