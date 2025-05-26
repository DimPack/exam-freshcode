import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCatalogList,
  removeChatFromCatalog,
} from '../../../../store/slices/chatSlice';
import CatalogList from '../CatalogList/CatalogList';
import DialogList from '../../DialogComponents/DialogList/DialogList';

const CatalogListContainer = () => {
  const dispatch = useDispatch();
  const chatStore = useSelector((state) => state.chatStore);
  const userStore = useSelector((state) => state.userStore);

  useEffect(() => {
    dispatch(getCatalogList());
  }, [dispatch]);

  const removeChatFromCatalogHandler = (event, chatId) => {
    const { _id } = chatStore.currentCatalog;
    dispatch(removeChatFromCatalog({ chatId, catalogId: _id }));
    event.stopPropagation();
  };

  const getDialogsPreview = () => {
    const { messagesPreview, currentCatalog } = chatStore;
    const { chats } = currentCatalog;
    const dialogsInCatalog = [];
    for (let i = 0; i < messagesPreview.length; i++) {
      for (let j = 0; j < chats.length; j++) {
        if (chats[j] === messagesPreview[i]._id) {
          dialogsInCatalog.push(messagesPreview[i]);
        }
      }
    }
    return dialogsInCatalog;
  };

  const { catalogList, isShowChatsInCatalog } = chatStore;
  const { id } = userStore.data;

  return (
    <>
      {isShowChatsInCatalog ? (
        <DialogList
          userId={id}
          preview={getDialogsPreview()}
          removeChat={removeChatFromCatalogHandler}
        />
      ) : (
        <CatalogList catalogList={catalogList} />
      )}
    </>
  );
};

export default CatalogListContainer;