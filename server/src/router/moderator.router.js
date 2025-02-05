const { Router } = require('express');
const { getAllOffers } = require('../controllers/moderatorController');


const router = Router();


router.get('/getAllOffers', getAllOffers);

module.exports = router;
