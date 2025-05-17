import React, { useState, useEffect, useMemo } from 'react';
import TodoForm from '../../components/TodoForm/TodoForm';
import TodoList from '../../components/TodoList/TodoList';
import styles from './ToDoEvents.module.sass';

const ToDoEvents = ({ onCompletedEventsChange }) => {
  const [events, setEvents] = useState(() => {
    try {
      const savedEvents = localStorage.getItem('events');
      return savedEvents ? JSON.parse(savedEvents) : [];
    } catch (error) {
      console.error('Error loading events:', error);
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [completedEventsCount, setCompletedEventsCount] = useState(0);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    const count = events.filter(event => event.expired).length;
    setCompletedEventsCount(count);
    
    if (onCompletedEventsChange) {
      onCompletedEventsChange(count);
    }
    
    localStorage.setItem('completedEventsCount', count.toString());
  }, [events, onCompletedEventsChange]);

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
      reminderShown: false,
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
    </div>
  );
};

export default ToDoEvents;