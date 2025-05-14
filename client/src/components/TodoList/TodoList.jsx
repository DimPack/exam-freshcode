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
  const [progressValues, setProgressValues] = useState({});

    const calculateProgress = (startTime, endTime) => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    if (now >= end) return 100;
    if (now <= start) return 0;
    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(100, Math.max(0, parseFloat(progress.toFixed(2))));
  };

  const handleTimerExpiration = (eventId) => {
    if (!expiredTimers[eventId]) {
      setExpiredTimers((prev) => ({ ...prev, [eventId]: true }));
      setProgressValues((prev) => ({ ...prev, [eventId]: 100 }));
      updateEventStatus(eventId);

      setTimeout(() => {
      setExpiredTimers(prev => ({...prev}));
    }, 50);
    }
  };

  useEffect(() => {
    const now = new Date();

    events.forEach((event) => {
      const eventDate = new Date(event.dateTime);

      if (eventDate.getTime() <= now.getTime() && !event.expired && !expiredTimers[event.id]) {
        handleTimerExpiration(event.id);
      }
    });
  }, [events, updateEventStatus, expiredTimers]);

  useEffect(() => {
    const interval = setInterval(() => {
      let updates = {};
      let hasUpdates = false;

      events.forEach((event) => {
        if (!event.expired && !expiredTimers[event.id]) {
          const currentProgress = progressValues[event.id] || 0;
          const newProgress = calculateProgress(
            event.startTime || new Date(0).toISOString(),
            event.dateTime
          );
          if (Math.abs(newProgress - currentProgress) >= 0.1) {
            updates[event.id] = newProgress;
            hasUpdates = true;
          }
        }
      });

      if (hasUpdates) {
        setProgressValues(prev => ({ ...prev, ...updates }));
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [events, expiredTimers]);

const renderedEvents = useMemo(() => {
  return events.map((event, index) => {
    const progress = progressValues[event.id] !== undefined 
      ? progressValues[event.id] 
      : calculateProgress(event.startTime, event.dateTime);
    const isExpired = event.expired || expiredTimers[event.id];

    return (
      <li
        key={event.id}
        className={`${styles.todoItem} ${isExpired ? styles.todoItemFinish : ''}`}
      >
        <p>{index + 1}.</p>
        <h3 className={styles.todoTitle}>{event.title}</h3>
        <TimerToDo
          dateTime={event.dateTime}
          onExpire={() => handleTimerExpiration(event.id)}
          reminderMinutes={event.reminderMinutes} // Передаємо час попередження
        />
        <div
          className={styles.close}
          onClick={() => openModal(event.id)}
        ></div>
        <div
          className={styles.progressBar}
          style={{ width: `${progress}%` }}
        ></div>
      </li>
    );
  });
}, [events, expiredTimers, progressValues, openModal]);

  return (
    <div className={styles.todoList}>
      {!Array.isArray(events) || events.length === 0 ? (
        <p className={styles.emptyMessage}>List is empty</p>
      ) : (
        <ul>{renderedEvents}</ul>
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