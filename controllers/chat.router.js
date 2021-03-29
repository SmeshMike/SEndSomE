
const { Router } = require('express');
const router = Router();

router.get('/', async (req,res) => {
    res.send('hello from chat router');
});

module.exports = router;
