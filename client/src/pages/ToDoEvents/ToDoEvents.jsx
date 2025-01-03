import { useEffect, useMemo, useState } from 'react';
import TodoForm from '../../components/TodoForm/TodoForm';
import TodoList from '../../components/TodoList/TodoList';
import styles from './ToDoEvents.module.sass';

const ToDoEvents = ({ onCompletedEventsChange }) => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const addEvent = (event) => {
    const newEvent = { ...event, expired: false };
    setEvents([...events, newEvent]);
  };

  const updateEventStatus = (eventIndex) => {
    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents];
      updatedEvents[eventIndex].expired = true;
      return updatedEvents;
    });
  };

  const sortedEvents = useMemo(
    () =>
      [...events].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)),
    [events]
  );

  const openModal = (index) => {
    setDeleteIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDeleteIndex(null);
  };
  const handleConfirmDelete = () => {
    setEvents((prevTodos) => prevTodos.filter((_, i) => i !== deleteIndex));
    closeModal();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setEvents((prevEvents) =>
        prevEvents.map((event, index) => {
          if (new Date(event.dateTime) <= now && !event.expired) {
            updateEventStatus(index);
          }
          return event;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [events]);

  const completedEventsCount = useMemo(
    () => events.filter((event) => event.expired).length,
    [events]
  );

  useEffect(() => {
    if (onCompletedEventsChange) {
      onCompletedEventsChange(completedEventsCount);
    }
  }, [completedEventsCount, onCompletedEventsChange]);

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
