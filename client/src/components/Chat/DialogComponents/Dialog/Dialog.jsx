import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';
import {
  getDialogMessages,
  clearMessageList,
} from '../../../../store/slices/chatSlice';
import ChatHeader from '../../ChatComponents/ChatHeader/ChatHeader';
import styles from './Dialog.module.sass';
import ChatInput from '../../ChatComponents/ChatInut/ChatInput';

const Dialog = (props) => {
  const {
    interlocutor,
    getDialog,
    clearMessageList,
    messages,
    userId,
    chatData,
  } = props;

  const messagesEnd = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  useEffect(() => {
    if (interlocutor && interlocutor.id) {
      getDialog({ interlocutorId: interlocutor.id });
    }
  }, [interlocutor, getDialog]);

  useEffect(() => {
    return () => {
      clearMessageList();
    };
  }, [clearMessageList]);

  useEffect(() => {
    if (!isUserScrolling && messagesEnd.current) {
      scrollToBottom();
    }
  }, [messages, isUserScrolling]);

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight < scrollHeight) {
      setIsUserScrolling(true);
    } else {
      setIsUserScrolling(false);
    }
  };

  const renderMainDialog = () => {
    const messagesArray = [];
    let currentTime = moment();
    messages.forEach((message, i) => {
      if (!currentTime.isSame(message.createdAt, 'date')) {
        messagesArray.push(
          <div key={message.createdAt} className={styles.date}>
            {moment(message.createdAt).format('MMMM DD, YYYY')}
          </div>
        );
        currentTime = moment(message.createdAt);
      }
      messagesArray.push(
        <div
          key={i}
          className={classNames(
            userId === message.senderId ? styles.ownMessage : styles.interlocutorMessage
          )}
        >
          <span>{message.body}</span>
          <span className={styles.messageTime}>
            {moment(message.createdAt).format('HH:mm')}
          </span>
          <div ref={i === messages.length - 1 ? messagesEnd : null} />
        </div>
      );
    });
    return (
      <div className={styles.messageList} onScroll={handleScroll}>
        {messagesArray}
      </div>
    );
  };

  const blockMessage = () => {
    const { blackList, participants } = chatData;
    const userIndex = participants.indexOf(userId);
    let message;
    if (chatData && blackList[userIndex]) {
      message = 'You block him';
    } else if (chatData && blackList.includes(true)) {
      message = 'He block you';
    }
    return <span className={styles.messageBlock}>{message}</span>;
  };

  return (
    <>
      <ChatHeader userId={userId} />
      {renderMainDialog()}
      <div ref={messagesEnd} />
      {chatData && chatData.blackList.includes(true) ? (
        blockMessage()
      ) : (
        <ChatInput />
      )}
    </>
  );
};

const mapStateToProps = (state) => state.chatStore;

const mapDispatchToProps = (dispatch) => ({
  getDialog: (data) => dispatch(getDialogMessages(data)),
  clearMessageList: () => dispatch(clearMessageList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);