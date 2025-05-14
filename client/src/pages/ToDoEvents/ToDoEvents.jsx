import React, { useState, useEffect, useMemo } from 'react';
import TodoForm from '../../components/TodoForm/TodoForm';
import TodoList from '../../components/TodoList/TodoList';
import ReminderPopup from '../../components/TodoReminderPopup/TodoReminderPopup'; // Імпортуємо компонент
import styles from './ToDoEvents.module.sass';

const ToDoEvents = ({ onCompletedEventsChange }) => {
  const [events, setEvents] = useState(() => {
    try {
      const savedEvents = localStorage.getItem('events');
      return savedEvents ? JSON.parse(savedEvents) : [];
    } catch (error) {
      console.error('Error loading events from localStorage:', error);
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [completedEventsCount, setCompletedEventsCount] = useState(0);
  
  // Додаємо стан для відображення попередження
  const [reminderPopup, setReminderPopup] = useState({
    show: false,
    event: null,
    minutes: 0
  });

  // Зберігаємо події в локальне сховище
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  // Рахуємо кількість завершених подій
  useEffect(() => {
    const count = events.filter(event => event.expired).length;
    setCompletedEventsCount(count);
    
    if (onCompletedEventsChange) {
      onCompletedEventsChange(count);
    }
    
    localStorage.setItem('completedEventsCount', count.toString());
  }, [events, onCompletedEventsChange]);

  // Додаємо перевірку нагадувань
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      
      events.forEach(event => {
        if (event.reminderMinutes && !event.expired && !event.reminderShown) {
          const eventDate = new Date(event.dateTime);
          const reminderDate = new Date(eventDate.getTime() - (event.reminderMinutes * 60 * 1000));
          
          // Якщо поточний час більше або рівний часу нагадування,
          // але менший за час події, показуємо нагадування
          if (now >= reminderDate && now < eventDate) {
            // Перевіряємо, чи ще не показували це нагадування
            setReminderPopup({
              show: true,
              event: event,
              minutes: event.reminderMinutes
            });
            
            // Позначаємо подію як таку, для якої вже показано нагадування
            setEvents(prev => prev.map(e => 
              e.id === event.id ? { ...e, reminderShown: true } : e
            ));
          }
        }
      });
    };
    
    // Перевіряємо нагадування кожні 15 секунд
    const interval = setInterval(checkReminders, 15000);
    
    // Також перевіряємо одразу при завантаженні
    checkReminders();
    
    return () => clearInterval(interval);
  }, [events]);

  const addEvent = (event) => {
    const eventDate = new Date(event.dateTime);
    
    if (isNaN(eventDate.getTime())) {
      console.error('Invalid date format');
      return;
    }

    const newEvent = { 
      ...event,
      id: Date.now(),
      expired: false,
      reminderShown: false, // Додаємо флаг, щоб відстежувати показані нагадування
      startTime: new Date().toISOString()
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    console.log('Added new event:', newEvent);
  };

  const updateEventStatus = (eventId) => {
    console.log(`Updating event status for ID: ${eventId}`);
    
    setEvents((prevEvents) => {
      const eventIndex = prevEvents.findIndex(event => event.id === eventId);
      
      if (eventIndex === -1) {
        console.error('Event with ID not found:', eventId);
        return prevEvents;
      }
      
      const updatedEvents = [...prevEvents];
      updatedEvents[eventIndex].expired = true;
      
      return updatedEvents;
    });
  };

  const sortedEvents = useMemo(() => {
    try {
      return [...events].sort((a, b) => {
        if (a.expired !== b.expired) {
          return a.expired ? 1 : -1;
        }
        if (a.expired) {
          return new Date(b.dateTime) - new Date(a.dateTime);
        } else {
          return new Date(a.dateTime) - new Date(b.dateTime);
        }
      });
    } catch (error) {
      console.error('Error sorting events:', error);
      return events;
    }
  }, [events]);

  const openModal = (eventId) => {
    setDeleteIndex(eventId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDeleteIndex(null);
  };

  const handleConfirmDelete = () => {
    setEvents((prevEvents) => 
      prevEvents.filter(event => event.id !== deleteIndex)
    );
    closeModal();
  };
  
  // Функція для закриття попереднення
  const closeReminderPopup = () => {
    setReminderPopup({
      show: false,
      event: null,
      minutes: 0
    });
  };

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
      
      {/* Додаємо компонент попередження */}
      {reminderPopup.show && reminderPopup.event && (
        <ReminderPopup 
          event={reminderPopup.event}
          reminderMinutes={reminderPopup.minutes}
          onClose={closeReminderPopup}
        />
      )}
    </div>
  );
};

export default ToDoEvents;