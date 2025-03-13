import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import CONSTANTS from '../../../../constants';
import {
  goToExpandedDialog,
  changeChatFavorite,
  changeChatBlock,
  changeShowAddChatToCatalogMenu,
} from '../../../../store/slices/chatSlice';
import DialogBox from '../DialogBox/DialogBox';
import styles from './DialogList.module.sass';

const DialogList = (props) => {
  const chatContainerRef = useRef(null);

  const changeFavorite = (data, event) => {
    props.changeChatFavorite(data);
    event.stopPropagation();
  };

  const changeBlackList = (data, event) => {
    props.changeChatBlock(data);
    event.stopPropagation();
  };

  const changeShowCatalogCreation = (event, chatId) => {
    props.changeShowAddChatToCatalogMenu(chatId);
    event.stopPropagation();
  };

  const onlyFavoriteDialogs = (chatPreview, userId) =>
    chatPreview.favoriteList[chatPreview.participants.indexOf(userId)];

  const onlyBlockDialogs = (chatPreview, userId) =>
    chatPreview.blackList[chatPreview.participants.indexOf(userId)];

  const getTimeStr = (time) => {
    const currentTime = moment();
    if (currentTime.isSame(time, 'day')) return moment(time).format('HH:mm');
    if (currentTime.isSame(time, 'week')) return moment(time).format('dddd');
    if (currentTime.isSame(time, 'year')) return moment(time).format('MM DD');
    return moment(time).format('MMMM DD, YYYY');
  };

  const renderPreview = (filterFunc) => {
    const arrayList = [];
    const {
      userId,
      preview,
      goToExpandedDialog,
      chatMode,
      removeChat,
      interlocutor,
    } = props;

    preview.forEach((chatPreview, index) => {
      const isUserMessage = chatPreview.id === userId;
      const dialogNode = (
        <div
          key={`${chatPreview.id}-${index}`}
          className={isUserMessage ? styles.userMessage : styles.otherMessage}
        >
          <DialogBox
            interlocutor={chatPreview.interlocutor}
            chatPreview={chatPreview}
            userId={userId}
            getTimeStr={getTimeStr}
            changeFavorite={changeFavorite}
            changeBlackList={changeBlackList}
            chatMode={chatMode}
            catalogOperation={
              chatMode === CONSTANTS.CATALOG_PREVIEW_CHAT_MODE
                ? removeChat
                : changeShowCatalogCreation
            }
            goToExpandedDialog={goToExpandedDialog}
          />
        </div>
      );
      if (filterFunc && filterFunc(chatPreview, userId)) {
        arrayList.push(dialogNode);
      } else if (!filterFunc) {
        arrayList.push(dialogNode);
      }
    });
    return arrayList.length ? (
      arrayList
    ) : (
      <span className={styles.notFound}>Not found</span>
    );
  };

  const renderChatPreview = () => {
    const { chatMode } = props;
    if (chatMode === CONSTANTS.FAVORITE_PREVIEW_CHAT_MODE)
      return renderPreview(onlyFavoriteDialogs);
    if (chatMode === CONSTANTS.BLOCKED_PREVIEW_CHAT_MODE)
      return renderPreview(onlyBlockDialogs);
    return renderPreview();
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [props.preview]);

  return (
    <div className={styles.previewContainer} ref={chatContainerRef}>
      {renderChatPreview()}
    </div>
  );
};

const mapStateToProps = (state) => state.chatStore;

const mapDispatchToProps = (dispatch) => ({
  goToExpandedDialog: (data) => dispatch(goToExpandedDialog(data)),
  changeChatFavorite: (data) => dispatch(changeChatFavorite(data)),
  changeChatBlock: (data) => dispatch(changeChatBlock(data)),
  changeShowAddChatToCatalogMenu: (data) =>
    dispatch(changeShowAddChatToCatalogMenu(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DialogList);