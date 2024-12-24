import { useState } from 'react';
import TodoForm from '../../components/TodoForm/TodoForm';
import TodoList from '../../components/TodoList/TodoList';
import styles from './ToDoEvents.module.sass';

const ToDoEvents = () => {
  const [events, setEvents] = useState([]);

  const addEvent = (event) => {
    setEvents([...events, event]);
  };

  return (
    <div className={styles.mainTodo}>
      <TodoForm onAddEvent={addEvent} />
      <TodoList events={events} />
    </div>
  );
};

export default ToDoEvents;
