const db = require('../models');
const controller = require('../socketInit');
const { Op, Sequelize } = require('sequelize');
const { Conversation, Message, Users } = require('../models');
const sequelize = require('../models').sequelize; // Додано імпорт sequelize

module.exports.getPreviewSql = async (req, res, next) => {
  try {
    const userId = req.tokenData.userId;

    // Отримати всі розмови, в яких бере участь користувач
    const conversations = await Conversation.findAll({
      where: {
        participants: {
          [Op.contains]: [userId],
        },
      },
      order: [['updatedAt', 'DESC']],
      include: [
        {
          model: Message,
          as: 'messages',
          attributes: ['body', 'createdAt'],
          order: [['createdAt', 'DESC']],
          limit: 1,
        },
      ],
    });

    // Отримати всіх співрозмовників
    const interlocutors = [];
    conversations.forEach((conversation) => {
      const otherParticipant = conversation.participants.find(
        (participant) => participant !== userId
      );
      if (otherParticipant) {
        interlocutors.push(otherParticipant);
      }
    });

    const senders = await Users.findAll({
      where: {
        id: interlocutors,
      },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });

    // Додати інформацію про співрозмовників та останні повідомлення до розмов
    const conversationPreviews = conversations.map((conversation) => {
      const otherParticipant = conversation.participants.find(
        (participant) => participant !== userId
      );
      const sender = senders.find(
        (sender) => sender.id === otherParticipant
      );
      const lastMessage = conversation.messages[0];

      return {
        id: conversation.id,
        participants: conversation.participants,
        blackList: conversation.blackList,
        favoriteList: conversation.favoriteList,
        lastMessage: lastMessage ? lastMessage.body : null,
        lastMessageCreatedAt: lastMessage ? lastMessage.createdAt : null,
        interlocutor: sender ? {
          id: sender.id,
          firstName: sender.firstName,
          lastName: sender.lastName,
          displayName: sender.displayName,
          avatar: sender.avatar,
        } : null,
      };
    });

    res.send(conversationPreviews);
  } catch (err) {
    next(err);
  }
};

module.exports.addMessageSql = async (req, res, next) => {
  const participants = [req.tokenData.userId, req.body.recipient];
  participants.sort((participant1, participant2) => participant1 - participant2);

  try {
    // Знайти або створити нову розмову
    let [newConversation, created] = await Conversation.findOrCreate({
      where: {
        participants: {
          [Op.contains]: participants,
        },
      },
      defaults: {
        participants,
        blackList: [false, false],
        favoriteList: [false, false],
      },
    });

    // Перевірити, чи існує розмова
    if (!created) {
      // Якщо розмова існує, оновити дату оновлення
      await newConversation.update({ updatedAt: new Date() });
    }

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

module.exports.getChatSql = async (req, res, next) => {
  const participants = [req.tokenData.userId, req.body.interlocutorId];
  participants.sort((participant1, participant2) => participant1 - participant2);

  try {
    // Знайти розмову з цими учасниками
    const conversation = await Conversation.findOne({
      where: { participants },
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Отримати повідомлення для цієї розмови
    const messages = await Message.findAll({
      where: { conversationId: conversation.id },
      order: [['createdAt', 'ASC']],
    });

    // Отримати інформацію про співрозмовника
    const interlocutor = await db.Users.findByPk(req.body.interlocutorId, {
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });

    if (!interlocutor) {
      return res.status(404).json({ message: 'Interlocutor not found' });
    }

    res.send({
      messages,
      interlocutor: {
        firstName: interlocutor.firstName,
        lastName: interlocutor.lastName,
        displayName: interlocutor.displayName,
        id: interlocutor.id,
        avatar: interlocutor.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
};