import http from '../interceptor';

export const registerRequest = (data) => http.post('registration', data);
export const loginRequest = (data) => http.post('login', data);
export const updateContest = (data) => http.post('updateContest', data);
export const setNewOffer = (data) => http.post('setNewOffer', data);
export const setOfferStatus = (data) => http.post('setOfferStatus', data);
export const payMent = (data) => http.post('/users/pay', data.formData);
export const changeMark = (data) => http.post('changeMark', data);
export const getDialog = (data) => http.get('/chats/getChat', data);
export const dataForContest = (data) => http.post('/contests/dataForContest', data);
export const cashOut = (data) => http.post('cashout', data);
export const updateUser = (data) => http.put('/users/updateUser', data);
export const newMessage = (data) => http.post('newMessage', data);
export const changeChatFavorite = (data) => http.post('favorite', data);
export const changeChatBlock = (data) => http.post('blackList', data);
export const getCatalogList = (data) => http.post('getCatalogs', data);
export const addChatToCatalog = (data) => http.post('addNewChatToCatalog', data);
export const createCatalog = (data) => http.post('createCatalog', data);
export const deleteCatalog = (data) => http.post('deleteCatalog', data);
export const removeChatFromCatalog = (data) => http.post('removeChatFromCatalog', data);
export const changeCatalogName = (data) => http.post('updateNameCatalog', data);
export const getActiveContests = ({
  offset,
  limit,
  typeIndex,
  contestId,
  industry,
  awardSort,
  ownEntries,
}) => http.get('/contests/getAllContests', {
    offset,
    limit,
    typeIndex,
    contestId,
    industry,
    awardSort,
    ownEntries,
  });

export const downloadContestFile = (data) => http.get(`downloadFile/${data.fileName}`);
export const getUser = () => http.get('getUser');
export const getPreviewChat = () => http.get('/chats/getPreview');
export const getCustomersContests = (data) => http.get('/contests/getCustomersContests', {
    params: {
      limit: data.limit,
      offset: data.offset,
    },
    headers: {
      status: data.contestStatus,
    },
  });

export const getContestById = (data) =>
  http.get('/contests/getContestById', {
    headers: {
      contestId: data.contestId,
    },
  });
