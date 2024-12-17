import React from 'react';
import TimerToDo from '../TimerToDo/TimerToDo';
import styles from './TodoList.module.sass';

function TodoList({ events }) {
  return (
    <div className={styles.todoList}>
      {events.length === 0 ? (
        <p className={styles.emptyMessage}>List is empty</p>
      ) : (
        <ul >
          {events.map((event, index) => (
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
