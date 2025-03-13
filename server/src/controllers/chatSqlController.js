const db = require('../models');
const controller = require('../socketInit');
const { Op, Sequelize } = require('sequelize');
const { Conversation, Message, Users } = require('../models');
const sequelize = require('../models').sequelize; // Додано імпорт sequelize

module.exports.getPreviewSql = async (req, res, next) => {
  try {
    const userId = req.tokenData.userId;
    console.log('Fetching conversations for user:', userId);

    // Отримати всі розмови, в яких бере участь користувач
    const conversations = await Conversation.findAll({
      where: {
        participants: {
          [Op.contains]: [userId],
        },
      },
      order: [['updatedAt', 'DESC']],
    });

    console.log('Fetched conversations:', conversations.length);

    // Отримати останнє повідомлення для кожної розмови
    const conversationIds = conversations.map(conversation => conversation.id);
    const lastMessages = await Message.findAll({
      where: {
        conversationId: {
          [Op.in]: conversationIds,
        },
      },
      order: [['createdAt', 'DESC']],
    });

    console.log('Fetched last messages:', lastMessages.length);

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

    console.log('Fetched senders:', senders.length);

    // Додати інформацію про співрозмовників та останні повідомлення до розмов
    const conversationPreviews = conversations.map((conversation) => {
      const otherParticipant = conversation.participants.find(
        (participant) => participant !== userId
      );
      const sender = senders.find(
        (sender) => sender.id === otherParticipant
      );
      const lastMessage = lastMessages.find(
        (message) => message.conversationId === conversation.id
      );

      console.log('Processing conversation:', conversation.id);
      console.log('Last message for conversation:', lastMessage ? lastMessage.body : 'No last message');

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
    console.error('Error in getPreviewSql:', err);
    next(err);
  }
};

module.exports.addMessageSql = async (req, res, next) => {
  const participants = [req.tokenData.userId, req.body.recipient];
  participants.sort((participant1, participant2) => participant1 - participant2);

  try {
    // Знайти розмову з цими учасниками
    let conversation = await Conversation.findOne({
      where: {
        participants: {
          [Op.contains]: participants,
        },
      },
    });

    // Якщо розмова не знайдена, створити нову
    if (!conversation) {
      conversation = await Conversation.create({
        participants,
        blackList: [false, false],
        favoriteList: [false, false],
      });
    }

    // Створити нове повідомлення
    const message = await Message.create({
      senderId: req.tokenData.userId,
      body: req.body.messageBody,
      conversationId: conversation.id,
    });

    // Оновити останнє повідомлення та дату створення в розмові
    await conversation.update({
      lastMessage: message.body,
      lastMessageCreatedAt: message.createdAt,
    });

    const interlocutorId = participants.find(participant => participant !== req.tokenData.userId);

    const preview = {
      id: conversation.id,
      sender: req.tokenData.userId,
      text: req.body.messageBody,
      createAt: message.createdAt,
      participants,
      blackList: conversation.blackList,
      favoriteList: conversation.favoriteList,
      lastMessage: message.body,
      lastMessageCreatedAt: message.createdAt,
    };

    // Відправка повідомлення через WebSocket
    controller.getChatController().emitNewMessage(interlocutorId, {
      message,
      preview: {
        id: conversation.id,
        sender: req.tokenData.userId,
        text: req.body.messageBody,
        createAt: message.createdAt,
        participants,
        blackList: conversation.blackList,
        favoriteList: conversation.favoriteList,
        lastMessage: message.body,
        lastMessageCreatedAt: message.createdAt,
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

    res.send({ message, preview });
  } catch (err) {
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