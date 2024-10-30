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

router.get('/getChat', getChat);
router.get('/getPreview', getPreview);
router.get('/getCatalogs', getCatalogs);

router.put('/blackList', blackList);
router.put('/favorite', favoriteChat);
router.put('/updateNameCatalog', updateNameCatalog);
router.put('/addNewChatToCatalog', addNewChatToCatalog);
router.put('/removeChatFromCatalog', removeChatFromCatalog);

router.delete('/deleteCatalog', deleteCatalog);

module.exports = router;
