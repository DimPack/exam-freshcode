const {Conversation, Message, Catalog, User} = require('../models');
const db = require('../models');

module.exports.getPreviewSql = async (req, res, next) => {
    try {
      // Отримуємо розмови, в яких бере участь користувач
      const conversations = await db.Conversation.findAll({
        include: [
          {
            model: db.Message, // Включаємо модель Message
            include: [
              {
                model: db.User,
                as: 'sender', // Alias для зв'язку з користувачем
                attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
              },
            ],
            order: [['createdAt', 'DESC']], // Сортуємо за датою
            limit: 1, // Тільки останнє повідомлення
          },
        ],
        where: {
          participants: { [db.Sequelize.Op.contains]: [req.tokenData.userId] }, // Фільтруємо за участю користувача
        },
        order: [['updatedAt', 'DESC']], // Сортуємо за датою оновлення розмови
      });
  
      // Перетворюємо розмови для додавання інформації про співрозмовника
      const response = conversations.map((conversation) => {
        const latestMessage = conversation.Messages[0]; // Останнє повідомлення в розмові
        const sender = latestMessage.sender; // Отримуємо відправника останнього повідомлення
  
        return {
          id: conversation.id,
          interlocutor: {
            id: sender.id,
            firstName: sender.firstName,
            lastName: sender.lastName,
            displayName: sender.displayName,
            avatar: sender.avatar,
          },
          text: latestMessage.body,
          createAt: latestMessage.createdAt,
          participants: conversation.participants,
          blackList: conversation.blackList,
          favoriteList: conversation.favoriteList,
        };
      });
  
      res.json(response);
    } catch (err) {
      next(err);
    }
  };
  
  
