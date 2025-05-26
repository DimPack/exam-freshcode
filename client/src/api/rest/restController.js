import http from '../interceptor';

export const registerRequest = (data) => http.post('registration', data);
export const loginRequest = (data) => http.post('login', data);

export const getAllOffers = (params) => {
  return http.get('/moderators/getAllOffers', {
    params: {
      page: params.page,
      amount: params.limit,
    },
  });

};
export const makeOfferVisible = (data) => {
  return http.post('/moderators/makeOfferVisible', data);
};

export const deleteOffer = (data) => {
  return http.post('/moderators/deleteOffer', data);
};

export const getUser = () => http.get('/users/getUser');
export const payMent = (data) => http.post('/users/pay', data.formData);
export const changeMark = (data) => http.post('/users/changeMark', data);
export const cashOut = (data) => http.post('/users/cashout', data);
export const updateUser = (data) => http.put('/users/updateUser', data);

export const getPreviewChat = () => http.get('/chats/getPreview');
export const getDialog = (data) => http.post('/chats/getChat', data);
export const newMessage = (data) => http.post('/chats/newMessage', data);
export const changeChatFavorite = (data) => http.patch('/chats/favorite', data);
export const changeChatBlock = (data) => http.patch('/chats/blackList', data);
export const getCatalogList = (data) => http.get('/chats/getCatalogs', data);
export const addChatToCatalog = (data) => http.patch('/chats/addNewChatToCatalog', data);
export const createCatalog = (data) => http.post('/chats/createCatalog', data);
export const removeChatFromCatalog = (data) => http.patch('/chats/removeChatFromCatalog', data);
export const changeCatalogName = (catalogId, data) => http.patch(`/chats/updateNameCatalog/${catalogId}`, data);
export const deleteCatalog = (catalogId) => http.delete(`/chats/deleteCatalog/${catalogId}`);

export const dataForContest = (data) => http.post('/contests/dataForContest', data);
export const updateContest = (data) => http.put('/contests/updateContest', data);
export const setNewOffer = (data) => http.post('/contests/setNewOffer', data);
export const setOfferStatus = (data) => http.post('/contests/setOfferStatus', data);
export const getActiveContests = ({
  offset,
  limit,
  typeIndex,
  contestId,
  industry,
  awardSort,
  ownEntries,
}) => http.post('/contests/getAllContests', {
    offset,
    limit,
    typeIndex,
    contestId,
    industry,
    awardSort,
    ownEntries,
  });

export const downloadContestFile = (data) => http.get(`downloadFile/${data.fileName}`);
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


  
