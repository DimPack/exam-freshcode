const express = require('express');
const authRouter = require('./auth.router');
const userRouter = require('./user.router');
const contestRouter = require('./contest.router');
const chatRouter = require('./chat.router');
const { checkToken, checkAuth } = require('../middlewares/checkToken');

const router = express.Router();
router.use('/', authRouter);

router.use(checkToken);

router.get('/getUser', checkAuth);
router.use('/users', userRouter);
router.use('/contests', contestRouter);
router.use('/chats', chatRouter);

module.exports = router;
