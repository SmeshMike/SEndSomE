
const { Router } = require('express');
const router = Router();

router.use('/user', require('./user.router'));
router.use('/chat', require('./chat.router'));
router.use('/message', require('./message.router'));
router.use('/event', require('./event.router'));

module.exports = router;
