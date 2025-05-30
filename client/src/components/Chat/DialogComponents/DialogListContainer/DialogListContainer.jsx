import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPreviewChat } from '../../../../store/slices/chatSlice';
import DialogList from '../DialogList/DialogList';

const DialogListContainer = ({ userId }) => {
  const dispatch = useDispatch();
  const messagesPreview = useSelector((state) => state.chatStore.messagesPreview);

  // Якщо потрібно отримувати прев'ю чатів при монтуванні, розкоментуй:
  // useEffect(() => {
  //   dispatch(getPreviewChat());
  // }, [dispatch]);

  return <DialogList preview={messagesPreview} userId={userId} />;
};

export default DialogListContainer;