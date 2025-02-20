const { Router } = require('express');
const { getAllOffers, updateOfferStatus } = require('../controllers/moderatorController');
const { pagination } = require('../middlewares/pagination.mw');


const router = Router();


router.get('/getAllOffers', pagination, getAllOffers);
router.patch('/updateOfferStatus', updateOfferStatus);

module.exports = router;
