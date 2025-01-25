const { Conversation, Message, User } = require('../models');
const db = require('../models');

module.exports.getPreviewSql = async (req, res, next) => {
  try {
    console.log("Fetching all conversations...");
    const conversations = await db.Conversation.findAll();

    console.log('Fetched conversations:', conversations); 
    res.json(conversations);
  } catch (err) {
    console.log('Error:', err);
    next(err);
  }
};


