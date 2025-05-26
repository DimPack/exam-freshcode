const bd = require('../models');
const mailer = require('../nodemailer');

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
          attributes: ['id', 'title', 'industry', 'styleName', 'userId'],
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
      limit: pagination.limit,
      offset: pagination.offset,
      order: [['id', 'ASC']],
    });

    res.status(200).json({
      message: 'Offers retrieved successfully.',
      offers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.makeOfferVisible = async (req, res, next) => {
  try {
    if (req.tokenData.role !== 'moderator')
      return res.status(403).send('Access denied');
    const { offerId } = req.body;
    await bd.Offers.update({ status: 'visible' }, { where: { id: offerId } });
    const updatedOffer = await bd.Offers.findOne({
      where: { id: offerId },
      include: [
        {
          model: bd.Users,
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: bd.Contests,
          attributes: ['id', 'title', 'industry', 'styleName', 'userId'],
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
    res.status(200).send({ offer: updatedOffer });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteOffer = async (req, res, next) => {
  try {
    if (req.tokenData.role !== 'moderator')
      return res.status(403).send('Access denied');
    const { offerId } = req.body;
    const offer = await bd.Offers.findByPk(offerId);
    if (!offer) return res.status(404).send('Offer not found');
    await offer.destroy();
    res.status(200).send({ offerId });
  } catch (error) {
    next(error);
  }
};
