const { Router } = require('express');
const { getAllOffers, makeOfferVisible, deleteOffer } = require('../controllers/moderatorController');
const { paginate } = require('../middlewares/paginate.mw');

const router = Router();

router.get('/getAllOffers', paginate, getAllOffers);
router.post('/makeOfferVisible', makeOfferVisible);
router.post('/deleteOffer', deleteOffer)
// router.patch('/updateOfferStatus', updateOfferStatus);

module.exports = router;
