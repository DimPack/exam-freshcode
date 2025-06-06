const express = require('express');
const authRouter = require('./auth.router');
const userRouter = require('./user.router');
const contestRouter = require('./contest.router');
const chatRouter = require('./chat.router');
const moderatorRouter = require('./moderator.router');
const { checkToken } = require('../middlewares/checkToken');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the API!');
  });

router.use(checkToken);
router.use('/', authRouter);
router.use('/users', userRouter);
router.use('/contests', contestRouter);
router.use('/chats', chatRouter);
router.use('/moderators', moderatorRouter);

module.exports = router;
