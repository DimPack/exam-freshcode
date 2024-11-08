const { Router } = require('express');
const { login, registration } = require('../controllers/authUserController');
const { validateLogin, validateRegistrationData } = require('../middlewares/validators');
const hashPassMiddle = require('../middlewares/hashPassMiddle');

const router = Router();
router.post('/registration', validateRegistrationData, hashPassMiddle, registration);
router.post('/login', validateLogin, login);

module.exports = router;
