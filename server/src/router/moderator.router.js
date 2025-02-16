const { Router } = require('express');
const { getAllOffers, updateOfferStatus } = require('../controllers/moderatorController');


const router = Router();


router.get('/getAllOffers', getAllOffers);
router.patch('/updateOfferStatus', updateOfferStatus);

module.exports = router;
