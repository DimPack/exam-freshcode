const express = require('express');
const authRouter = require('./auth.router');
const userRouter = require('./user.router');
const contestRouter = require('./contest.router');
const chatRouter = require('./chat.router');
const { checkToken } = require('../middlewares/checkToken');

const router = express.Router();

router.use(checkToken);
router.use('/', authRouter);
router.use('/users', userRouter);
router.use('/contests', contestRouter);
router.use('/chats', chatRouter);

module.exports = router;
