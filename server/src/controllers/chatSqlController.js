const { Conversation, Message, User } = require('../models');
const controller = require('../socketInit');

module.exports.getPreviewSql = async (req, res, next) => {
  try {
    console.log("Fetching all conversations...");
    const conversations = await Conversation.findAll();

    console.log('Fetched conversations:', conversations); 
    res.json(conversations);
  } catch (err) {
    console.log('Error:', err);
    next(err);
  }
};

module.exports.addMessageSql = async (req, res, next) => {
  const participants = [req.tokenData.userId, req.body.recipient];
  participants.sort((participant1, participant2) => participant1 - participant2);

  try {
    // Знайти або створити нову розмову
    let [newConversation, created] = await Conversation.findOrCreate({
      where: { participants },
      defaults: {
        participants,
        blackList: [false, false],
        favoriteList: [false, false],
      },
    });

    // Створити нове повідомлення
    const message = await Message.create({
      senderId: req.tokenData.userId,
      body: req.body.messageBody,
      conversationId: newConversation.id,
    });

    const interlocutorId = participants.find(participant => participant !== req.tokenData.userId);

    const preview = {
      id: newConversation.id,
      sender: req.tokenData.userId,
      text: req.body.messageBody,
      createAt: message.createdAt,
      participants,
      blackList: newConversation.blackList,
      favoriteList: newConversation.favoriteList,
    };

    controller.getChatController().emitNewMessage(interlocutorId, {
      message,
      preview: {
        id: newConversation.id,
        sender: req.tokenData.userId,
        text: req.body.messageBody,
        createAt: message.createdAt,
        participants,
        blackList: newConversation.blackList,
        favoriteList: newConversation.favoriteList,
        interlocutor: {
          id: req.tokenData.userId,
          firstName: req.tokenData.firstName,
          lastName: req.tokenData.lastName,
          displayName: req.tokenData.displayName,
          avatar: req.tokenData.avatar,
          email: req.tokenData.email,
        },
      },
    });

    res.send({
      message,
      preview: Object.assign(preview, { interlocutor: req.body.interlocutor }),
    });
  } catch (err) {
    console.error(err); // Додано логування помилок
    next(err);
  }
};

// module.exports.getChatSql = async (req, res, next) => {
//   const participants = [req.tokenData.userId, req.body.interlocutorId];
//   participants.sort((participant1, participant2) => participant1 - participant2);

//   try {
//     // Знайти розмову з цими учасниками
//     const conversation = await Conversation.findOne({
//       where: { participants },
//     });

//     if (!conversation) {
//       return res.status(404).json({ message: 'Conversation not found' });
//     }

//     // Отримати повідомлення для цієї розмови
//     const messages = await Message.findAll({
//       where: { conversationId: conversation.id },
//       order: [['createdAt', 'ASC']],
//     });

//     // Отримати інформацію про співрозмовника
//     const interlocutor = await User.findByPk(req.body.interlocutorId, {
//       attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
//     });

//     if (!interlocutor) {
//       return res.status(404).json({ message: 'Interlocutor not found' });
//     }

//     res.send({
//       messages,
//       interlocutor: {
//         firstName: interlocutor.firstName,
//         lastName: interlocutor.lastName,
//         displayName: interlocutor.displayName,
//         id: interlocutor.id,
//         avatar: interlocutor.avatar,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };