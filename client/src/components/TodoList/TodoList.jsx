import React, { useMemo } from 'react';
import TimerToDo from '../TimerToDo/TimerToDo';
import styles from './TodoList.module.sass';

function TodoList({ events }) {

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)),
    [events]
  );
  
  return (
    <div className={styles.todoList}>
      {sortedEvents.length === 0 ? (
        <p className={styles.emptyMessage}>List is empty</p>
      ) : (
        <ul>
          {sortedEvents.map((event, index) => (
            <li key={index} className={styles.todoItem}>
              <h3>{event.title}</h3>
              <TimerToDo dateTime={event.dateTime} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
