
const { Router } = require('express');
const router = Router();

router.get('/', async (req,res) => {
    res.send('base operations');
});

router.post('/login',async (req,res) => {

});

router.post('/logout', async (req,res) => {

}); 

module.exports = router;
