import http from '../interceptor';

export const registerRequest = (data) => http.post('registration', data);
export const loginRequest = (data) => http.post('login', data);
export const updateContest = (data) => http.put('/contests/updateContest', data);
export const setNewOffer = (data) => http.post('/contests/setNewOffer', data);
export const setOfferStatus = (data) => http.post('/contests/setOfferStatus', data);
export const getUser = () => http.get('/users/getUser');

export const getAllOffers = (params) => {
  return http.get('/moderators/getAllOffers', {
    params: {
      page: params.page,
      amount: params.limit,
    },
  });
};export const updateOfferStatus = (data) => {
  return http.patch('/moderators/updateOfferStatus', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response;
  }).catch(error => {
    console.error('Error updating offer status:', error);
    throw error;
  });
};




export const payMent = (data) => http.post('/users/pay', data.formData);
export const changeMark = (data) => http.post('/users/changeMark', data);
export const getDialog = (data) => http.post('/chats/getChat', data);
export const dataForContest = (data) => http.post('/contests/dataForContest', data);
export const cashOut = (data) => http.post('/users/cashout', data);
export const updateUser = (data) => http.put('/users/updateUser', data);
export const newMessage = (data) => http.post('/chats/newMessage', data);
export const changeChatFavorite = (data) => http.patch('/chats/favorite', data);
export const changeChatBlock = (data) => http.patch('/chats/blackList', data);
export const getCatalogList = (data) => http.get('/chats/getCatalogs', data);
export const addChatToCatalog = (data) => http.patch('/chats/addNewChatToCatalog', data);
export const createCatalog = (data) => http.post('/chats/createCatalog', data);
export const deleteCatalog = (data) => http.patch('/chats/deleteCatalog', data);
export const removeChatFromCatalog = (data) => http.patch('/chats/removeChatFromCatalog', data);
export const changeCatalogName = (data) => http.patch('/chats/updateNameCatalog', data);
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


  
