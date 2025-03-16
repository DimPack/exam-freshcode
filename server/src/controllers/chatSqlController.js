const db = require('../models');
const controller = require('../socketInit');
const { Op, Sequelize } = require('sequelize');
const { Conversation, Message, Users, Catalog } = require('../models');
const sequelize = require('../models').sequelize;

module.exports.getPreviewSql = async (req, res, next) => {
  try {
    const userId = req.tokenData.userId;
    const conversations = await Conversation.findAll({
      where: {
        participants: {
          [Op.contains]: [userId],
        },
      },
      order: [['updatedAt', 'DESC']],
    });

    const conversationIds = conversations.map(conversation => conversation.id);
    const lastMessages = await Message.findAll({
      where: {
        conversationId: {
          [Op.in]: conversationIds,
        },
      },
      order: [['createdAt', 'DESC']],
    });

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

    let conversation = await Conversation.findOne({
      where: {
        participants: {
          [Op.contains]: participants,
        },
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants,
        blackList: [false, false],
        favoriteList: [false, false],
      });
    }

    const message = await Message.create({
      senderId: req.tokenData.userId,
      body: req.body.messageBody,
      conversationId: conversation.id,
    });

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

    const conversation = await Conversation.findOne({
      where: { participants },
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const messages = await Message.findAll({
      where: { conversationId: conversation.id },
      order: [['createdAt', 'ASC']],
    });

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

module.exports.createCatalogSql = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { catalogName, chatId } = req.body;

  if (!chatId || !Array.isArray(chatId) || chatId.length === 0) {
    return res.status(400).send({ message: 'Chats array cannot be empty' });
  }

  try {
    const catalog = await Catalog.create({
      userId,
      catalogName,
      chats: chatId,
    });
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogsSql = async (req, res, next) => {
  try {
    const catalogs = await Catalog.findAll({
      where: { userId: req.tokenData.userId },
      attributes: ['id', 'catalogName', 'chats'],
    });
    res.send(catalogs);
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalogSql = async (req, res, next) => {
  try {
    const { catalogId, chatId } = req.body;
    const { userId } = req.tokenData;

    const catalog = await Catalog.findOne({ where: { id: catalogId, userId } });

    if (!catalog) {
      return res.status(404).json({ error: 'Catalog not found or not authorized' });
    }

    if (!chatId || !Array.isArray(chatId) || chatId.length === 0) {
      return res.status(400).json({ error: 'Chats array cannot be empty' });
    }

    catalog.chats = [...catalog.chats, ...chatId];

    await catalog.save();

    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.updateNameCatalogSql = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid catalog ID" });
    }

    const catalog = await Catalog.findOne({
      where: { id, userId: req.tokenData.userId }
    });

    if (!catalog) {
      return res.status(404).json({ message: 'Catalog not found or not authorized' });
    }

    catalog.catalogName = req.body.catalogName;
    await catalog.save();
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};





