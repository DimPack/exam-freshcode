import { useEffect, useMemo, useState } from 'react';
import TodoForm from '../../components/TodoForm/TodoForm';
import TodoList from '../../components/TodoList/TodoList';
import styles from './ToDoEvents.module.sass';


const ToDoEvents = ({ onCompletedEventsChange }) => {
  const [events, setEvents] = useState(() => {
    try {
      const savedEvents = localStorage.getItem('events');
      return savedEvents ? JSON.parse(savedEvents) : [];
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const addEvent = (event) => {
    if (!event || !event.title || !event.dateTime) {
      console.error('Invalid event data', event);
      return;
    }

    const eventDate = new Date(event.dateTime);
    if (isNaN(eventDate.getTime())) {
      console.error('Invalid date format:', event.dateTime);
      return;
    }

    const newEvent = { 
      ...event,
      id: Date.now(),
      expired: false,
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
  const eventIndex = events.findIndex(event => event.id === eventId);
  
  if (eventIndex === -1) {
    console.error('Event with ID not found:', eventId);
    return;
  }
  
  setDeleteIndex(eventIndex);
  setIsModalOpen(true);
};

  const closeModal = () => {
    setIsModalOpen(false);
    setDeleteIndex(null);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex === null || deleteIndex < 0 || deleteIndex >= events.length) {
      console.error('Invalid delete index:', deleteIndex);
      return;
    }
    setEvents((prevTodos) => prevTodos.filter((_, i) => i !== deleteIndex));
    closeModal();
    
    console.log(`Deleted event at index: ${deleteIndex}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      setEvents((prevEvents) => {
        let updated = false;
        const updatedEvents = prevEvents.map((event) => {
          if (new Date(event.dateTime) <= now && !event.expired) {
            updated = true;
            return { ...event, expired: true };
          }
          return event;
        });
        
        return updated ? updatedEvents : prevEvents;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const completedEventsCount = useMemo(() => {
    const count = events.filter((event) => event.expired).length;
    console.log(`Completed events count: ${count}`);
    return count;
  }, [events]);

  useEffect(() => {
    if (onCompletedEventsChange) {
      onCompletedEventsChange(completedEventsCount);
    }
  }, [completedEventsCount, onCompletedEventsChange]);

  useEffect(() => {
    try {
      localStorage.setItem('events', JSON.stringify(events));
      console.log('Events saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [events]);

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