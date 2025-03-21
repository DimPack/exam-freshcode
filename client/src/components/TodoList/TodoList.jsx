import React, { useEffect, useMemo, useState } from 'react';
import TimerToDo from '../TimerToDo/TimerToDo';
import styles from './TodoList.module.sass';
import MessageDelete from './MessageDelete/MessageDelete';

function TodoList({
  events,
  openModal,
  closeModal,
  handleConfirmDelete,
  isModalOpen,
  updateEventStatus,
}) {
  const [expiredTimers, setExpiredTimers] = useState({});

  const handleTimerExpiration = (index) => {
    setExpiredTimers((prev) => ({ ...prev, [index]: true }));
    updateEventStatus(index);
  };

  useEffect(() => {
    events.forEach((event, index) => {
      if (new Date(event.dateTime) <= new Date() && !event.expired) {
        handleTimerExpiration(index);
      }
    });
  }, [events, updateEventStatus]);

  return (
    <div className={styles.todoList}>
      {events.length === 0 ? (
        <p className={styles.emptyMessage}>List is empty</p>
      ) : (
        <ul>
          {events.map((event, index) => (
            <li
              key={index}
              className={`${styles.todoItem} ${
                event.expired || expiredTimers[index]
                  ? styles.todoItemFinish
                  : ''
              }`}
            >
              <p>{index + 1}.</p>
              <h3 className={styles.todoTitle}>{event.title}</h3>
              <TimerToDo
                dateTime={event.dateTime}
                onExpire={() => handleTimerExpiration(index)}
              />
              <div
                className={styles.close}
                onClick={() => openModal(index)}
              ></div>
            </li>
          ))}
        </ul>
      )}

      <MessageDelete
        isOpen={isModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default TodoList;
