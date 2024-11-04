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

const router = Router();
router.post('/newMessage', addMessage);
router.post('/createCatalog', createCatalog);

router.post('/getChat', getChat);
router.get('/getPreview', getPreview);
router.get('/getCatalogs', getCatalogs);

router.patch('/blackList', blackList);
router.patch('/favorite', favoriteChat);
router.patch('/updateNameCatalog', updateNameCatalog);
router.patch('/addNewChatToCatalog', addNewChatToCatalog);
router.patch('/removeChatFromCatalog', removeChatFromCatalog);

router.delete('/deleteCatalog', deleteCatalog);

module.exports = router;
