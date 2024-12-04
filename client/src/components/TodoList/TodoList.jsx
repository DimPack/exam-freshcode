import React from 'react';
import TimerToDo from '../TimerToDo/TimerToDo';

function TodoList({ events }) {
  return (
    <ul>
        
      {events.map((event, index) => (
        <li key={index}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <TimerToDo dateTime={event.dateTime} />
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
