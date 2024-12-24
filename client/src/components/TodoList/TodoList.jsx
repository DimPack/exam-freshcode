import React, { useEffect, useMemo, useState } from 'react';
import TimerToDo from '../TimerToDo/TimerToDo';
import styles from './TodoList.module.sass';
import MessageDelete from './MessageDelete/MessageDelete';

function TodoList({ events }) {

  const [todos, setTodos] = useState(events);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    setTodos(events);
  }, [events]);

  const sortedEvents = useMemo(
    () => [...todos].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)),
    [todos]
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
    setTodos((prevTodos) => prevTodos.filter((_, i) => i !== deleteIndex));
    closeModal();
  };

  return (
    <div className={styles.todoList}>
      {sortedEvents.length === 0 ? (
        <p className={styles.emptyMessage}>List is empty</p>
      ) : (
        <ul>
          {sortedEvents.map((event, index) => (
            <li key={index} className={styles.todoItem}>
              <h3 className={styles.todoTitle}>{event.title}</h3>
              <TimerToDo dateTime={event.dateTime} />
              <div className={styles.close} onClick={() => openModal(index)}></div>
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
