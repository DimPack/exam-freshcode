const bd = require('../models');

module.exports.getAllOffers = async (req, res, next) => {
    try {
      const { pagination } = req;

      if (req.tokenData.role !== 'moderator') {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      const offers = await bd.Offers.findAll({
        include: [
          {
            model: bd.Users,
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
          {
            model: bd.Contests,
            attributes: ['id', 'title', 'userId'],
            include: [
              {
                model: bd.Users,  
                attributes: ['id', 'firstName', 'lastName', 'email'],
                required: true, 
              },
            ],
          },
        ],
        ...pagination,
      });
  
      res.status(200).json({
        message: 'Offers retrieved successfully.',
        offers
      });
    } catch (error) {
      next(error);
    }
};


module.exports.updateOfferStatus = async (req, res, next) => {
  try {
      console.log("Received body:", req.body); // Додаємо лог
      
      if (req.tokenData.role !== 'moderator') {
          return res.status(403).send('Access denied');
      }

      const { offerId, status } = req.body;

      if (!["won", "rejected"].includes(status)) {
          return res.status(400).send("Invalid status value");
      }

      const offer = await bd.Offers.findByPk(offerId);
      if (!offer) {
          return res.status(404).send("Offer not found");
      }

      offer.status = status;
      await offer.save();

      res.status(200).send({
        message: "Offer status updated successfully",
        offer: offer
      });
  } catch (error) {
      next(error);
  }
};


