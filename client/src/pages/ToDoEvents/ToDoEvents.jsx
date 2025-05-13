import { useEffect, useMemo, useState } from 'react';
import TodoForm from '../../components/TodoForm/TodoForm';
import TodoList from '../../components/TodoList/TodoList';
import styles from './ToDoEvents.module.sass';

/**
 * Компонент для управління списком подій (To-Do)
 * @param {function} onCompletedEventsChange - Функція, яка викликається при зміні кількості завершених подій
 */
const ToDoEvents = ({ onCompletedEventsChange }) => {
  // Ініціалізація стану з localStorage
  const [events, setEvents] = useState(() => {
    try {
      const savedEvents = localStorage.getItem('events');
      return savedEvents ? JSON.parse(savedEvents) : [];
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  });
  
  // Стан для модального вікна підтвердження видалення
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  /**
   * Додавання нової події
   * @param {Object} event - Об'єкт з даними події
   */
  const addEvent = (event) => {
    // Перевірка валідності даних події
    if (!event || !event.title || !event.dateTime) {
      console.error('Invalid event data', event);
      return;
    }

    // Перевірка, що дата валідна
    const eventDate = new Date(event.dateTime);
    if (isNaN(eventDate.getTime())) {
      console.error('Invalid date format:', event.dateTime);
      return;
    }

    // Створення нової події
    const newEvent = { 
      ...event, 
      expired: false,
      startTime: new Date().toISOString()
    };

    // Додавання події до стану
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    console.log('Added new event:', newEvent);
  };

  /**
   * Оновлення статусу події на "завершена"
   * @param {number} eventIndex - Індекс події в масиві
   */
  const updateEventStatus = (eventIndex) => {
    console.log(`Updating event status for index: ${eventIndex}`);
    
    setEvents((prevEvents) => {
      // Перевірка валідності індексу
      if (eventIndex < 0 || eventIndex >= prevEvents.length) {
        console.error('Invalid event index:', eventIndex);
        return prevEvents;
      }
      
      // Оновлення статусу події
      const updatedEvents = [...prevEvents];
      updatedEvents[eventIndex].expired = true;
      
      return updatedEvents;
    });
  };

  /**
   * Сортування подій: невиконані події зверху, виконані внизу
   * У кожній групі сортування йде за часом
   */
  const sortedEvents = useMemo(() => {
    try {
      return [...events].sort((a, b) => {
        // Спочатку порівнюємо за статусом expired
        if (a.expired !== b.expired) {
          // Невиконані (false) йдуть нагору, виконані (true) - вниз
          return a.expired ? 1 : -1;
        }
        
        // Якщо обидві події мають однаковий статус, сортуємо за часом
        // Для невиконаних подій: від найближчих до найвіддаленіших
        // Для виконаних подій: від нещодавно виконаних до давно виконаних
        if (a.expired) {
          // Виконані події: нещодавно виконані вище
          return new Date(b.dateTime) - new Date(a.dateTime);
        } else {
          // Невиконані події: найближчі вище
          return new Date(a.dateTime) - new Date(b.dateTime);
        }
      });
    } catch (error) {
      console.error('Error sorting events:', error);
      return events;
    }
  }, [events]);

  /**
   * Відкриття модального вікна для підтвердження видалення
   * @param {number} index - Індекс події для видалення
   */
  const openModal = (index) => {
    if (index < 0 || index >= events.length) {
      console.error('Invalid index for modal:', index);
      return;
    }
    setDeleteIndex(index);
    setIsModalOpen(true);
  };

  /**
   * Закриття модального вікна
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setDeleteIndex(null);
  };

  /**
   * Обробка підтвердження видалення події
   */
  const handleConfirmDelete = () => {
    if (deleteIndex === null || deleteIndex < 0 || deleteIndex >= events.length) {
      console.error('Invalid delete index:', deleteIndex);
      return;
    }
    setEvents((prevTodos) => prevTodos.filter((_, i) => i !== deleteIndex));
    closeModal();
    
    console.log(`Deleted event at index: ${deleteIndex}`);
  };

  /**
   * Ефект для регулярної перевірки, чи настав час події
   * ВАЖЛИВО: Цей ефект має залежність від events, що може викликати додаткові рендери
   * Можна розглянути використання useRef для мінімізації залежностей
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      setEvents((prevEvents) => {
        // Перевіряємо, чи є події для оновлення
        let updated = false;
        const updatedEvents = prevEvents.map((event) => {
          // Перевіряємо, чи час події вже настав і чи подія ще не позначена як завершена
          if (new Date(event.dateTime) <= now && !event.expired) {
            updated = true;
            return { ...event, expired: true };
          }
          return event;
        });
        
        // Повертаємо оновлений масив тільки якщо були зміни
        return updated ? updatedEvents : prevEvents;
      });
    }, 1000);
    
    // Очищення інтервалу при розмонтуванні компонента
    return () => clearInterval(interval);
  }, []); // Видалено залежність від events, щоб запобігти зациклюванню

  /**
   * Підрахунок кількості завершених подій
   */
  const completedEventsCount = useMemo(() => {
    const count = events.filter((event) => event.expired).length;
    console.log(`Completed events count: ${count}`);
    return count;
  }, [events]);

  /**
   * Сповіщення про зміну кількості завершених подій
   */
  useEffect(() => {
    if (onCompletedEventsChange) {
      onCompletedEventsChange(completedEventsCount);
    }
  }, [completedEventsCount, onCompletedEventsChange]);

  /**
   * Збереження подій у localStorage при кожній зміні
   */
  useEffect(() => {
    try {
      localStorage.setItem('events', JSON.stringify(events));
      console.log('Events saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [events]);
  
  /**
   * Рендеринг компонента
   */
  return (
    <div className={styles.mainTodo}>
      <TodoForm onAddEvent={addEvent} />
      <TodoList
        events={sortedEvents}
        openModal={openModal}
        closeModal={closeModal}
        handleConfirmDelete={handleConfirmDelete}
        isModalOpen={isModalOpen}
        updateEventStatus={updateEventStatus}
      />
    </div>
  );
};

export default ToDoEvents;