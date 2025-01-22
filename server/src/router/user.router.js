const { Router } = require('express');
const {
  cashout,
  updateUser,
  payment,
  changeMark,
  getUser,
} = require('../controllers/userController');
const {
  onlyForCustomer,
  parseBody,
  onlyForCreative,
} = require('../middlewares/basicMiddlewares');
const { validateContestCreation } = require('../middlewares/validators');
const { uploadContestFiles, uploadAvatar } = require('../utils/fileUpload');
const { checkAuth } = require('../middlewares/checkToken');

const router = Router();
router.get('/getUser', checkAuth, getUser);
router.post('/changeMark', onlyForCustomer, changeMark);
router.post('/cashout', onlyForCreative, cashout);
router.post('/pay',
  onlyForCustomer,
  uploadContestFiles,
  parseBody,
  validateContestCreation,
  payment
);
router.put('/updateUser', uploadAvatar, updateUser);

module.exports = router;
