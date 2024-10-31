const express = require('express');
const userRouter = require('./user.router');
const contestRouter = require('./contest.router');
const chatRouter = require('./chat.router');
const { checkToken, checkAuth } = require('../middlewares/checkToken');
const { validateLogin } = require('../middlewares/validators');
const { login } = require('../controllers/userController');

const router = express.Router();
router.get('/getUser', checkAuth);
router.post('/login', validateLogin, login);

router.use(checkToken);

router.use('/', userRouter);
router.use('/contest', contestRouter);
router.use('/chat', chatRouter);

module.exports = router;
