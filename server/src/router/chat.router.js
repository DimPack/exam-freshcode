const { Router } = require('express');
const {
  getCatalogs,
  deleteCatalog,
  removeChatFromCatalog,
  addNewChatToCatalog,
  updateNameCatalog,
  createCatalog,
  favoriteChat,
  blackList,
  getPreview,
  getChat,
  addMessage,
} = require('../controllers/chatController');
const { getPreviewSql, addMessageSql, getChatSql } = require('../controllers/chatSqlController');

const router = Router();
// router.post('/newMessage', addMessage);
router.post('/createCatalog', createCatalog);

router.post('/getChat', getChat);

// router.get('/getPreview', getPreview);
// router.post('/getChat', getChatSql);
router.post('/newMessage', addMessageSql);
router.get('/getPreview', getPreviewSql);


router.get('/getCatalogs', getCatalogs);

router.patch('/blackList', blackList);
router.patch('/favorite', favoriteChat);
router.patch('/updateNameCatalog', updateNameCatalog);
router.patch('/addNewChatToCatalog', addNewChatToCatalog);
router.patch('/removeChatFromCatalog', removeChatFromCatalog);

router.patch('/deleteCatalog', deleteCatalog);

module.exports = router;
