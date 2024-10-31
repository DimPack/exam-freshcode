const { Router } = require('express');
const {
  cashout,
  updateUser,
  payment,
  changeMark,
  registration,
  login,
} = require('../controllers/userController');
const {
  onlyForCustomer,
  parseBody,
  onlyForCreative,
} = require('../middlewares/basicMiddlewares');
const {
  validateRegistrationData,
  validateLogin,
  validateContestCreation,
} = require('../middlewares/validators');
const hashPass = require('../middlewares/hashPassMiddle');
const { uploadContestFiles, uploadAvatar } = require('../utils/fileUpload');

const router = Router();

router.post('/registration', validateRegistrationData, hashPass, registration);
// router.post('/login', validateLogin, login);
/////^^^^^^

router.post(
  '/pay',
  onlyForCustomer,
  uploadContestFiles,
  parseBody,
  validateContestCreation,
  payment
);
router.post('/changeMark', onlyForCustomer, changeMark);
router.post('/cashout', onlyForCreative, cashout);

router.put('/updateUser', uploadAvatar, updateUser);


module.exports = router;
