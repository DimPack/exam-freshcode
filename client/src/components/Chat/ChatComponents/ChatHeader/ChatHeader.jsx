import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  backToDialogList,
  changeChatFavorite,
  changeChatBlock,
} from '../../../../store/slices/chatSlice';
import styles from './ChatHeader.module.sass';
import CONSTANTS from '../../../../constants';

const ChatHeader = ({ userId }) => {
  const dispatch = useDispatch();
  const interlocutor = useSelector((state) => state.chatStore.interlocutor);
  const chatData = useSelector((state) => state.chatStore.chatData);

  const changeFavorite = (data, event) => {
    dispatch(changeChatFavorite(data));
    event.stopPropagation();
  };

  const changeBlackList = (data, event) => {
    dispatch(changeChatBlock(data));
    event.stopPropagation();
  };

  const isFavorite = (chatData, userId) => {
    const { favoriteList, participants } = chatData;
    return favoriteList[participants.indexOf(userId)];
  };

  const isBlocked = (chatData, userId) => {
    const { participants, blackList } = chatData;
    return blackList[participants.indexOf(userId)];
  };

  const { avatar, firstName } = interlocutor || {};

  return (
    <div className={styles.chatHeader}>
      <div
        className={styles.buttonContainer}
        onClick={() => dispatch(backToDialogList())}
      >
        <img
          src={`${CONSTANTS.STATIC_IMAGES_PATH}arrow-left-thick.png`}
          alt="back"
        />
      </div>
      <div className={styles.infoContainer}>
        <div>
          <img
            src={
              avatar === 'anon.png'
                ? CONSTANTS.ANONYM_IMAGE_PATH
                : `${CONSTANTS.publicURL}/${avatar}`
            }
            alt="user"
          />
          <span>{firstName}</span>
        </div>
        {chatData && (
          <div>
            <i
              onClick={(event) =>
                changeFavorite(
                  {
                    participants: chatData.participants,
                    favoriteFlag: !isFavorite(chatData, userId),
                  },
                  event
                )
              }
              className={classNames({
                'far fa-heart': !isFavorite(chatData, userId),
                'fas fa-heart': isFavorite(chatData, userId),
              })}
            />
            <i
              onClick={(event) =>
                changeBlackList(
                  {
                    participants: chatData.participants,
                    blackListFlag: !isBlocked(chatData, userId),
                  },
                  event
                )
              }
              className={classNames({
                'fas fa-user-lock': !isBlocked(chatData, userId),
                'fas fa-unlock': isBlocked(chatData, userId),
              })}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;