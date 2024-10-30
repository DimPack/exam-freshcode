const { Router } = require('express');
const {
  getCustomersContests,
  dataForContest,
  getContests,
  setOfferStatus,
  setNewOffer,
  updateContest,
  downloadFile,
  getContestById,
} = require('../controllers/contestController');
const {
  canGetContest,
  onlyForCreative,
  canSendOffer,
  onlyForCustomerWhoCreateContest,
} = require('../middlewares/basicMiddlewares');
const { updateContestFile, uploadLogoFiles } = require('../utils/fileUpload');
const { checkAuth } = require('../middlewares/checkAuth');

const router = Router();

router.post('/getUser', checkAuth);
///^^^^^^
router.post('/dataForContest', dataForContest);
router.post('/setNewOffer', uploadLogoFiles, canSendOffer, setNewOffer);
router.post('/setOfferStatus', onlyForCustomerWhoCreateContest, setOfferStatus);

router.get('/getCustomersContests', getCustomersContests);
router.get('/getContestById', canGetContest, getContestById);
router.get('/getAllContests', onlyForCreative, getContests);
router.get('/downloadFile/:fileName', downloadFile);

router.put('/updateContest', updateContestFile, updateContest);

module.exports = router;
