import React, { useEffect, useMemo, useState } from 'react';
import TimerToDo from '../TimerToDo/TimerToDo';
import styles from './TodoList.module.sass';
import MessageDelete from './MessageDelete/MessageDelete';

/**
 * Компонент для відображення списку подій (To-Do)
 */
function TodoList({
  events,
  openModal,
  closeModal,
  handleConfirmDelete,
  isModalOpen,
  updateEventStatus,
}) {
  // Логування подій для діагностики
  console.log('All events:', events);

  // Стан для відстеження завершених таймерів на рівні компонента
  const [expiredTimers, setExpiredTimers] = useState({});
  
  // Стан для відстеження прогресу кожної події
  const [progressValues, setProgressValues] = useState({});

  /**
   * Розраховує прогрес події у відсотках
   * @param {string} startTime - Час створення події
   * @param {string} endTime - Час закінчення події
   * @returns {number} Відсоток прогресу (0-100)
   */
const calculateProgress = (startTime, endTime) => {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  
  // Якщо час вже минув, повертаємо 100%
  if (now >= end) return 100;
  
  // Якщо час ще не настав, повертаємо 0%
  if (now <= start) return 0;
  
  // Розраховуємо відсоток виконання (з більшою точністю)
  const progress = ((now - start) / (end - start)) * 100;
  // Округляємо до 2 знаків після коми для плавнішого оновлення
  return Math.min(100, Math.max(0, parseFloat(progress.toFixed(2))));
};

  /**
   * Обробник закінчення таймера події
   * @param {number} index - Індекс події в масиві
   */
  const handleTimerExpiration = (index) => {
    console.log(`Timer expired for event ${index}:`, {
      event: events[index],
      isAlreadyExpired: expiredTimers[index]
    });
    
    // Позначаємо таймер як завершений лише якщо він ще не завершений
    if (!expiredTimers[index]) {
      console.log(`Setting expired status for event ${index}`);
      
      // Оновлюємо локальний стан
      setExpiredTimers((prev) => ({ ...prev, [index]: true }));
      setProgressValues((prev) => ({ ...prev, [index]: 100 }));
      
      // Викликаємо функцію оновлення статусу в батьківському компоненті
      console.log(`Calling updateEventStatus for event ${index}`);
      updateEventStatus(index);
    }
  };

  /**
   * Ефект для перевірки таймерів при завантаженні компонента
   * або коли змінюється масив подій
   */
  useEffect(() => {
    const now = new Date();
    
    // console.log('Checking events on component load/update');
    
    events.forEach((event, index) => {
      const eventDate = new Date(event.dateTime);
      
      // // Детальне логування для діагностики
      // console.log(`Checking event ${index}: "${event.title}"`, {
      //   eventTime: eventDate.toLocaleString(),
      //   currentTime: now.toLocaleString(),
      //   difference: eventDate - now,
      //   isExpired: eventDate <= now,
      //   currentStatus: event.expired
      // });
      
      // Якщо час події вже минув і подія ще не позначена як завершена
      if (eventDate.getTime() <= now.getTime() && !event.expired) {
        console.log(`Event ${index} should be marked as expired`);
        handleTimerExpiration(index);
      }
    });
  }, [events, updateEventStatus]);

  /**
   * Ефект для регулярного оновлення прогресу
   */
useEffect(() => {
  const interval = setInterval(() => {
    let updates = {};
    let hasUpdates = false;

    events.forEach((event, index) => {
      // Оновлюємо прогрес для незавершених подій
      if (!event.expired && !expiredTimers[index]) {
        // Отримуємо поточний прогрес
        const currentProgress = progressValues[index] || 0;
        // Розраховуємо новий прогрес
        const newProgress = calculateProgress(
          event.startTime || new Date(0).toISOString(), // default fallback
          event.dateTime
        );
        
        // Важливо: оновлюємо навіть при незначних змінах для плавної анімації
        // Замість перевірки на рівність, оновлюємо, якщо різниця >= 0.1%
        if (Math.abs(newProgress - currentProgress) >= 0.1) {
          updates[index] = newProgress;
          hasUpdates = true;
        }
      }
    });

    // Оновлюємо стан тільки якщо є зміни
    if (hasUpdates) {
      setProgressValues(prev => ({ ...prev, ...updates }));
    }
  }, 100); // Зменшуємо інтервал до 100 мс для плавнішої анімації
  
  return () => clearInterval(interval);
}, [events, expiredTimers]);

  /**
   * Мемоізований рендеринг списку подій
   */
  const renderedEvents = useMemo(() => {
    // console.log('Rendering event list');
    
    return events.map((event, index) => {
      // Обчислюємо прогрес для події
      const progress = progressValues[index] !== undefined 
        ? progressValues[index] 
        : calculateProgress(event.startTime, event.dateTime);
      
      // Визначаємо, чи подія завершена (з глобального або локального стану)
      const isExpired = event.expired || expiredTimers[index];

      return (
        <li
          key={event.id || index}
          className={`${styles.todoItem} ${isExpired ? styles.todoItemFinish : ''}`}
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
          {/* Індикатор прогресу */}
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