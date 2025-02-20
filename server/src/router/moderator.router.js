const { Router } = require('express');
const { getAllOffers, updateOfferStatus } = require('../controllers/moderatorController');
const { paginate } = require('../middlewares/paginate.mw');


const router = Router();


router.get('/getAllOffers', paginate, getAllOffers);
router.patch('/updateOfferStatus', updateOfferStatus);

module.exports = router;
