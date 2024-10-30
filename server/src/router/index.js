const express = require('express');
const userRouter = require('./user.router');
const contestRouter = require('./contest.router');
const chatRouter = require('./chat.router');
const { checkToken } = require('../middlewares/checkToken');
const router = express.Router();

router.use(checkToken);

router.use('/', userRouter);
router.use('/contest', contestRouter);
router.use('/chat', chatRouter);

module.exports = router;
