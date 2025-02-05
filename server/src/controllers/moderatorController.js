const bd = require('../models');

module.exports.getAllOffers = async (req, res, next) => {
    try {
      if (req.tokenData.role !== 'moderator') {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      console.log("Fetching offers...");
  
      const offers = await bd.Offers.findAll({
        include: [
          {
            model: bd.Users,  // Інформація про користувачів, які подають офери
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
      });
  
      console.log("Offers fetched:", offers);
  
      res.status(200).json({
        message: 'Offers retrieved successfully.',
        offers,
      });
    } catch (error) {
      console.error("Error fetching offers:", error);
      next(error);
    }
};
