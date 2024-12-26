import { useMemo, useState } from 'react';
import TodoForm from '../../components/TodoForm/TodoForm';
import TodoList from '../../components/TodoList/TodoList';
import styles from './ToDoEvents.module.sass';

const ToDoEvents = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const addEvent = (event) => {
    setEvents([...events, event]);
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

  return (
    <div className={styles.mainTodo}>
      <TodoForm onAddEvent={addEvent} />
      <TodoList
        events={sortedEvents}
        openModal={openModal}
        closeModal={closeModal}
        handleConfirmDelete={handleConfirmDelete}
        isModalOpen={isModalOpen}
      />
    </div>
  );
};

export default ToDoEvents;
