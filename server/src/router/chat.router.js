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
const {
  getPreviewSql,
  addMessageSql,
  getChatSql,
  createCatalogSql,
  getCatalogsSql,
  addNewChatToCatalogSql,
  updateNameCatalogSql,
  deleteCatalogSql,
  blackListSql,
  favoritesSql,
} = require('../controllers/chatSqlController');

const router = Router();
// router.post('/newMessage', addMessage);
// router.post('/getChat', getChat);
// router.get('/getPreview', getPreview);
// router.post('/createCatalog', createCatalog);
// router.get('/getCatalogs', getCatalogs);
// router.patch('/addNewChatToCatalog', addNewChatToCatalog);
// router.patch('/updateNameCatalog', updateNameCatalog);
// router.patch('/deleteCatalog', deleteCatalog);
// router.patch('/blackList', blackList);
// router.patch('/favorite', favoriteChat);
// router.patch('/removeChatFromCatalog', removeChatFromCatalog);

router.post('/getChat', getChatSql);
router.post('/newMessage', addMessageSql);
router.get('/getPreview', getPreviewSql);
router.post('/createCatalog', createCatalogSql);
router.get('/getCatalogs', getCatalogsSql);
router.patch('/addNewChatToCatalog', addNewChatToCatalogSql);
router.patch('/updateNameCatalog/:id', updateNameCatalogSql);
router.delete('/deleteCatalog/:id', deleteCatalogSql);
router.patch('/blackList', blackListSql);
router.patch('/favorite', favoritesSql);

module.exports = router;
