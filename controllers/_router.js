
const { Router } = require('express');
const router = Router();

const $ = require('../services/_index.service');

router.use($.answers);
router.use($.auth.authorize);
router.use('/auth',require('./auth.router'));
router.use('/user', require('./user.router'));
router.use('/chat', require('./chat.router'));
router.use('/message', require('./message.router'));
router.use('/event', require('./event.router'));

module.exports = router;
